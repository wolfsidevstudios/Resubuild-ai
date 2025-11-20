
import { GoogleGenAI } from "@google/genai";
import { ResumeData, Experience } from "../types";
import { getStoredAPIKey } from "./storageService";
import { PublishedResume } from "./supabase";

// Helper to get the AI instance dynamically
const getAI = () => {
  // Prioritize user's stored key, fallback to env if available
  const apiKey = getStoredAPIKey() || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Gemini API Key in Settings.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateResumeSummary = async (data: ResumeData): Promise<string> => {
  const prompt = `
    Act as a professional career coach. Write a compelling, modern professional summary (max 3-4 sentences) for a resume based on the following profile.
    Do not include markdown formatting like **bold** or *italic*. Keep it clean plain text.
    
    Name: ${data.personalInfo.fullName}
    Target Job Title: ${data.personalInfo.jobTitle}
    Key Skills: ${data.skills.join(', ')}
    Recent Experience: ${data.experience.map(e => `${e.position} at ${e.company}`).join(', ')}
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};

export const improveJobDescription = async (description: string, jobTitle: string): Promise<string> => {
  const prompt = `
    Act as a professional resume writer. Rewrite the following job description for a "${jobTitle}" role.
    Turn it into 3-5 punchy, result-oriented bullet points starting with strong action verbs.
    Do not use markdown formatting (no bullets *, just new lines or plain dashes).
    
    Original Description:
    ${description}
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error improving description:", error);
    throw error;
  }
};

export const suggestSkills = async (jobTitle: string, currentDescription: string): Promise<string[]> => {
  const prompt = `
    Based on the job title "${jobTitle}" and the following experience context, suggest a list of 8-10 relevant technical and soft skills.
    Return the result as a comma-separated list ONLY. No other text.
    
    Context:
    ${currentDescription}
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const text = response.text?.trim() || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Error suggesting skills:", error);
    throw error;
  }
};

// --- Brand / Employer Matching ---

export const findBestCandidates = async (
    employerQuery: string, 
    candidates: PublishedResume[]
): Promise<{ candidateId: string; reason: string; score: number }[]> => {
    
    // We minimize the candidate data payload to save tokens
    const candidateSummaries = candidates.map(c => ({
        id: c.user_id,
        name: c.full_name,
        title: c.job_title,
        skills: c.skills,
        summary: c.resume_data.personalInfo.summary,
        recent_role: c.resume_data.experience[0]?.position
    }));

    const prompt = `
        You are an expert AI Recruiter. 
        Employer Requirement: "${employerQuery}"
        
        Analyze the following list of candidates and identify the best matches.
        Return a JSON array of objects with properties: 'candidateId', 'reason' (brief 1 sentence explanation), and 'score' (0-100).
        Only return candidates with a score > 60. If no good matches, return empty array.
        
        Candidates:
        ${JSON.stringify(candidateSummaries)}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text?.trim() || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Error matching candidates:", error);
        return [];
    }
};
