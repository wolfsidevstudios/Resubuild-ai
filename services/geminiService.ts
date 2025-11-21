
import { GoogleGenAI } from "@google/genai";
import { ResumeData, Experience, ResumeAuditResult, CareerPathSuggestion, LinkedInContent, PublishedResume, CustomAgent, FormProject } from "../types";
import { getStoredAPIKey, getPreferredModel } from "./storageService";

// Helper to get the AI instance dynamically
const getAI = () => {
  // Prioritize user's stored key, fallback to env if available
  const apiKey = getStoredAPIKey() || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Gemini API Key in Settings.");
  }
  
  return new GoogleGenAI({ apiKey });
};

// Helper to resolve the model name based on preference, but allow overrides for specific tasks
const getModel = (taskComplexity: 'basic' | 'complex' = 'basic'): string => {
    const preferred = getPreferredModel();
    
    // If user selected a specific model in settings, try to respect it, 
    // but for complex reasoning tasks (like LinkedIn parsing), we might force a smarter model if the preference is too weak.
    
    if (taskComplexity === 'complex') {
        // If user explicitly set a "Pro" model, use it. Otherwise default to 3-pro for complex tasks.
        if (preferred.includes('pro')) return preferred;
        return 'gemini-3-pro-preview';
    }
    
    return preferred; 
};

// --- STANDARD MODE ---

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
      model: getModel('basic'),
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
      model: getModel('basic'),
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
      model: getModel('basic'),
      contents: prompt,
    });
    const text = response.text?.trim() || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Error suggesting skills:", error);
    throw error;
  }
};

export const auditResume = async (data: ResumeData): Promise<ResumeAuditResult> => {
    // Basic Audit
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
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Audit failed:", error);
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
            model: getModel('complex'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Cover letter generation failed:", error);
        throw error;
    }
};

// --- ADVANCED MODE (Reasoning) ---

export const performDeepAudit = async (data: ResumeData): Promise<ResumeAuditResult> => {
    const context = JSON.stringify(data);

    const prompt = `
        Analyze this resume deeply. Identify gaps in career history, vague impact statements, and overused buzzwords.
        Critique it like a Fortune 500 executive recruiter.
        
        Return JSON:
        {
            "score": number (0-100, be strict),
            "summary": "Detailed paragraph critique",
            "strengths": ["Detailed strength 1", "Detailed strength 2", "Detailed strength 3"],
            "improvements": ["Specific actionable fix 1", "Specific actionable fix 2", "Specific actionable fix 3"]
        }
        
        Resume: ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Explicitly use 3-pro for deep audit
            contents: prompt,
            config: { 
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 2048 } 
            }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Deep audit failed:", error);
        throw error;
    }
};

export const suggestCareerPaths = async (data: ResumeData): Promise<CareerPathSuggestion[]> => {
    const context = JSON.stringify({
        title: data.personalInfo.jobTitle,
        skills: data.skills,
        experience: data.experience.map(e => ({ role: e.position, desc: e.description }))
    });

    const prompt = `
        Based on this user's experience and skills, suggest 3 potential career paths they could transition into or advance towards.
        Analyze their skill gaps for each role.
        
        Return JSON Array:
        [
            {
                "role": "Next Level Role Title",
                "matchScore": 85,
                "missingSkills": ["Skill A", "Skill B"],
                "reasoning": "Why this is a good fit..."
            }
        ]
        
        Data: ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json'
            }
        });
        const text = response.text?.trim() || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Career path failed:", error);
        return [];
    }
};

