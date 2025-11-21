
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  jobTitle: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  name: string; // For the dashboard title
  templateId: string; // 'modern' | 'professional' | 'creative' | 'minimal'
  lastUpdated: number;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  customSections: CustomSection[];
  themeColor: string;
}

export enum AIActionType {
  GENERATE_SUMMARY = 'GENERATE_SUMMARY',
  IMPROVE_DESCRIPTION = 'IMPROVE_DESCRIPTION',
  SUGGEST_SKILLS = 'SUGGEST_SKILLS'
}

// New Types for Social/Brand Features

export type UserRole = 'candidate' | 'employer';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_profile?: UserProfile; // Joined data
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'match' | 'system';
  content: string;
  related_id?: string; // e.g., sender_id
  is_read: boolean;
  created_at: string;
}

// AI Audit Types
export interface ResumeAuditResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

// Advanced Feature Types
export interface CareerPathSuggestion {
    role: string;
    matchScore: number;
    missingSkills: string[];
    reasoning: string;
}

export interface LinkedInContent {
    headline: string;
    about: string;
    posts: string[];
}