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

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

export enum AIActionType {
  GENERATE_SUMMARY = 'GENERATE_SUMMARY',
  IMPROVE_DESCRIPTION = 'IMPROVE_DESCRIPTION',
  SUGGEST_SKILLS = 'SUGGEST_SKILLS'
}