export const generateLinkedInContent = async (data: ResumeData): Promise<LinkedInContent> => {
    const context = JSON.stringify(data);
    const prompt = `
        Transform this resume into a high-impact LinkedIn profile.
        
        Return JSON:
        {
            "headline": "Catchy, keyword-rich headline (max 220 chars)",
            "about": "Engaging first-person bio (max 2000 chars) using storytelling",
            "posts": ["Draft text for a LinkedIn post announcing a job search or sharing expertise"]
        }
        
        Resume: ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json'
            }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("LinkedIn gen failed:", error);
        throw error;
    }
};

export const generateResumeFromLinkedIn = async (url: string): Promise<ResumeData> => {
    const prompt = `
        You are a professional LinkedIn-to-Resume agent.
        The user has provided this LinkedIn URL: "${url}".
        
        Since you cannot browse the live web, perform the following:
        1. Analyze the URL structure to infer the person's likely name (e.g. linkedin.com/in/john-doe).
        2. If the user provided extra text content along with the URL, prioritize that.
        3. Generate a HIGH-QUALITY, REALISTIC resume JSON that *could* match this professional persona. 
           - Infer a likely Job Title based on the context or make a generic professional one.
           - Generate 3 realistic, detailed experience entries with strong metrics.
           - Generate realistic education and skills.
        
        Return ONLY valid JSON matching this structure:
        {
            "personalInfo": { "fullName", "jobTitle", "email" (placeholder), "phone" (placeholder), "location", "summary", "website": "${url}" },
            "experience": [{ "id", "company", "position", "startDate", "endDate", "current", "description" }],
            "education": [{ "id", "institution", "degree", "field", "graduationDate" }],
            "projects": [{ "id", "name", "description", "link" }],
            "skills": ["string"],
            "themeColor": "#0077b5"
        }
    `;

    try {
        // Use Gemini 3 Pro Preview for best reasoning capability for this complex task
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const text = response.text?.trim() || "{}";
        const partialData = JSON.parse(text);

        return {
            id: crypto.randomUUID(),
            name: partialData.personalInfo?.fullName ? `${partialData.personalInfo.fullName} (LinkedIn)` : 'LinkedIn Import',
            templateId: 'professional', // LinkedIn imports usually look good in professional
            lastUpdated: Date.now(),
            customSections: [],
            personalInfo: {
                fullName: partialData.personalInfo?.fullName || "Imported Profile",
                email: partialData.personalInfo?.email || "",
                phone: partialData.personalInfo?.phone || "",
                location: partialData.personalInfo?.location || "",
                website: partialData.personalInfo?.website || url,
                jobTitle: partialData.personalInfo?.jobTitle || "",
                summary: partialData.personalInfo?.summary || "",
            },
            experience: (partialData.experience || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            education: (partialData.education || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            projects: (partialData.projects || []).map((e: any) => ({ ...e, id: crypto.randomUUID() })),
            skills: partialData.skills || [],
            themeColor: partialData.themeColor || "#0077b5"
        };

    } catch (error) {
        console.error("LinkedIn Import failed:", error);
        throw error;
    }
};

export const generateInteractivePortfolio = async (data: ResumeData): Promise<string> => {
    const context = JSON.stringify(data);
    const prompt = `
        You are a world-class frontend engineer. 
        Create a single-file HTML personal portfolio website based on the resume data provided.
        
        Requirements:
        1. Use Tailwind CSS via CDN.
        2. Use Alpine.js via CDN for interactivity (mobile menu, modal, etc).
        3. Design: Modern, minimalist, "Bento grid" or "Apple-style" clean aesthetic.
        4. Features:
           - Hero section with name and title.
           - Interactive Experience timeline (animate on scroll using IntersectionObserver).
           - Skills section with hover effects.
           - A 'Contact Me' button that opens a mailto link.
           - Dark mode support if possible (or just a really nice dark theme default).
        5. The output must be ONLY the raw HTML code (starting with <!DOCTYPE html>). No markdown code blocks.
        
        Resume Data:
        ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Use pro for better code generation
            contents: prompt,
        });
        
        let html = response.text?.trim() || "";
        // Strip markdown blocks if Gemini adds them despite instructions
        html = html.replace(/```html/g, '').replace(/```/g, '');
        return html;
    } catch (error) {
        console.error("Interactive portfolio gen failed:", error);
        throw error;
    }
};

export const generateColdEmail = async (data: ResumeData, companyName: string, role: string): Promise<string> => {
    const prompt = `
        Write a concise, high-impact cold email to a recruiter/hiring manager at ${companyName} for the role of ${role}.
        
        Use this resume data to highlight relevant achievements:
        ${JSON.stringify(data)}
        
        Requirements:
        - Subject line included at the top.
        - Max 150 words body.
        - Professional but conversational tone.
        - Focus on value proposition.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('complex'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Cold email gen failed:", error);
        throw error;
    }
};

export const generateSalaryScript = async (data: ResumeData, offerAmount: string, targetAmount: string): Promise<string> => {
     const prompt = `
        I have received a job offer of ${offerAmount} but I want to negotiate for ${targetAmount}.
        Write a script I can say on the phone or email to the recruiter.
        
        My profile context (to justify value):
        ${JSON.stringify(data.personalInfo)}
        ${JSON.stringify(data.experience[0])}
        
        Tone: Grateful, professional, firm but polite.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Salary script gen failed:", error);
        throw error;
    }
};

