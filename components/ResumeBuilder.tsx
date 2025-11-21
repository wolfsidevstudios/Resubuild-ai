import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Experience, Education, Project, CustomSectionItem, ResumeAuditResult, CareerPathSuggestion, LinkedInContent } from '../types';
import { 
    generateResumeSummary, 
    improveJobDescription, 
    suggestSkills, 
    auditResume, 
    performDeepAudit,
    generateCoverLetter, 
    fixGrammarAndSpelling,
    generateInterviewQuestions,
    analyzeJobMatch,
    suggestCareerPaths,
    generateLinkedInContent,
    generateInteractivePortfolio
} from '../services/geminiService';
import { saveResume, createEmptyResume } from '../services/storageService';
import { publishResume } from '../services/firebase';
import { ResumePreview } from './ResumePreview';
import { Input, TextArea } from './InputField';
import { Button } from './Button';
import { ExperienceEditor, EducationEditor, ProjectEditor, CustomSectionEditor } from './SectionEditor';
import { 
  Sparkles, 
  Download, 
  User, 
  Trash2,
  Briefcase,
  FolderGit2,
  Palette,
  PlusCircle,
  Layout,
  GraduationCap,
  ChevronLeft,
  Globe,
  CheckCircle2,
  FileCheck,
  PenTool,
  Zap,
  X,
  Copy,
  Mic,
  Target,
  Linkedin,
  Compass,
  BrainCircuit,
  Code2,
  MonitorPlay,
  Smartphone,
  Feather
} from 'lucide-react';

interface ResumeBuilderProps {
    initialData?: ResumeData;
    onGoHome: () => void;
    userId: string;
}

const COLORS = [
  '#000000', '#334155', '#525252', '#737373',
  '#dc2626', '#ea580c', '#d97706', '#b45309',
  '#16a34a', '#059669', '#0d9488', '#0f766e',
  '#0284c7', '#2563eb', '#4f46e5', '#1e3a8a',
  '#7c3aed', '#c026d3', '#db2777', '#e11d48',
];

