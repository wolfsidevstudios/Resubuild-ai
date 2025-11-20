
import { ResumeData } from '../types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

// Helper to get the key based on user ID
const getStorageKey = (userId?: string) => {
    return userId ? `resubuild_resumes_${userId}` : 'resubuild_resumes';
};

export const getResumes = (userId?: string): ResumeData[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load resumes", e);
    return [];
  }
};

export const getResumeById = (id: string, userId?: string): ResumeData | undefined => {
  const resumes = getResumes(userId);
  return resumes.find(r => r.id === id);
};

export const saveResume = (resume: ResumeData, userId?: string): void => {
  const resumes = getResumes(userId);
  const index = resumes.findIndex(r => r.id === resume.id);
  
  const updatedResume = {
    ...resume,
    lastUpdated: Date.now()
  };

  if (index >= 0) {
    resumes[index] = updatedResume;
  } else {
    resumes.push(updatedResume);
  }

  localStorage.setItem(getStorageKey(userId), JSON.stringify(resumes));
};

export const deleteResume = (id: string, userId?: string): void => {
  const resumes = getResumes(userId);
  const filtered = resumes.filter(r => r.id !== id);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(filtered));
};

export const createEmptyResume = (templateId: string = 'modern'): ResumeData => ({
  id: crypto.randomUUID(),
  name: 'Untitled Resume',
  templateId,
  lastUpdated: Date.now(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    jobTitle: '',
    summary: '',
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  customSections: [],
  themeColor: '#000000'
});

// --- API Key Management ---

export const getStoredAPIKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const saveAPIKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const removeAPIKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const hasAPIKey = (): boolean => {
  return !!(getStoredAPIKey() || process.env.API_KEY);
};