export const generateEmailTemplate = async (data: ResumeData, type: string, recipient: string, context: string): Promise<string> => {
    const prompt = `
        Act as a professional career coach. Write a tailored email for the following scenario.
        
        Email Type: ${type}
        Recipient: ${recipient}
        User's Context/Notes: ${context}
        
        User Profile:
        Name: ${data.personalInfo.fullName}
        Title: ${data.personalInfo.jobTitle}
        Company: ${data.experience[0]?.company || 'N/A'}
        
        Requirements:
        - Professional, polite, and concise.
        - Include a catchy Subject Line at the top.
        - Use placeholders like [Date] only if necessary, otherwise infer from context.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Email template gen failed:", error);
        throw error;
    }
};

// --- HUMANIZER TOOL ---

export const humanizeContent = async (text: string): Promise<{ rewritten: string; score: number; critique: string }> => {
    const prompt = `
        You are an expert editor and humanizer. Your goal is to take text that might sound robotic, stiff, or AI-generated, and rewrite it to sound natural, engaging, and authentically human.
        
        Original Text:
        "${text}"
        
        Tasks:
        1. Analyze the original text for robotic patterns, buzzwords, or stiffness.
        2. Rewrite it to flow naturally, using varied sentence structure and professional but conversational warmth.
        3. Rate the "Human-ness" of your *rewritten* version (0-100, where 100 is perfectly natural human speech).
        
        Return JSON ONLY:
        {
            "rewritten": "The new text...",
            "score": 95,
            "critique": "I removed the passive voice and overused words like 'leveraged'..."
        }
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Flash is fast and good for style transfer
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text?.trim() || "{}");
        return {
            rewritten: result.rewritten || text,
            score: result.score || 85,
            critique: result.critique || "Text flow improved."
        };
    } catch (error) {
        console.error("Humanize failed:", error);
        throw error;
    }
};

// --- REFINEMENT TOOL (DEEP AGENT) ---

export const refineToolOutput = async (currentContent: string, userInstruction: string, toolType: string): Promise<string> => {
    const prompt = `
        You are an expert AI Agent helping a user refine generated content.
        
        Context / Tool Type: ${toolType}
        
        Current Content:
        "${currentContent}"
        
        User Instruction for Revision:
        "${userInstruction}"
        
        Task:
        Rewrite the content based on the user's instruction. 
        - If it's code (HTML), return only valid HTML code.
        - If it's text (email/script), return only the text.
        - Maintain the original format.
        
        Output:
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Use smartest model for refinement
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 1024 } }
        });
        
        let result = response.text?.trim() || "";
        // Cleanup code blocks if needed
        if (toolType === 'appify' || toolType.includes('html')) {
             result = result.replace(/```html/g, '').replace(/```/g, '');
        }
        return result;
    } catch (error) {
        console.error("Refinement failed:", error);
        throw error;
    }
};

// --- DESIGN PILOT ---

export const generateDesignTheme = async (userPrompt: string): Promise<{ 
    customStyle: Record<string, string>, 
    themeColor: string,
    fontFamily: string 
}> => {
    const prompt = `
        You are a world-class Visual Designer AI.
        User's design vibe request: "${userPrompt}"
        
        Generate a valid CSS-in-JS style object (React style prop format) that captures this vibe.
        Think about backgrounds (gradients, colors), borders, spacing, and fonts.
        
        Return ONLY JSON:
        {
            "themeColor": "hex code for primary accent",
            "fontFamily": "generic font stack string",
            "customStyle": {
                "backgroundColor": "...",
                "backgroundImage": "linear-gradient(...)",
                "color": "text color",
                "fontFamily": "...",
                "border": "...",
                "borderRadius": "..."
            }
        }
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text?.trim() || "{}");
        return result;
    } catch (error) {
        console.error("Design Pilot failed:", error);
        return {
            themeColor: '#000000',
            fontFamily: 'sans-serif',
            customStyle: { backgroundColor: '#ffffff' }
        };
    }
};

// --- TOOLS & HELPERS ---