const TEMPLATES = [
    { id: 'modern', name: 'Modern', icon: Layout },
    { id: 'professional', name: 'Professional', icon: FileCheck },
    { id: 'elegant', name: 'Elegant', icon: Feather },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'minimal', name: 'Minimal', icon: FileCheck },
    { id: 'tech', name: 'Tech', icon: Code2 },
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, onGoHome, userId }) => {
  const [data, setData] = useState<ResumeData>(initialData || createEmptyResume());
  
  // Mode State
  const [mode, setMode] = useState<'standard' | 'advanced'>('standard');

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('design');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [isATSMode, setIsATSMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  const [showAudit, setShowAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<ResumeAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterJobDesc, setCoverLetterJobDesc] = useState('');
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [isWritingLetter, setIsWritingLetter] = useState(false);
  
  const [isFixingGrammar, setIsFixingGrammar] = useState(false);

  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const [showJobMatch, setShowJobMatch] = useState(false);
  const [jobMatchDesc, setJobMatchDesc] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<{score: number, missingKeywords: string[], advice: string} | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  
  const [showCareerPath, setShowCareerPath] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPathSuggestion[]>([]);
  const [isAnalzyingCareer, setIsAnalyzingCareer] = useState(false);

  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [linkedInContent, setLinkedInContent] = useState<LinkedInContent | null>(null);
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState(false);

  const [showAppGen, setShowAppGen] = useState(false);
  const [generatedAppHtml, setGeneratedAppHtml] = useState('');
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
        saveResume(data, userId);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data, userId]);

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };
  
  const updateName = (name: string) => {
      setData(prev => ({ ...prev, name }));
  }

  const updateExperience = (newExperience: Experience[]) => {
    setData(prev => ({ ...prev, experience: newExperience }));
  };

  const updateEducation = (newEducation: Education[]) => {
    setData(prev => ({ ...prev, education: newEducation }));
  };

  const updateProjects = (newProjects: Project[]) => {
    setData(prev => ({ ...prev, projects: newProjects }));
  };
  
  const updateCustomSection = (sectionId: string, items: CustomSectionItem[]) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === sectionId ? { ...s, items } : s)
    }));
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    const newSection = {
      id: crypto.randomUUID(),
      title: newSectionName,
      items: []
    };
    setData(prev => ({ ...prev, customSections: [...prev.customSections, newSection] }));
    setNewSectionName('');
    setIsAddingSection(false);
    setActiveTab(newSection.id);
  };

  const removeCustomSection = (id: string) => {
    if (confirm('Are you sure you want to delete this entire section?')) {
        setData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));
        setActiveTab('personal');
    }
  };

  // --- AI Handlers ---

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateResumeSummary(data);
      updatePersonalInfo('summary', summary);
    } catch (error) {
      alert('Failed to generate summary. Please check your connection.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleImproveDescription = async (id: string, text: string, title: string) => {
    if (!text) return;
    setImprovingExpId(id);
    try {
      const improved = await improveJobDescription(text, title);
      setData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: improved } : exp)
      }));
    } catch (error) {
      alert('Failed to improve description.');
    } finally {
      setImprovingExpId(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (!data.personalInfo.jobTitle) {
      alert('Please enter a Job Title first.');
      return;
    }
    const context = data.experience[0]?.description || data.personalInfo.summary;
    try {
      const newSkills = await suggestSkills(data.personalInfo.jobTitle, context);
      setData(prev => ({
        ...prev,
        skills: [...Array.from(new Set([...prev.skills, ...newSkills]))]
      }));
    } catch (error) {
      alert('Failed to suggest skills.');
    }
  };
  
  const handleFixGrammar = async () => {
      setIsFixingGrammar(true);
      try {
          const correctedData = await fixGrammarAndSpelling(data);
          setData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, summary: correctedData.personalInfo.summary },
              experience: correctedData.experience,
              education: correctedData.education,
              projects: correctedData.projects
          }));
          alert("Grammar and spelling checked!");
      } catch (error) {
          console.error(error);
      } finally {
          setIsFixingGrammar(false);
      }
  };

  const handleAudit = async (deep: boolean = false) => {
      setIsAuditing(true);
      setShowAudit(true);
      try {
          const result = deep ? await performDeepAudit(data) : await auditResume(data);
          setAuditResult(result);
      } catch (e) {
          console.error(e);
      } finally {
          setIsAuditing(false);
      }
  };

  const handleCreateCoverLetter = async () => {
      if (!coverLetterJobDesc || !coverLetterCompany) return;
      setIsWritingLetter(true);
      try {
          const letter = await generateCoverLetter(data, coverLetterJobDesc, coverLetterCompany);
          setGeneratedCoverLetter(letter);
      } catch (e) {
          console.error(e);
      } finally {
          setIsWritingLetter(false);
      }
  };

  const handleInterviewPrep = async () => {
      setIsGeneratingQuestions(true);
      try {
          const questions = await generateInterviewQuestions(data);
          setInterviewQuestions(questions);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingQuestions(false);
      }
  };

  const handleJobMatch = async () => {
      if(!jobMatchDesc) return;
      setIsAnalyzingJob(true);
      try {
          const result = await analyzeJobMatch(data, jobMatchDesc);
          setJobMatchResult(result);
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzingJob(false);
      }
  };
  
  const handleCareerPath = async () => {
      setIsAnalyzingCareer(true);
      try {
          const paths = await suggestCareerPaths(data);
          setCareerPaths(paths);
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzingCareer(false);
      }
  };

  const handleLinkedInGen = async () => {
       setIsGeneratingLinkedIn(true);
       try {
           const content = await generateLinkedInContent(data);
           setLinkedInContent(content);
       } catch (e) {
           console.error(e);
       } finally {
           setIsGeneratingLinkedIn(false);
       }
  };

  const handleGenerateApp = async () => {
      setIsGeneratingApp(true);
      try {
          const html = await generateInteractivePortfolio(data);
          setGeneratedAppHtml(html);
      } catch (e) {
          console.error(e);
          alert("Failed to generate portfolio app.");
      } finally {
          setIsGeneratingApp(false);
      }
  };

  const handleDownloadApp = () => {
      const blob = new Blob([generatedAppHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePublish = async () => {
      if (!confirm("Publishing makes your resume visible to everyone on the Discover page. Are you sure?")) return;
      
      setIsPublishing(true);
      try {
          await publishResume(data, userId);
          setShowPublishSuccess(true);
          setTimeout(() => setShowPublishSuccess(false), 4000);
      } catch (error) {
          alert("Failed to publish resume. Please try again.");
          console.error(error);
      } finally {
          setIsPublishing(false);
      }
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value.trim();
      if (val && !data.skills.includes(val)) {
        setData(prev => ({ ...prev, skills: [...prev.skills, val] }));
        e.currentTarget.value = '';
      }
    }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const tabs = [
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-50 overflow-hidden animate-in fade-in duration-500">
      
      {/* Left Panel: Editor */}
      <div className="w-full md:w-[550px] lg:w-[600px] flex flex-col bg-white border-r border-neutral-200 shadow-xl z-10 no-print">
        
        {/* Top Bar */}
        <div className="p-4 border-b border-neutral-100 bg-white">
           <div className="flex items-center justify-between mb-4">
               <button onClick={onGoHome} className="flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                   <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
               </button>

               {/* Mode Toggle */}
               <div className="flex items-center bg-neutral-100 p-1 rounded-full">
                   <button 
                    onClick={() => setMode('standard')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${mode === 'standard' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'}`}
                   >
                       Standard
                   </button>
                   <button 
                    onClick={() => setMode('advanced')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${mode === 'advanced' ? 'bg-neutral-900 text-white shadow' : 'text-neutral-500'}`}
                   >
                       <BrainCircuit className="w-3 h-3" /> Advanced
                   </button>
               </div>
           </div>

           {/* TOOLBAR */}
           <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar mb-4">
                <Button 
                    variant="ghost" 
                    className="text-xs h-7 px-2 whitespace-nowrap" 
                    icon={<FileCheck className="w-3 h-3" />}
                    onClick={() => handleAudit(false)}
                    title="Basic Audit"
                >
                    Audit
                </Button>
                <Button 
                    variant="ghost" 
                    className="text-xs h-7 px-2 whitespace-nowrap" 
                    icon={<PenTool className="w-3 h-3" />}
                    onClick={() => setShowCoverLetter(true)}
                    title="Cover