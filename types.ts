
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
  templateId: string; // 'modern' | 'professional' | 'creative' | 'minimal' | 'tech' | 'elegant'
  lastUpdated: number;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  customSections: CustomSection[];
  themeColor: string;
  customStyle?: Record<string, string>; // For Design Pilot
}

export enum AIActionType {
  GENERATE_SUMMARY = 'GENERATE_SUMMARY',
  IMPROVE_DESCRIPTION = 'IMPROVE_DESCRIPTION',
  SUGGEST_SKILLS = 'SUGGEST_SKILLS'
}

// New Types for Social/Brand Features

export type UserRole = 'candidate' | 'employer';
export type AccountStatus = 'active' | 'suspended' | 'pending_deletion';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  training_consent?: boolean; // New privacy field
  
  // Terms of Service Fields
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  terms_version?: string;
  account_status?: AccountStatus;
  suspended_at?: string;
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

export interface PublishedResume {
    id: string;
    user_id: string;
    full_name: string;
    job_title: string;
    location: string;
    skills: string[];
    resume_data: ResumeData;
    created_at: string;
    contact_email?: string;
}

// --- AGENT BUILDER TYPES ---

export type NodeType = 'source' | 'persona' | 'task' | 'output';

export interface AgentNode {
    id: string;
    type: NodeType;
    title: string;
    config: {
        sourceType?: 'resume' | 'linkedin' | 'text';
        personaRole?: string; // e.g. "Strict Recruiter"
        prompt?: string;
        outputFormat?: 'chat' | 'document';
    };
    position: { x: number; y: number };
}

export interface CustomAgent {
    id: string;
    user_id: string;
    name: string;
    description: string;
    nodes: AgentNode[];
    created_at: number;
}

// --- DESIGN PILOT CONTEST TYPES ---

export interface ContestEntry {
    id: string;
    user_id: string;
    author_name: string;
    design_name: string;
    custom_style: Record<string, string>; // The AI generated CSS/Theme
    theme_color: string;
    votes: string[]; // Array of user IDs who voted
    created_at: string;
}

// --- FORMS & DOCUMENTS ---

export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'email' | 'number';
    label: string;
    placeholder?: string;
    options?: string[]; // For select
    required: boolean;
}

export interface FormProject {
    id: string;
    userId: string;
    title: string;
    description: string;
    fields: FormField[];
    themeColor: string;
    published: boolean;
    views: number;
    submissions: number;
    createdAt: string;
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, string>;
    submittedAt: string;
}

export interface SavedDocument {
    id: string;
    userId: string;
    type: 'lesson-plan' | 'study-guide' | 'essay-outline' | 'flashcards' | 'quiz' | 'rubric' | 'generic';
    title: string;
    content: any; // Can be string (HTML/Markdown) or JSON object
    createdAt: string;
}
