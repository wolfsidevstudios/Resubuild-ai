
import { GoogleGenAI } from "@google/genai";
import { ResumeData, Experience, ResumeAuditResult } from "../types";
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

// --- NEW FEATURES ---

export const auditResume = async (data: ResumeData): Promise<ResumeAuditResult> => {
    // Minify data to save tokens
    const context = JSON.stringify({
        summary: data.personalInfo.summary,
        experience: data.experience.map(e => e.description),
        skills: data.skills
    });

    const prompt = `
        You are a strict Hiring Manager AI. Audit the following resume content.
        Return a JSON object with:
        - score: number (0-100)
        - summary: string (1 sentence overview of quality)
        - strengths: string[] (3 bullet points of what is good)
        - improvements: string[] (3 specific bullet points on what to fix, e.g. "Quantify results in X role")

        Resume Data:
        ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Audit failed:", error);
        // Fallback
        return {
            score: 75,
            summary: "Resume looks decent but needs more quantification.",
            strengths: ["Good structure", "Clear timeline"],
            improvements: ["Add more metrics", "Use stronger action verbs", "Tailor skills to job"]
        };
    }
};

export const generateCoverLetter = async (data: ResumeData, jobDescription: string, companyName: string): Promise<string> => {
    const prompt = `
        Write a compelling, professional cover letter for ${data.personalInfo.fullName}.
        
        Target Role: ${data.personalInfo.jobTitle}
        Target Company: ${companyName}
        Job Description Context: ${jobDescription.substring(0, 500)}...
        
        Candidate Resume Context:
        Summary: ${data.personalInfo.summary}
        Top Skills: ${data.skills.slice(0,5).join(', ')}
        Recent Role: ${data.experience[0]?.position} at ${data.experience[0]?.company}
        
        Tone: Professional, confident, yet approachable. 
        Output: Plain text only. No markdown placeholders like [Your Name]. Fill in all details.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Cover letter generation failed:", error);
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

// --- Resupilot (Vibe Create) ---

export const generateResumeFromPrompt = async (userPrompt: string): Promise<ResumeData> => {
    const prompt = `
        You are Resupilot, an expert AI resume builder. 
        Create a complete, high-quality JSON resume based on the following user description: "${userPrompt}".
        
        Rules:
        1. Infer missing details realistically (e.g. if they say "Senior React Dev", infer logical skills like TypeScript, Redux, Node.js).
        2. Create at least 2 realistic experience entries with rich descriptions.
        3. Create education entries.
        4. Generate a strong professional summary.
        5. Return ONLY valid JSON matching the ResumeData structure.
        
        Structure needed:
        {
            "personalInfo": { "fullName", "jobTitle", "email", "phone", "location", "summary", "website" },
            "experience": [{ "id", "company", "position", "startDate", "endDate", "current", "description" }],
            "education": [{ "id", "institution", "degree", "field", "graduationDate" }],
            "projects": [{ "id", "name", "description", "link" }],
            "skills": ["string"],
            "themeColor": "#000000"
        }
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
        
        const text = response.text?.trim() || "{}";
        const partialData = JSON.parse(text);
        
        // Hydrate with IDs and defaults to ensure type safety
        return {
            id: crypto.randomUUID(),
            name: partialData.personalInfo?.fullName ? `${partialData.personalInfo.fullName}'s Resume` : 'AI Generated Resume',
            templateId: 'modern',
            lastUpdated: Date.now(),
            customSections: [],
            personalInfo: {
                fullName: partialData.personalInfo?.fullName || "Your Name",
                email: partialData.personalInfo?.email || "",
                phone: partialData.personalInfo?.phone || "",
                location: partialData.personalInfo?.location || "",
                website: partialData.personalInfo?.website || "",
                jobTitle: partialData.personalInfo?.jobTitle || "",
                summary: partialData.personalInfo?.summary || "",
            },
            experience: (partialData.experience || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            education: (partialData.education || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            projects: (partialData.projects || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            skills: partialData.skills || [],
            themeColor: partialData.themeColor || "#000000"
        };

    } catch (error) {
        console.error("Resupilot generation failed:", error);
        throw error;
    }
};
