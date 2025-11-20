
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