export const generateInterviewQuestions = async (data: ResumeData): Promise<string[]> => {
    const context = JSON.stringify({
        title: data.personalInfo.jobTitle,
        skills: data.skills,
        experience: data.experience.map(e => ({ role: e.position, company: e.company, desc: e.description }))
    });

    const prompt = `
        Based on this resume, act as a hiring manager and generate 5 targeted interview questions.
        Include:
        - 2 specific technical/skill-based questions related to their stack.
        - 2 behavioral questions based on their experience descriptions.
        - 1 curveball/critical thinking question related to their job title.
        
        Return ONLY a JSON array of strings. No other text.
        
        Resume Context:
        ${context}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim() || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Interview Prep failed:", error);
        return [
            "Tell me about a time you faced a technical challenge.",
            "What is your greatest strength?",
            "Why do you want this role?",
            "Describe a conflict with a coworker.",
            "Where do you see yourself in 5 years?"
        ];
    }
};

export const analyzeJobMatch = async (data: ResumeData, jobDescription: string): Promise<{
    score: number;
    missingKeywords: string[];
    advice: string;
}> => {
    const context = JSON.stringify({
        skills: data.skills,
        summary: data.personalInfo.summary,
        experience: data.experience.map(e => e.description).join(" ")
    });

    const prompt = `
        Compare this resume data against the provided Job Description.
        
        Job Description:
        ${jobDescription.substring(0, 1000)}
        
        Resume Data:
        ${context}
        
        Return a JSON object with:
        - score: number (0-100 match score)
        - missingKeywords: string[] (List of 3-5 important keywords from JD missing in resume)
        - advice: string (1 sentence on how to improve alignment)
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('complex'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Job Match failed:", error);
        return {
            score: 0,
            missingKeywords: [],
            advice: "Could not analyze job match at this time."
        };
    }
};

export const fixGrammarAndSpelling = async (data: ResumeData): Promise<ResumeData> => {
    const prompt = `
        Act as a professional editor. Review the following resume JSON data.
        Correct all grammar and spelling errors in the 'personalInfo.summary', 'experience' descriptions, 'education' details, and 'projects'.
        Do NOT change the meaning of the content, just fix errors.
        Do NOT allow markdown in the output values.
        Return the strictly valid JSON structure with the corrected text.
        
        Resume Data:
        ${JSON.stringify(data)}
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text?.trim() || "{}";
        return JSON.parse(text) as ResumeData;
    } catch (error) {
        console.error("Grammar fix failed:", error);
        throw error;
    }
}

export const generateMetricSuggestions = async (description: string, jobTitle: string): Promise<string[]> => {
  const prompt = `
    Analyze the following job description bullet points for a "${jobTitle}" role.
    Rewrite them to include quantifiable metrics (numbers, percentages, dollar signs) even if you have to use placeholders like [X]%.
    Return exactly 3 alternative versions that are punchier and data-driven.
    
    Original: "${description}"
    
    Return JSON array of strings.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: getModel('basic'),
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text?.trim() || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Metric suggestion failed", error);
    return [];
  }
};

export const rewriteTextWithTone = async (text: string, tone: string): Promise<string> => {
  const prompt = `
    Rewrite the following resume text to have a "${tone}" tone.
    Keep the core facts the same, but change the voice and style.
    Do not use markdown.
    
    Text: "${text}"
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: getModel('basic'),
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Rewrite failed", error);
    return text;
  }
};

export const translateResumeJSON = async (data: ResumeData, language: string): Promise<ResumeData> => {
    const prompt = `
        Translate the content of this resume JSON into "${language}".
        Translate: fullName (transliterate if needed), jobTitle, summary, location, all experience fields (position, description), education fields, projects, skills.
        Do NOT translate keys or IDs. Keep structure identical.
        
        JSON: ${JSON.stringify(data)}
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Flash is fast and good for translation
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text?.trim() || "{}");
    } catch (error) {
        console.error("Translation failed", error);
        throw error;
    }
};

