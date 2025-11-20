
import { ResumeData } from '../types';

const STORAGE_KEY = 'resubuild_resumes';
const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const getResumes = (): ResumeData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load resumes", e);
    return [];
  }
};

export const getResumeById = (id: string): ResumeData | undefined => {
  const resumes = getResumes();
  return resumes.find(r => r.id === id);
};

export const saveResume = (resume: ResumeData): void => {
  const resumes = getResumes();
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const deleteResume = (id: string): void => {
  const resumes = getResumes();
  const filtered = resumes.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const createEmptyResume = (): ResumeData => ({
  id: crypto.randomUUID(),
  name: 'Untitled Resume',
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
