
import { GoogleGenAI } from "@google/genai";
import { ResumeData, Experience } from "../types";
import { getStoredAPIKey } from "./storageService";

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