export const findBestCandidates = async (
    employerQuery: string, 
    candidates: PublishedResume[]
): Promise<{ candidateId: string; reason: string; score: number }[]> => {
    
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
            model: getModel('complex'),
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

// --- Resupilot (Vibe Create & Edit) ---

export const generateResumeFromPrompt = async (userPrompt: string, model: 'gemini-2.5-flash' | 'gemini-3-pro-preview' = 'gemini-2.5-flash'): Promise<ResumeData> => {
    // For Pro model, we give it more creative freedom instructions
    const creativeInstruction = model === 'gemini-3-pro-preview' 
        ? "Use sophisticated professional language, quantifiable metrics, and optimize for executive presence." 
        : "";

    const prompt = `
        You are Resupilot, an expert AI resume builder. 
        Create a complete, high-quality JSON resume based on the following user description: "${userPrompt}".
        ${creativeInstruction}
        
        Rules:
        1. Infer missing details realistically.
        2. Create at least 2 realistic experience entries.
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
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                thinkingConfig: model === 'gemini-3-pro-preview' ? { thinkingBudget: 2048 } : undefined
            }
        });
        
        const text = response.text?.trim() || "{}";
        const partialData = JSON.parse(text);
        
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

// NEW: INTELLIGENT CHAT ROUTER
export const chatWithResupilot = async (
    userMessage: string,
    currentResume: ResumeData,
    model: 'gemini-2.5-flash' | 'gemini-3-pro-preview' = 'gemini-2.5-flash'
): Promise<{
    text: string;
    action: 'update_resume' | 'suggest_jobs' | 'none';
    updatedResume?: ResumeData;
    searchQuery?: { query: string, location: string };
}> => {
    const prompt = `
        You are Resupilot, an expert career AI assistant.
        
        User Message: "${userMessage}"
        
        Current Resume Context:
        ${JSON.stringify(currentResume).substring(0, 8000)}
        
        Analyze the user's request and determine the best action.
        
        1. UPDATE_RESUME: If the user asks to edit, change, add, or remove something from the resume.
           - Perform the edit on the JSON.
           - Return action: "update_resume" and the FULL valid updatedResume JSON.
           - Hydrate new items with UUIDs.
           
        2. SUGGEST_JOBS: If the user asks for job recommendations, "what can I apply for?", "find me jobs", or implies they are looking for work.
           - Extract keywords and location from the resume or user message.
           - Return action: "suggest_jobs" and a searchQuery object.
           
        3. NONE: If it's a general question, feedback, or conversation.
           - Return action: "none".
           
        Return JSON ONLY:
        {
            "text": "Your helpful, conversational response to the user...",
            "action": "update_resume" | "suggest_jobs" | "none",
            "updatedResume": { ... } (only if action is update_resume),
            "searchQuery": { "query": "software engineer", "location": "remote" } (only if action is suggest_jobs)
        }
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                thinkingConfig: model === 'gemini-3-pro-preview' ? { thinkingBudget: 2048 } : undefined
            }
        });

        const result = JSON.parse(response.text?.trim() || "{}");
        
        // Post-process IDs for updates
        if (result.updatedResume) {
             if (result.updatedResume.experience) {
                result.updatedResume.experience = result.updatedResume.experience.map((e: any) => ({ ...e, id: e.id || crypto.randomUUID() }));
            }
            if (result.updatedResume.education) {
                result.updatedResume.education = result.updatedResume.education.map((e: any) => ({ ...e, id: e.id || crypto.randomUUID() }));
            }
            if (result.updatedResume.projects) {
                result.updatedResume.projects = result.updatedResume.projects.map((e: any) => ({ ...e, id: e.id || crypto.randomUUID() }));
            }
        }
        
        return result;

    } catch (error) {
        console.error("Resupilot Chat Error:", error);
        return { text: "I'm sorry, I had trouble processing that request.", action: "none" };
    }
};

export const updateResumeWithAI = async (currentData: ResumeData, instruction: string, model: 'gemini-2.5-flash' | 'gemini-3-pro-preview' = 'gemini-2.5-flash'): Promise<ResumeData> => {
    // Deprecated but kept for backward compat if needed, new logic moved to chatWithResupilot
    const res = await chatWithResupilot(instruction, currentData, model);
    return res.updatedResume || currentData;
};

// --- CUSTOM AGENT EXECUTION ---

export const runCustomAgent = async (agent: CustomAgent, userInput: string, resumeData?: ResumeData): Promise<string> => {
    // 1. Build context from source nodes
    let context = "";
    const sourceNode = agent.nodes.find(n => n.type === 'source');
    if (sourceNode) {
        if (sourceNode.config.sourceType === 'resume' && resumeData) {
            context += `\nUser Resume Context:\n${JSON.stringify(resumeData)}\n`;
        }
    }

    // 2. Get Persona
    const personaNode = agent.nodes.find(n => n.type === 'persona');
    const personaInstruction = personaNode ? `You are acting as: ${personaNode.config.personaRole}.` : "";

    // 3. Get Task Instructions
    const taskNode = agent.nodes.find(n => n.type === 'task');
    const taskInstruction = taskNode?.config.prompt || "";

    const finalPrompt = `
        ${personaInstruction}
        
        Context:
        ${context}
        
        Task:
        ${taskInstruction}
        
        User Input: "${userInput}"
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('complex'),
            contents: finalPrompt,
        });
        return response.text?.trim() || "Agent could not generate a response.";
    } catch (error) {
        console.error("Custom Agent failed:", error);
        throw error;
    }
};

// --- STUDENT TOOLS ---

export const generateStudyPlan = async (subject: string, examDate: string, availableHoursPerDay: string): Promise<string> => {
    const prompt = `
        Create a detailed study plan for a "${subject}" exam occurring on ${examDate}.
        I have ${availableHoursPerDay} hours available per day.
        
        Structure the response as a day-by-day schedule starting from today.
        For each day, specify topics to cover and recommended study techniques (e.g. Pomodoro, active recall).
        Format as a clean Markdown list.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('complex'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Study plan failed:", error);
        throw error;
    }
};

