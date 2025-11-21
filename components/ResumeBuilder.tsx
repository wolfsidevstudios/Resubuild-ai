
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
  Save,
  ChevronLeft,
  Globe,
  CheckCircle2,
  FileCheck,
  Grid,
  FileText,
  AlignLeft,
  Zap,
  X,
  Copy,
  PenTool,
  AlertCircle,
  Wand2,
  Feather,
  Mic,
  Target,
  ListChecks,
  Terminal,
  Linkedin,
  Compass,
  BrainCircuit,
  Code2,
  MonitorPlay
} from 'lucide-react';

interface ResumeBuilderProps {
    initialData?: ResumeData;
    onGoHome: () => void;
    userId: string;
}

const COLORS = [
  // Monochromes
  '#000000', '#334155', '#525252', '#737373',
  // Reds/Oranges
  '#dc2626', '#ea580c', '#d97706', '#b45309',
  // Greens/Teals
  '#16a34a', '#059669', '#0d9488', '#0f766e',
  // Blues/Indigos
  '#0284c7', '#2563eb', '#4f46e5', '#1e3a8a',
  // Violets/Pinks
  '#7c3aed', '#c026d3', '#db2777', '#e11d48',
];

const TEMPLATES = [
    { id: 'modern', name: 'Modern', icon: Layout },
    { id: 'professional', name: 'Professional', icon: FileText },
    { id: 'elegant', name: 'Elegant', icon: Feather },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'minimal', name: 'Minimal', icon: AlignLeft },
    { id: 'tech', name: 'Tech', icon: Terminal },
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, onGoHome, userId }) => {
  const [data, setData] = useState<ResumeData>(initialData || createEmptyResume());
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('design');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isATSMode, setIsATSMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  // New Feature States
  const [showAudit, setShowAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<ResumeAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterJobDesc, setCoverLetterJobDesc] = useState('');
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [isWritingLetter, setIsWritingLetter] = useState(false);
  
  const [isFixingGrammar, setIsFixingGrammar] = useState(false);

  // Interview Prep State
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Job Match State
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [jobMatchDesc, setJobMatchDesc] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<{score: number, missingKeywords: string[], advice: string} | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  
  // Advanced Tools State
  const [showCareerPath, setShowCareerPath] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPathSuggestion[]>([]);
  const [isAnalzyingCareer, setIsAnalyzingCareer] = useState(false);

  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [linkedInContent, setLinkedInContent] = useState<LinkedInContent | null>(null);
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState(false);

  // Interactive App State
  const [showAppGen, setShowAppGen] = useState(false);
  const [generatedAppHtml, setGeneratedAppHtml] = useState('');
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save effect
  useEffect(() => {
    const timeout = setTimeout(() => {
        saveResume(data, userId);
        setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data, userId]);

  // --- State Updates ---
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
          alert("Could not check grammar at the moment.");
      } finally {
          setIsFixingGrammar(false);
      }
  };

  const handleAudit = async (deep: boolean = false) => {
      setIsAuditing(true);
      setShowAudit(true);
      try {
          // Use Gemini 3 Pro with Thinking if deep is true
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

  // --- Actions ---
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

  // --- Skill Helpers ---
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

  // Navigation Tabs
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
               
               {/* TOOLBAR */}
               <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
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
                        title="Cover Letter"
                    >
                        Letter
                    </Button>
                     <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap" 
                        icon={<Mic className="w-3 h-3" />}
                        onClick={() => setShowInterviewPrep(true)}
                        title="Interview Prep"
                    >
                        Prep
                    </Button>
                     <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap" 
                        icon={<Target className="w-3 h-3" />}
                        onClick={() => setShowJobMatch(true)}
                        title="Tailor to Job"
                    >
                        Tailor
                    </Button>
                    
                    <div className="w-px h-4 bg-neutral-200 mx-1"></div>

                    {/* ADVANCED TOOLS */}
                     <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap text-purple-700 hover:text-purple-900" 
                        icon={<BrainCircuit className="w-3 h-3" />}
                        onClick={() => handleAudit(true)}
                        title="Deep Audit (Gemini 3.0)"
                    >
                        Deep Audit
                    </Button>

                     <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap"
                        icon={<Compass className="w-3 h-3 text-purple-600" />}
                        onClick={() => setShowCareerPath(true)}
                    >
                        Career
                    </Button>

                    <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap"
                        icon={<Linkedin className="w-3 h-3 text-blue-600" />}
                        onClick={() => setShowLinkedIn(true)}
                    >
                        LinkedIn
                    </Button>

                    <Button 
                        variant="ghost" 
                        className="text-xs h-7 px-2 whitespace-nowrap bg-gradient-to-r from-blue-50 to-purple-50"
                        icon={<Code2 className="w-3 h-3 text-neutral-800" />}
                        onClick={() => setShowAppGen(true)}
                    >
                        Appify
                    </Button>

               </div>
           </div>
           <div className="flex items-center justify-between gap-4">
             <input 
                className="text-xl font-bold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-none w-full"
                value={data.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="Resume Name"
             />
             <div className="flex items-center gap-2">
                <Button 
                    onClick={handlePublish} 
                    variant="secondary" 
                    className="bg-neutral-100" 
                    isLoading={isPublishing}
                    icon={<Globe className="w-4 h-4" />}
                    title="Publish to Discover page"
                >
                    Publish
                </Button>
                <Button onClick={handlePrint} variant="primary" icon={<Download className="w-4 h-4" />}>
                    Export
                </Button>
             </div>
           </div>
           
           {showPublishSuccess && (
               <div className="mt-2 p-2 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                   <CheckCircle2 className="w-4 h-4" />
                   Published successfully! Your resume is now live on Discover.
               </div>
           )}
        </div>

        {/* Navigation */}
        <div className="flex border-b border-neutral-100 overflow-x-auto hide-scrollbar bg-white sticky top-0 z-20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          
          {/* Dynamic Custom Tabs */}
          {data.customSections.map(section => (
             <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === section.id 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Layout className="w-4 h-4" />
              {section.title}
            </button>
          ))}

          {/* Add Section Button */}
          <div className="flex items-center px-4 border-l border-neutral-100">
             {isAddingSection ? (
                 <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <input 
                        autoFocus
                        className="w-24 px-2 py-1 text-sm border rounded border-neutral-300 focus:outline-none focus:border-neutral-900"
                        placeholder="Section Name"
                        value={newSectionName}
                        onChange={e => setNewSectionName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCustomSection()}
                    />
                    <button onClick={addCustomSection} className="p-1 hover:bg-neutral-100 rounded"><PlusCircle className="w-4 h-4 text-green-600" /></button>
                    <button onClick={() => setIsAddingSection(false)} className="p-1 hover:bg-neutral-100 rounded"><Trash2 className="w-4 h-4 text-neutral-400" /></button>
                 </div>
             ) : (
                <button 
                    onClick={() => setIsAddingSection(true)}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
                >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Section
                </button>
             )}
          </div>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
          
          {/* Design Tab */}
          {activeTab === 'design' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                {/* Template Selection */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Layout className="w-5 h-5" /> Template
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => setData({...data, templateId: template.id})}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${data.templateId === template.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.templateId === template.id ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200'}`}>
                                    <template.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm">{template.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" /> Accent Color
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => setData({...data, themeColor: color})}
                                className={`w-10 h-10 rounded-full shadow-sm border-2 transition-all hover:scale-110 ${data.themeColor === color ? 'border-neutral-900 scale-110 ring-2 ring-neutral-200' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="border-t border-neutral-100 pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FileCheck className="w-5 h-5" /> ATS Friendly Mode
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isATSMode} 
                                onChange={(e) => setIsATSMode(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                        </label>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        ATS mode strips away complex layouts and formatting to create a 100% machine-readable document optimized for Applicant Tracking Systems.
                    </p>
                </div>
             </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Full Name" 
                  value={data.personalInfo.fullName} 
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                />
                <Input 
                  label="Job Title" 
                  value={data.personalInfo.jobTitle} 
                  onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Email" 
                  value={data.personalInfo.email} 
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
                <Input 
                  label="Phone" 
                  value={data.personalInfo.phone} 
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                />
              </div>
               <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Location" 
                  value={data.personalInfo.location} 
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                />
                <Input 
                  label="Website / LinkedIn" 
                  value={data.personalInfo.website} 
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <TextArea 
                  label="Professional Summary" 
                  value={data.personalInfo.summary} 
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="min-h-[160px]"
                  placeholder="Brief overview of your career..."
                />
                <div className="absolute bottom-3 right-3">
                   <Button 
                    variant="primary" 
                    onClick={handleGenerateSummary} 
                    isLoading={isGeneratingSummary}
                    icon={<Sparkles className="w-3 h-3" />}
                    className="text-xs py-1.5 px-3 bg-black"
                  >
                    Generate AI Summary
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="animate-in fade-in duration-300">
              <ExperienceEditor 
                items={data.experience} 
                onChange={updateExperience}
                onImprove={handleImproveDescription}
                isImproving={improvingExpId}
              />
            </div>
          )}

          {activeTab === 'education' && (
            <div className="animate-in fade-in duration-300">
              <EducationEditor 
                items={data.education} 
                onChange={updateEducation}
              />
            </div>
          )}
          
          {activeTab === 'projects' && (
            <div className="animate-in fade-in duration-300">
              <ProjectEditor
                items={data.projects} 
                onChange={updateProjects}
              />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-lg mb-6">
                 <div className="flex items-start justify-between">
                    <div>
                       <h3 className="font-bold text-lg mb-1">AI Skill Suggestions</h3>
                       <p className="text-neutral-400 text-sm mb-4">Get relevant skills based on your job title.</p>
                    </div>
                    <Sparkles className="text-neutral-500" />
                 </div>
                 <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={handleSuggestSkills}
                 >
                    Generate Suggestions
                 </Button>
              </div>

              <div>
                <Input 
                  label="Add Skill (Press Enter)" 
                  onKeyDown={addSkill}
                  placeholder="e.g. React, Leadership..."
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 border border-neutral-200 group">
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {data.skills.length === 0 && (
                    <p className="text-neutral-400 text-sm italic">No skills added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom Section Editors */}
          {data.customSections.map(section => activeTab === section.id && (
              <div key={section.id} className="animate-in fade-in duration-300">
                  <CustomSectionEditor 
                     title={section.title}
                     items={section.items}
                     onChange={(items) => updateCustomSection(section.id, items)}
                     onDeleteSection={() => removeCustomSection(section.id)}
                  />
              </div>
          ))}

        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 bg-neutral-100/50 relative flex justify-center">
          {/* Floating AI Grammar Bar */}
          <div className="absolute top-6 z-30 bg-neutral-900 text-white rounded-full shadow-xl flex items-center gap-1 px-3 py-1.5 scale-90 hover:scale-100 transition-transform duration-300 border border-neutral-800 no-print">
               <button 
                  onClick={handleFixGrammar} 
                  disabled={isFixingGrammar}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-800 rounded-full transition-colors text-sm font-medium disabled:opacity-50"
                >
                   <Wand2 className={`w-3.5 h-3.5 ${isFixingGrammar ? 'animate-spin' : ''}`} />
                   {isFixingGrammar ? 'Fixing...' : 'Fix Grammar'}
               </button>
               <div className="w-px h-4 bg-neutral-700"></div>
               <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-800 rounded-full transition-colors text-sm font-medium text-neutral-400 hover:text-white">
                   <Feather className="w-3.5 h-3.5" />
                   Polish Tone
               </button>
               <div className="w-px h-4 bg-neutral-700"></div>
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-800 rounded-full transition-colors text-sm font-medium text-neutral-400 hover:text-white">
                   <Zap className="w-3.5 h-3.5" />
                   Strong Verbs
               </button>
          </div>
          
          <ResumePreview data={data} previewRef={previewRef} isATSMode={isATSMode} />
      </div>

      {/* Interactive App Generator Modal */}
      {showAppGen && (
           <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-neutral-900 text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <MonitorPlay className="w-6 h-6" /> Interactive Portfolio (Appify)
                      </h3>
                      <button onClick={() => setShowAppGen(false)} className="p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden bg-neutral-100">
                      {isGeneratingApp ? (
                           <div className="flex-1 flex flex-col items-center justify-center p-12">
                               <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 animate-spin">
                                   <Code2 className="w-8 h-8 text-white" />
                               </div>
                               <h3 className="text-xl font-bold mb-2">Building your App...</h3>
                               <p className="text-neutral-500">Gemini is generating a single-file React/HTML portfolio based on your resume data.</p>
                           </div>
                      ) : generatedAppHtml ? (
                          <div className="flex-1 flex flex-col">
                               <div className="bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
                                   <div className="text-sm text-neutral-500">
                                       Preview of your generated <strong>portfolio.html</strong>
                                   </div>
                                   <Button onClick={handleDownloadApp} variant="primary" icon={<Download className="w-4 h-4"/>}>
                                       Download HTML File
                                   </Button>
                               </div>
                               <iframe 
                                  srcDoc={generatedAppHtml} 
                                  className="flex-1 w-full h-full border-none"
                                  title="App Preview"
                               />
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg transform rotate-3">
                                  <Code2 className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-3xl font-bold mb-4">Turn your resume into a Website.</h3>
                              <p className="text-lg text-neutral-500 mb-8 max-w-lg">
                                  We'll generate a stunning, interactive, single-file HTML portfolio that you can host anywhere (GitHub Pages, Netlify, or just verify locally).
                              </p>
                              <Button onClick={handleGenerateApp} className="px-8 py-4 text-lg rounded-full" icon={<Sparkles className="w-5 h-5"/>}>
                                  Generate App Now
                              </Button>
                          </div>
                      )}
                  </div>
              </div>
           </div>
      )}

      {/* AI Audit Modal */}
      {showAudit && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-purple-600" />
                          AI Resume Audit
                      </h3>
                      <button onClick={() => setShowAudit(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8">
                      {isAuditing ? (
                           <div className="flex flex-col items-center justify-center py-12">
                               <Sparkles className="w-12 h-12 text-neutral-900 animate-pulse mb-4" />
                               <p className="text-neutral-500">
                                   Thinking deeply about your career history...
                               </p>
                           </div>
                      ) : auditResult ? (
                          <div className="space-y-8">
                              {/* Score */}
                              <div className="flex items-center gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                                  <div className="relative w-24 h-24 flex-shrink-0">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                          <path className="text-neutral-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                          <path className={`${auditResult.score > 80 ? 'text-green-500' : auditResult.score > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} strokeDasharray={`${auditResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                                          <span className="text-2xl font-bold">{auditResult.score}</span>
                                          <span className="text-[10px] uppercase font-bold text-neutral-400">Score</span>
                                      </div>
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-lg mb-1">Audit Summary</h4>
                                      <p className="text-sm text-neutral-600">{auditResult.summary}</p>
                                  </div>
                              </div>

                              {/* Strengths */}
                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-green-700">
                                      <CheckCircle2 className="w-5 h-5" /> Key Strengths
                                  </h4>
                                  <div className="grid gap-2">
                                      {auditResult.strengths.map((s, i) => (
                                          <div key={i} className="px-4 py-3 bg-green-50 text-green-800 text-sm rounded-xl border border-green-100">
                                              {s}
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Improvements */}
                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700">
                                      <AlertCircle className="w-5 h-5" /> Needs Improvement
                                  </h4>
                                  <div className="grid gap-2">
                                      {auditResult.improvements.map((s, i) => (
                                          <div key={i} className="px-4 py-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">
                                              {s}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ) : null}
                  </div>
              </div>
          </div>
      )}

      {/* Cover Letter Modal */}
      {showCoverLetter && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <PenTool className="w-5 h-5 text-blue-600" /> AI Cover Letter Generator
                      </h3>
                      <button onClick={() => setShowCoverLetter(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8">
                      {!generatedCoverLetter ? (
                          <div className="space-y-6">
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                  <p>We'll use your current resume data to write a tailored cover letter. Just paste the job details below.</p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <Input 
                                    label="Company Name" 
                                    value={coverLetterCompany} 
                                    onChange={e => setCoverLetterCompany(e.target.value)}
                                    placeholder="e.g. TechCorp Inc."
                                  />
                                  <Input 
                                    label="Target Job Title" 
                                    value={data.personalInfo.jobTitle} 
                                    disabled
                                    className="bg-neutral-100 text-neutral-500"
                                  />
                              </div>
                              <TextArea 
                                label="Job Description"
                                value={coverLetterJobDesc}
                                onChange={e => setCoverLetterJobDesc(e.target.value)}
                                placeholder="Paste the full job description here..."
                                className="min-h-[200px]"
                              />
                          </div>
                      ) : (
                          <div className="space-y-4 h-full flex flex-col">
                               <div className="flex justify-end gap-2">
                                   <Button 
                                      variant="ghost" 
                                      onClick={() => {
                                          navigator.clipboard.writeText(generatedCoverLetter);
                                          alert("Copied to clipboard!");
                                      }}
                                      icon={<Copy className="w-4 h-4" />}
                                   >
                                       Copy Text
                                   </Button>
                                   <Button variant="secondary" onClick={() => setGeneratedCoverLetter('')}>
                                       Start Over
                                   </Button>
                               </div>
                               <textarea 
                                  className="flex-1 w-full p-6 bg-neutral-50 border border-neutral-200 rounded-xl font-serif text-neutral-800 leading-relaxed focus:outline-none resize-none"
                                  value={generatedCoverLetter}
                                  onChange={(e) => setGeneratedCoverLetter(e.target.value)}
                               ></textarea>
                          </div>
                      )}
                  </div>

                  {!generatedCoverLetter && (
                      <div className="p-6 border-t bg-neutral-50 flex justify-end">
                          <Button 
                            onClick={handleCreateCoverLetter} 
                            isLoading={isWritingLetter}
                            disabled={!coverLetterCompany || !coverLetterJobDesc}
                            className="w-full md:w-auto"
                          >
                              Generate Cover Letter <Sparkles className="ml-2 w-4 h-4" />
                          </Button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Interview Prep Modal */}
      {showInterviewPrep && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <Mic className="w-5 h-5 text-purple-600" /> Interview Prep
                      </h3>
                      <button onClick={() => setShowInterviewPrep(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {isGeneratingQuestions ? (
                          <div className="flex flex-col items-center justify-center py-12">
                              <Sparkles className="w-12 h-12 text-neutral-900 animate-pulse mb-4" />
                              <p className="text-neutral-500">Generating custom interview questions based on your experience...</p>
                          </div>
                      ) : interviewQuestions.length > 0 ? (
                          <div className="space-y-6">
                              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-sm text-purple-800 mb-4">
                                  <p>Here are 5 potential questions a recruiter might ask you based on this resume.</p>
                              </div>
                              <ul className="space-y-4">
                                  {interviewQuestions.map((q, i) => (
                                      <li key={i} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                                          <span className="font-bold text-neutral-400 mr-2">Q{i+1}.</span>
                                          <span className="font-medium text-neutral-900">{q}</span>
                                      </li>
                                  ))}
                              </ul>
                              <div className="flex justify-center mt-6">
                                  <Button variant="secondary" onClick={handleInterviewPrep}>Regenerate Questions</Button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-center py-12">
                              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Mic className="w-8 h-8 text-purple-600" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">Ready to practice?</h3>
                              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                  We'll scan your resume to predict likely technical and behavioral questions.
                              </p>
                              <Button onClick={handleInterviewPrep} variant="primary">Generate Questions</Button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Job Match Modal */}
      {showJobMatch && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-red-600" /> Job Match Analysis
                      </h3>
                      <button onClick={() => setShowJobMatch(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8">
                      {!jobMatchResult ? (
                          <div className="space-y-6">
                              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-sm text-neutral-600">
                                  <p>Paste a job description below to see how well your resume matches and identify missing keywords.</p>
                              </div>
                              <TextArea 
                                  label="Job Description"
                                  value={jobMatchDesc}
                                  onChange={e => setJobMatchDesc(e.target.value)}
                                  placeholder="Paste job description here..."
                                  className="min-h-[200px]"
                              />
                              <div className="flex justify-end">
                                  <Button 
                                      onClick={handleJobMatch} 
                                      isLoading={isAnalyzingJob}
                                      disabled={!jobMatchDesc}
                                  >
                                      Analyze Match <Target className="ml-2 w-4 h-4" />
                                  </Button>
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-8">
                               {/* Score */}
                              <div className="flex items-center gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                                  <div className="relative w-24 h-24 flex-shrink-0">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                          <path className="text-neutral-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                          <path className={`${jobMatchResult.score > 70 ? 'text-green-500' : 'text-orange-500'}`} strokeDasharray={`${jobMatchResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                                          <span className="text-2xl font-bold">{jobMatchResult.score}%</span>
                                          <span className="text-[10px] uppercase font-bold text-neutral-400">Match</span>
                                      </div>
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-lg mb-1">Match Analysis</h4>
                                      <p className="text-sm text-neutral-600">{jobMatchResult.advice}</p>
                                  </div>
                              </div>

                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700">
                                      <AlertCircle className="w-5 h-5" /> Missing Keywords
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                      {jobMatchResult.missingKeywords.map((k, i) => (
                                          <span key={i} className="px-3 py-1.5 bg-red-50 text-red-800 text-sm rounded-full border border-red-100 font-medium">
                                              {k}
                                          </span>
                                      ))}
                                      {jobMatchResult.missingKeywords.length === 0 && (
                                          <span className="text-sm text-green-600">No major keywords missing! Great job.</span>
                                      )}
                                  </div>
                              </div>
                              
                              <div className="flex justify-center pt-4">
                                  <Button variant="secondary" onClick={() => setJobMatchResult(null)}>Analyze Another Job</Button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Career Path Modal */}
      {showCareerPath && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-purple-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-purple-900">
                          <Compass className="w-6 h-6 text-purple-600" /> Career Path
                      </h3>
                      <button onClick={() => setShowCareerPath(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8">
                      {isAnalzyingCareer ? (
                           <div className="flex flex-col items-center justify-center py-12">
                               <Sparkles className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
                               <p className="text-neutral-500">Mapping your future career trajectory...</p>
                           </div>
                      ) : careerPaths.length > 0 ? (
                          <div className="space-y-8">
                               <p className="text-neutral-600">Based on your current experience, here are 3 potential career moves you could make.</p>
                               <div className="grid gap-6">
                                   {careerPaths.map((path, i) => (
                                       <div key={i} className="border border-neutral-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                                           <div className="flex justify-between items-start mb-4">
                                               <div>
                                                   <h4 className="text-xl font-bold text-neutral-900">{path.role}</h4>
                                                   <div className="text-sm text-green-600 font-medium mt-1">{path.matchScore}% Skill Match</div>
                                               </div>
                                               <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">
                                                   {i+1}
                                               </div>
                                           </div>
                                           <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{path.reasoning}</p>
                                           
                                           {path.missingSkills.length > 0 && (
                                               <div>
                                                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Skills to Acquire</div>
                                                   <div className="flex flex-wrap gap-2">
                                                       {path.missingSkills.map(skill => (
                                                           <span key={skill} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-100">
                                                               + {skill}
                                                           </span>
                                                       ))}
                                                   </div>
                                               </div>
                                           )}
                                       </div>
                                   ))}
                               </div>
                               <div className="flex justify-center mt-4">
                                   <Button variant="secondary" onClick={handleCareerPath}>Regenerate Paths</Button>
                               </div>
                          </div>
                      ) : (
                          <div className="text-center py-12">
                              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Compass className="w-8 h-8 text-purple-600" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">Where to next?</h3>
                              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                  Our advanced AI analyzes your history to suggest logical next steps and identifies skill gaps.
                              </p>
                              <Button onClick={handleCareerPath} className="bg-purple-600 hover:bg-purple-700 text-white">Analyze Career Path</Button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* LinkedIn Generator */}
      {showLinkedIn && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-blue-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-blue-900">
                          <Linkedin className="w-6 h-6 text-blue-600" /> LinkedIn Optimizer
                      </h3>
                      <button onClick={() => setShowLinkedIn(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8">
                       {isGeneratingLinkedIn ? (
                           <div className="flex flex-col items-center justify-center py-12">
                               <Sparkles className="w-12 h-12 text-blue-600 animate-pulse mb-4" />
                               <p className="text-neutral-500">Crafting your personal brand...</p>
                           </div>
                       ) : linkedInContent ? (
                           <div className="space-y-8">
                               {/* Headline */}
                               <div>
                                   <div className="flex justify-between items-end mb-2">
                                       <h4 className="font-bold text-neutral-900">Optimized Headline</h4>
                                       <button onClick={() => navigator.clipboard.writeText(linkedInContent.headline)} className="text-xs text-blue-600 hover:underline">Copy</button>
                                   </div>
                                   <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-medium">
                                       {linkedInContent.headline}
                                   </div>
                               </div>

                               {/* About */}
                               <div>
                                   <div className="flex justify-between items-end mb-2">
                                       <h4 className="font-bold text-neutral-900">About Section</h4>
                                       <button onClick={() => navigator.clipboard.writeText(linkedInContent.about)} className="text-xs text-blue-600 hover:underline">Copy</button>
                                   </div>
                                   <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm whitespace-pre-wrap">
                                       {linkedInContent.about}
                                   </div>
                               </div>

                               {/* Posts */}
                               <div>
                                   <h4 className="font-bold text-neutral-900 mb-2">Draft Post Ideas</h4>
                                   <div className="grid gap-4">
                                       {linkedInContent.posts.map((post, i) => (
                                           <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm text-sm whitespace-pre-wrap">
                                               {post}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           </div>
                       ) : (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Linkedin className="w-8 h-8 text-blue-600" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">Go Viral on LinkedIn</h3>
                              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                  Convert your resume into a compelling headline, bio, and engagement posts instantly.
                              </p>
                              <Button onClick={handleLinkedInGen} className="bg-blue-600 hover:bg-blue-700 text-white">Generate Content</Button>
                          </div>
                       )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