export const generateEssayOutline = async (topic: string): Promise<string> => {
    const prompt = `
        Create a comprehensive essay outline for the topic: "${topic}".
        Include:
        1. Thesis Statement
        2. Introduction (Hook, Context)
        3. Body Paragraphs (Main Point, Supporting Evidence for each)
        4. Conclusion (Summary, Final Thought)
        
        Format as clear Markdown.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Essay outline failed:", error);
        throw error;
    }
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<{front: string, back: string}[]> => {
    const prompt = `
        Create ${count} study flashcards for the topic: "${topic}".
        Return a JSON Array of objects with "front" (question/term) and "back" (answer/definition).
        Do not include markdown formatting in the JSON.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text?.trim() || "[]");
    } catch (error) {
        console.error("Flashcards failed:", error);
        return [];
    }
};

export const explainConcept = async (concept: string, level: string = 'High School'): Promise<string> => {
    const prompt = `
        Explain the concept "${concept}" to a ${level} student.
        Use analogies, simple language, and bullet points for clarity.
        Keep it under 300 words.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Explanation failed:", error);
        throw error;
    }
};

// --- TEACHER TOOLS ---

export const generateLessonPlan = async (subject: string, grade: string, topic: string): Promise<string> => {
    const prompt = `
        Create a comprehensive lesson plan for a ${grade} ${subject} class on the topic: "${topic}".
        
        Include:
        1. Learning Objectives
        2. Materials Needed
        3. Hook/Warm-up Activity (5-10 min)
        4. Direct Instruction (15-20 min)
        5. Guided Practice
        6. Independent Practice
        7. Assessment/Exit Ticket
        
        Format with clear Markdown headings.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('complex'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Lesson plan failed:", error);
        throw error;
    }
};

export const generateQuiz = async (topic: string, grade: string, questionCount: number = 5): Promise<{question: string, options: string[], answer: string}[]> => {
    const prompt = `
        Create a ${questionCount}-question multiple-choice quiz for ${grade} students on "${topic}".
        Return a JSON Array of objects. Each object must have:
        - "question": string
        - "options": array of 4 strings
        - "answer": string (the correct option text)
        
        Do not include markdown in the JSON output.
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text?.trim() || "[]");
    } catch (error) {
        console.error("Quiz generation failed:", error);
        return [];
    }
};

export const generateRubric = async (assignment: string, grade: string): Promise<string> => {
    const prompt = `
        Create a grading rubric for a ${grade} assignment: "${assignment}".
        Use a table format (Markdown) with columns: Criteria, 4 (Excellent), 3 (Good), 2 (Fair), 1 (Needs Improvement).
        Include 4-5 criteria rows (e.g. Content, Organization, Mechanics).
    `;
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Rubric generation failed:", error);
        throw error;
    }
};

// --- FORM GENERATION ---

export const generateFormSchema = async (topic: string): Promise<FormProject> => {
    const prompt = `
        Create a custom form structure based on the request: "${topic}".
        
        Return JSON only matching this structure:
        {
            "title": "Form Title",
            "description": "Short description for the user filling it out",
            "themeColor": "#hexcode",
            "fields": [
                {
                    "id": "unique_string_1",
                    "type": "text" | "textarea" | "select" | "checkbox" | "email" | "number",
                    "label": "Question Label",
                    "placeholder": "Example answer...",
                    "options": ["Option 1", "Option 2"] (only if type is select),
                    "required": boolean
                }
            ]
        }
        
        Include at least 3-5 relevant fields.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: getModel('basic'),
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text?.trim() || "{}");
        
        return {
            id: crypto.randomUUID(),
            userId: '', // Set by caller
            title: result.title || 'Untitled Form',
            description: result.description || '',
            themeColor: result.themeColor || '#000000',
            fields: result.fields || [],
            published: false,
            views: 0,
            submissions: 0,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Form generation failed:", error);
        throw error;
    }
};
