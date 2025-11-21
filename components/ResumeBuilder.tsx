
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
    generateInteractivePortfolio,
    generateMetricSuggestions,
    rewriteTextWithTone,
    translateResumeJSON
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
  MonitorPlay,
  Layers,
  Plus,
  Calculator,
  Languages,
  Megaphone,
  Loader2
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
    { id: 'professional', name: 'Professional', icon: FileText },
    { id: 'elegant', name: 'Elegant', icon: Feather },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'minimal', name: 'Minimal', icon: AlignLeft },
    { id: 'tech', name: 'Tech', icon: Terminal },
];

// Helper Component for Sidebar Icons
const SidebarItem = ({ icon: Icon, label, active, onClick, color, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative flex-shrink-0
      ${active ? 'bg-neutral-900 text-white shadow-md scale-105' : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900'}
      ${className}
    `}
  >
    <Icon className={`w-5 h-5 ${!active && color ? color : ''}`} />
    
    {/* Tooltip */}
    <div className="absolute left-14 bg-neutral-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl translate-x-2 group-hover:translate-x-0">
      {label}
      {/* Arrow */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-neutral-900 rotate-45"></div>
    </div>
  </button>
);

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, onGoHome, userId }) => {
  const [data, setData] = useState<ResumeData>(initialData || createEmptyResume());
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('design');
  
  // Custom Section State (handled via modal or simple prompt in new layout)
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isATSMode, setIsATSMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  // Feature Modals
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

  // New Tools
  const [showMetricBooster, setShowMetricBooster] = useState(false);
  const [metricSuggestions, setMetricSuggestions] = useState<string[]>([]);
  const [selectedExpForMetric, setSelectedExpForMetric] = useState<string>('');
  const [isBoostingMetrics, setIsBoostingMetrics] = useState(false);

  const [showTonePolish, setShowTonePolish] = useState(false);
  const [toneTarget, setToneTarget] = useState<'summary' | 'experience'>('summary');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [isPolishingTone, setIsPolishingTone] = useState(false);

  const [showTranslate, setShowTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

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
    setShowAddSection(false);
    setActiveTab(newSection.id);
  };

  const removeCustomSection = (id: string) => {
    if (confirm('Are you sure you want to delete this entire section?')) {
        setData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));
        setActiveTab('personal');
    }
  };

  // --- AI Handlers (Same as before) ---
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateResumeSummary(data);
      updatePersonalInfo('summary', summary);
    } catch (error) {
      alert('Failed to generate summary.');
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
    try {
      const newSkills = await suggestSkills(data.personalInfo.jobTitle, data.personalInfo.summary);
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
      } catch (e) { console.error(e); } finally { setIsAuditing(false); }
  };

  const handleCreateCoverLetter = async () => {
      if (!coverLetterJobDesc || !coverLetterCompany) return;
      setIsWritingLetter(true);
      try {
          const letter = await generateCoverLetter(data, coverLetterJobDesc, coverLetterCompany);
          setGeneratedCoverLetter(letter);
      } catch (e) { console.error(e); } finally { setIsWritingLetter(false); }
  };

  const handleInterviewPrep = async () => {
      setIsGeneratingQuestions(true);
      try {
          const questions = await generateInterviewQuestions(data);
          setInterviewQuestions(questions);
      } catch (e) { console.error(e); } finally { setIsGeneratingQuestions(false); }
  };

  const handleJobMatch = async () => {
      if(!jobMatchDesc) return;
      setIsAnalyzingJob(true);
      try {
          const result = await analyzeJobMatch(data, jobMatchDesc);
          setJobMatchResult(result);
      } catch (e) { console.error(e); } finally { setIsAnalyzingJob(false); }
  };
  
  const handleCareerPath = async () => {
      setIsAnalyzingCareer(true);
      try {
          const paths = await suggestCareerPaths(data);
          setCareerPaths(paths);
      } catch (e) { console.error(e); } finally { setIsAnalyzingCareer(false); }
  };

  const handleLinkedInGen = async () => {
       setIsGeneratingLinkedIn(true);
       try {
           const content = await generateLinkedInContent(data);
           setLinkedInContent(content);
       } catch (e) { console.error(e); } finally { setIsGeneratingLinkedIn(false); }
  };

  const handleGenerateApp = async () => {
      setIsGeneratingApp(true);
      try {
          const html = await generateInteractivePortfolio(data);
          setGeneratedAppHtml(html);
      } catch (e) { alert("Failed to generate app."); } finally { setIsGeneratingApp(false); }
  };
  
  const handleMetricBoost = async () => {
      if (!selectedExpForMetric) return;
      const exp = data.experience.find(e => e.id === selectedExpForMetric);
      if (!exp) return;
      
      setIsBoostingMetrics(true);
      try {
          const suggestions = await generateMetricSuggestions(exp.description, exp.position);
          setMetricSuggestions(suggestions);
      } catch (e) { console.error(e); } finally { setIsBoostingMetrics(false); }
  };

  const applyMetricSuggestion = (suggestion: string) => {
      if (!selectedExpForMetric) return;
      setData(prev => ({
          ...prev,
          experience: prev.experience.map(e => e.id === selectedExpForMetric ? { ...e, description: suggestion } : e)
      }));
      setShowMetricBooster(false);
      setMetricSuggestions([]);
  };

  const handleTonePolish = async () => {
      setIsPolishingTone(true);
      try {
          if (toneTarget === 'summary') {
              const newSummary = await rewriteTextWithTone(data.personalInfo.summary, selectedTone);
              updatePersonalInfo('summary', newSummary);
          } else {
               // Polish all experience descriptions
               const newExperience = await Promise.all(data.experience.map(async (e) => ({
                   ...e,
                   description: await rewriteTextWithTone(e.description, selectedTone)
               })));
               updateExperience(newExperience);
          }
          setShowTonePolish(false);
      } catch (e) { console.error(e); } finally { setIsPolishingTone(false); }
  };
  
  const handleTranslation = async () => {
      setIsTranslating(true);
      try {
          const translatedData = await translateResumeJSON(data, targetLang);
          setData(translatedData);
          setShowTranslate(false);
      } catch (e) { alert("Translation failed. Please try a different language."); } finally { setIsTranslating(false); }
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
  };

  const handlePrint = () => window.print();

  const handlePublish = async () => {
      if (!confirm("Publish to Discover page?")) return;
      setIsPublishing(true);
      try {
          await publishResume(data, userId);
          setShowPublishSuccess(true);
          setTimeout(() => setShowPublishSuccess(false), 4000);
      } catch (error) { console.error(error); } finally { setIsPublishing(false); }
  };

  // Skill Helpers
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

  const navTabs = [
    { id: 'design', label: 'Design & Layout', icon: Palette },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Sparkles },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden animate-in fade-in duration-500 font-sans">
      
      {/* 1. THIN SIDEBAR */}
      <aside className="w-18 md:w-20 bg-white border-r border-neutral-200 flex flex-col items-center py-6 gap-4 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full overflow-y-auto custom-scrollbar">
        
        <SidebarItem 
            icon={ChevronLeft} 
            label="Back to Dashboard" 
            onClick={onGoHome} 
        />
        
        <div className="w-8 h-px bg-neutral-100 my-2" />

        {/* Navigation */}
        <div className="flex flex-col gap-3">
            {navTabs.map(tab => (
                <SidebarItem 
                    key={tab.id}
                    icon={tab.icon}
                    label={tab.label}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                />
            ))}
            {/* Dynamic Sections */}
            {data.customSections.map(section => (
                <SidebarItem 
                    key={section.id}
                    icon={Layers}
                    label={section.title}
                    active={activeTab === section.id}
                    onClick={() => setActiveTab(section.id)}
                />
            ))}
            <SidebarItem 
                icon={Plus} 
                label="Add Section" 
                onClick={() => setShowAddSection(true)} 
                className="border border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
            />
        </div>

        <div className="flex-1" /> {/* Spacer */}

        {/* AI Tools */}
        <div className="flex flex-col gap-3 pb-6">
             <div className="w-8 h-px bg-neutral-100 mb-2 mx-auto" />
             <SidebarItem icon={Calculator} label="Metric Booster" onClick={() => setShowMetricBooster(true)} color="text-emerald-600" />
             <SidebarItem icon={Megaphone} label="Tone Polish" onClick={() => setShowTonePolish(true)} color="text-pink-600" />
             <SidebarItem icon={Languages} label="Translate" onClick={() => setShowTranslate(true)} color="text-cyan-600" />
             <SidebarItem icon={BrainCircuit} label="Deep Audit" onClick={() => handleAudit(true)} color="text-purple-600" />
             <SidebarItem icon={Target} label="Job Match" onClick={() => setShowJobMatch(true)} color="text-red-600" />
             <SidebarItem icon={PenTool} label="Cover Letter" onClick={() => setShowCoverLetter(true)} color="text-blue-600" />
             <SidebarItem icon={Mic} label="Interview Prep" onClick={() => setShowInterviewPrep(true)} color="text-green-600" />
             <SidebarItem icon={Linkedin} label="LinkedIn" onClick={() => setShowLinkedIn(true)} color="text-blue-700" />
             <SidebarItem icon={Compass} label="Career Path" onClick={() => setShowCareerPath(true)} color="text-orange-600" />
             <SidebarItem icon={Code2} label="Appify" onClick={() => setShowAppGen(true)} color="text-neutral-900" />
        </div>
      </aside>

      {/* 2. MAIN CONTENT (Editor + Preview) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* EDITOR PANEL */}
        <div className="w-full md:w-[500px] lg:w-[550px] flex flex-col bg-white border-r border-neutral-200 z-10 shadow-xl">
            
            {/* Simplified Header */}
            <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 flex-shrink-0 bg-white z-20">
                <input 
                    className="text-lg font-bold text-neutral-900 bg-transparent focus:outline-none w-full mr-4 placeholder-neutral-400 truncate"
                    value={data.name}
                    onChange={(e) => updateName(e.target.value)}
                    placeholder="Untitled Resume"
                />
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={handlePublish} 
                        icon={<Globe className="w-4 h-4" />} 
                        title="Publish to Discover"
                        isLoading={isPublishing}
                    />
                    <Button onClick={handlePrint} icon={<Download className="w-4 h-4" />} className="whitespace-nowrap">
                        Export
                    </Button>
                </div>
            </div>
            
            {showPublishSuccess && (
               <div className="px-6 py-2 bg-green-50 text-green-600 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                   <CheckCircle2 className="w-4 h-4" /> Published successfully!
               </div>
            )}
            
            {/* Add Section Input (Conditional) */}
            {showAddSection && (
                <div className="p-4 border-b border-neutral-100 bg-neutral-50 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <input 
                            autoFocus
                            className="flex-1 px-3 py-2 text-sm border rounded-lg border-neutral-300 focus:outline-none focus:border-neutral-900"
                            placeholder="New Section Name (e.g. Volunteer)"
                            value={newSectionName}
                            onChange={e => setNewSectionName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomSection()}
                        />
                        <Button onClick={addCustomSection} variant="primary" className="py-2 h-auto">Add</Button>
                        <button onClick={() => setShowAddSection(false)} className="p-2 hover:bg-neutral-200 rounded-lg"><X className="w-4 h-4"/></button>
                    </div>
                </div>
            )}

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                 {activeTab === 'design' && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Layout className="w-5 h-5" /> Template</h3>
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
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Accent Color</h3>
                            <div className="grid grid-cols-6 gap-3">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setData({...data, themeColor: color})}
                                        className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all hover:scale-110 ${data.themeColor === color ? 'border-neutral-900 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-neutral-100 pt-6">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-neutral-600 transition-colors"><FileCheck className="w-5 h-5" /> ATS Friendly Mode</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Removes graphics for better parsing.</p>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isATSMode ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isATSMode ? 'translate-x-5' : ''}`} />
                                    <input type="checkbox" checked={isATSMode} onChange={e => setIsATSMode(e.target.checked)} className="hidden" />
                                </div>
                            </label>
                        </div>
                     </div>
                 )}

                 {activeTab === 'personal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                        <Input label="Job Title" value={data.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                        <Input label="Phone" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                        <Input label="Location" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                        <Input label="Website" value={data.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
                      </div>
                      <div className="relative">
                        <TextArea label="Professional Summary" value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} className="min-h-[160px]" />
                        <div className="absolute bottom-3 right-3">
                           <Button variant="primary" onClick={handleGenerateSummary} isLoading={isGeneratingSummary} icon={<Sparkles className="w-3 h-3" />} className="text-xs py-1.5 px-3 bg-black">Auto-Write</Button>
                        </div>
                      </div>
                    </div>
                 )}

                 {activeTab === 'experience' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ExperienceEditor items={data.experience} onChange={updateExperience} onImprove={handleImproveDescription} isImproving={improvingExpId} />
                    </div>
                 )}

                 {activeTab === 'education' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <EducationEditor items={data.education} onChange={updateEducation} />
                    </div>
                 )}
                 
                 {activeTab === 'projects' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ProjectEditor items={data.projects} onChange={updateProjects} />
                    </div>
                 )}

                 {activeTab === 'skills' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-lg mb-6 flex items-center justify-between">
                         <div>
                             <h3 className="font-bold text-lg">AI Skill Suggestions</h3>
                             <p className="text-neutral-400 text-xs">Based on job title & summary</p>
                         </div>
                         <Button variant="secondary" onClick={handleSuggestSkills}>Generate</Button>
                      </div>
                      <Input label="Add Skill (Press Enter)" onKeyDown={addSkill} placeholder="e.g. React..." />
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="ml-2 text-neutral-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                 )}

                 {data.customSections.map(section => activeTab === section.id && (
                      <div key={section.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <CustomSectionEditor title={section.title} items={section.items} onChange={(items) => updateCustomSection(section.id, items)} onDeleteSection={() => removeCustomSection(section.id)} />
                      </div>
                 ))}
            </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="flex-1 bg-neutral-100/50 relative flex justify-center overflow-hidden">
             {/* Floating Action Bar */}
             <div className="absolute top-6 z-30 bg-neutral-900 text-white rounded-full shadow-xl flex items-center gap-1 px-3 py-1.5 border border-neutral-800 opacity-90 hover:opacity-100 transition-opacity">
                 <button onClick={handleFixGrammar} disabled={isFixingGrammar} className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-800 rounded-full transition-colors text-xs font-bold disabled:opacity-50">
                     <Wand2 className={`w-3.5 h-3.5 ${isFixingGrammar ? 'animate-spin' : ''}`} />
                     {isFixingGrammar ? 'Fixing...' : 'Fix Grammar'}
                 </button>
                 <div className="w-px h-3 bg-neutral-700"></div>
                 <button onClick={() => handleAudit(false)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-800 rounded-full transition-colors text-xs font-bold text-neutral-300 hover:text-white">
                     <FileCheck className="w-3.5 h-3.5" /> Quick Audit
                 </button>
             </div>

             <div className="w-full h-full overflow-auto custom-scrollbar p-8 flex justify-center">
                 <ResumePreview data={data} previewRef={previewRef} isATSMode={isATSMode} />
             </div>
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Metric Booster Modal */}
      {showMetricBooster && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center bg-emerald-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-800"><Calculator className="w-6 h-6 text-emerald-600" /> Metric Booster</h3>
                      <button onClick={() => setShowMetricBooster(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      <p className="text-sm text-neutral-500 mb-6">Select an experience item to analyze. AI will suggest quantifiable metrics to make your bullets punchier.</p>
                      
                      {data.experience.length === 0 ? (
                           <div className="text-center p-8 text-neutral-400 border-2 border-dashed rounded-xl">No experience added yet.</div>
                      ) : (
                          <div className="space-y-4">
                              {data.experience.map(exp => (
                                  <button 
                                    key={exp.id}
                                    onClick={() => { setSelectedExpForMetric(exp.id); handleMetricBoost(); }} // Triggers AI immediately on select for UX speed in demo
                                    className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${selectedExpForMetric === exp.id ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 hover:border-emerald-300'}`}
                                  >
                                      <div className="font-bold">{exp.position}</div>
                                      <div className="text-xs text-neutral-500">{exp.company}</div>
                                      <div className="text-xs text-neutral-400 mt-2 line-clamp-2">{exp.description}</div>
                                  </button>
                              ))}
                          </div>
                      )}
                      
                      {isBoostingMetrics && (
                          <div className="flex flex-col items-center justify-center py-8">
                              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                              <span className="text-sm text-emerald-600 font-medium">Finding numbers...</span>
                          </div>
                      )}
                      
                      {metricSuggestions.length > 0 && (
                          <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4">
                              <h4 className="font-bold text-neutral-900">Suggestions (Click to Apply)</h4>
                              {metricSuggestions.map((sugg, i) => (
                                  <div 
                                    key={i}
                                    onClick={() => applyMetricSuggestion(sugg)}
                                    className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 cursor-pointer transition-all"
                                  >
                                      <p className="text-sm text-neutral-700 leading-relaxed">{sugg}</p>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
      
      {/* Tone Polish Modal */}
      {showTonePolish && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center bg-pink-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-pink-900"><Megaphone className="w-6 h-6 text-pink-600" /> Tone Polish</h3>
                      <button onClick={() => setShowTonePolish(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Target Section</label>
                          <div className="flex bg-neutral-100 p-1 rounded-xl">
                              <button onClick={() => setToneTarget('summary')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${toneTarget === 'summary' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'}`}>Summary</button>
                              <button onClick={() => setToneTarget('experience')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${toneTarget === 'experience' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'}`}>Experience</button>
                          </div>
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Select Tone</label>
                          <div className="grid grid-cols-2 gap-3">
                              {['Professional', 'Executive', 'Startup', 'Academic', 'Creative', 'Confident'].map(tone => (
                                  <button 
                                    key={tone}
                                    onClick={() => setSelectedTone(tone)}
                                    className={`py-2 px-4 text-sm rounded-lg border transition-all ${selectedTone === tone ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                  >
                                      {tone}
                                  </button>
                              ))}
                          </div>
                      </div>
                      
                      <Button onClick={handleTonePolish} isLoading={isPolishingTone} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                          Rewrite Content
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Translator Modal */}
      {showTranslate && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-cyan-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-cyan-900"><Languages className="w-6 h-6 text-cyan-600" /> Resume Translator</h3>
                      <button onClick={() => setShowTranslate(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <p className="text-sm text-neutral-500">Instantly translate your entire resume while maintaining formatting. Useful for international applications.</p>
                      
                      <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Target Language</label>
                          <select 
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={targetLang}
                            onChange={e => setTargetLang(e.target.value)}
                          >
                              {['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese (Simplified)', 'Japanese', 'Hindi'].map(lang => (
                                  <option key={lang} value={lang}>{lang}</option>
                              ))}
                          </select>
                      </div>

                      <Button onClick={handleTranslation} isLoading={isTranslating} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                          Translate Resume
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {showAppGen && (
           <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-neutral-900 text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <MonitorPlay className="w-6 h-6" /> Interactive Portfolio
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
                               <p className="text-neutral-500">Generating a single-file React/HTML portfolio.</p>
                           </div>
                      ) : generatedAppHtml ? (
                          <div className="flex-1 flex flex-col">
                               <div className="bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
                                   <div className="text-sm text-neutral-500">Preview of <strong>portfolio.html</strong></div>
                                   <Button onClick={handleDownloadApp} variant="primary" icon={<Download className="w-4 h-4"/>}>Download HTML</Button>
                               </div>
                               <iframe srcDoc={generatedAppHtml} className="flex-1 w-full h-full border-none" title="App Preview" />
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg transform rotate-3">
                                  <Code2 className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-3xl font-bold mb-4">Resume to Website</h3>
                              <p className="text-lg text-neutral-500 mb-8 max-w-lg">Generate a stunning, interactive, single-file HTML portfolio.</p>
                              <Button onClick={handleGenerateApp} className="px-8 py-4 text-lg rounded-full" icon={<Sparkles className="w-5 h-5"/>}>Generate App</Button>
                          </div>
                      )}
                  </div>
              </div>
           </div>
      )}

      {showAudit && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-purple-600" /> AI Resume Audit</h3>
                      <button onClick={() => setShowAudit(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {isAuditing ? (
                           <div className="flex flex-col items-center justify-center py-12">
                               <Sparkles className="w-12 h-12 text-neutral-900 animate-pulse mb-4" />
                               <p className="text-neutral-500">Analyzing your career history...</p>
                           </div>
                      ) : auditResult ? (
                          <div className="space-y-8">
                              <div className="flex items-center gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                                  <div className="relative w-24 h-24 flex-shrink-0">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                          <path className="text-neutral-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                          <path className={`${auditResult.score > 80 ? 'text-green-500' : auditResult.score > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} strokeDasharray={`${auditResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-2xl font-bold">{auditResult.score}</span><span className="text-[10px] uppercase font-bold text-neutral-400">Score</span></div>
                                  </div>
                                  <div><h4 className="font-bold text-lg mb-1">Audit Summary</h4><p className="text-sm text-neutral-600">{auditResult.summary}</p></div>
                              </div>
                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-green-700"><CheckCircle2 className="w-5 h-5" /> Key Strengths</h4>
                                  <div className="grid gap-2">{auditResult.strengths.map((s, i) => (<div key={i} className="px-4 py-3 bg-green-50 text-green-800 text-sm rounded-xl border border-green-100">{s}</div>))}</div>
                              </div>
                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700"><AlertCircle className="w-5 h-5" /> Needs Improvement</h4>
                                  <div className="grid gap-2">{auditResult.improvements.map((s, i) => (<div key={i} className="px-4 py-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">{s}</div>))}</div>
                              </div>
                          </div>
                      ) : null}
                  </div>
              </div>
          </div>
      )}

      {/* Cover Letter, Interview, Job Match, Career Path, LinkedIn Modals... (Logic retained from previous implementation) */}
      {showCoverLetter && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2"><PenTool className="w-5 h-5 text-blue-600" /> AI Cover Letter</h3>
                      <button onClick={() => setShowCoverLetter(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {!generatedCoverLetter ? (
                          <div className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                  <Input label="Company Name" value={coverLetterCompany} onChange={e => setCoverLetterCompany(e.target.value)} />
                                  <Input label="Target Job Title" value={data.personalInfo.jobTitle} disabled className="bg-neutral-100" />
                              </div>
                              <TextArea label="Job Description" value={coverLetterJobDesc} onChange={e => setCoverLetterJobDesc(e.target.value)} placeholder="Paste job description..." className="min-h-[200px]" />
                          </div>
                      ) : (
                          <div className="space-y-4 h-full flex flex-col">
                               <div className="flex justify-end gap-2">
                                   <Button variant="ghost" onClick={() => navigator.clipboard.writeText(generatedCoverLetter)} icon={<Copy className="w-4 h-4" />}>Copy</Button>
                                   <Button variant="secondary" onClick={() => setGeneratedCoverLetter('')}>Reset</Button>
                               </div>
                               <textarea className="flex-1 w-full p-6 bg-neutral-50 border border-neutral-200 rounded-xl font-serif text-neutral-800 leading-relaxed focus:outline-none resize-none" value={generatedCoverLetter} onChange={(e) => setGeneratedCoverLetter(e.target.value)}></textarea>
                          </div>
                      )}
                  </div>
                  {!generatedCoverLetter && (
                      <div className="p-6 border-t bg-neutral-50 flex justify-end">
                          <Button onClick={handleCreateCoverLetter} isLoading={isWritingLetter} disabled={!coverLetterCompany || !coverLetterJobDesc} className="w-full md:w-auto">Generate <Sparkles className="ml-2 w-4 h-4" /></Button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {showInterviewPrep && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Mic className="w-5 h-5 text-green-600" /> Interview Prep</h3>
                      <button onClick={() => setShowInterviewPrep(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {isGeneratingQuestions ? (
                          <div className="flex flex-col items-center justify-center py-12"><Sparkles className="w-12 h-12 text-neutral-900 animate-pulse mb-4" /><p className="text-neutral-500">Generating questions...</p></div>
                      ) : interviewQuestions.length > 0 ? (
                          <div className="space-y-6">
                              <ul className="space-y-4">{interviewQuestions.map((q, i) => (<li key={i} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"><span className="font-bold text-neutral-400 mr-2">Q{i+1}.</span><span className="font-medium text-neutral-900">{q}</span></li>))}</ul>
                              <div className="flex justify-center mt-6"><Button variant="secondary" onClick={handleInterviewPrep}>Regenerate</Button></div>
                          </div>
                      ) : (
                          <div className="text-center py-12"><Button onClick={handleInterviewPrep} variant="primary">Generate Questions</Button></div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {showJobMatch && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-red-600" /> Job Match</h3>
                      <button onClick={() => setShowJobMatch(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {!jobMatchResult ? (
                          <div className="space-y-6">
                              <TextArea label="Job Description" value={jobMatchDesc} onChange={e => setJobMatchDesc(e.target.value)} placeholder="Paste job description..." className="min-h-[200px]" />
                              <div className="flex justify-end"><Button onClick={handleJobMatch} isLoading={isAnalyzingJob} disabled={!jobMatchDesc}>Analyze Match <Target className="ml-2 w-4 h-4" /></Button></div>
                          </div>
                      ) : (
                          <div className="space-y-8">
                              <div className="flex items-center gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                                  <div className="relative w-24 h-24 flex-shrink-0"><div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-2xl font-bold">{jobMatchResult.score}%</span><span className="text-[10px] uppercase font-bold text-neutral-400">Match</span></div></div>
                                  <div><h4 className="font-bold text-lg mb-1">Analysis</h4><p className="text-sm text-neutral-600">{jobMatchResult.advice}</p></div>
                              </div>
                              <div>
                                  <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700"><AlertCircle className="w-5 h-5" /> Missing Keywords</h4>
                                  <div className="flex flex-wrap gap-2">{jobMatchResult.missingKeywords.map((k, i) => (<span key={i} className="px-3 py-1.5 bg-red-50 text-red-800 text-sm rounded-full border border-red-100 font-medium">{k}</span>))}</div>
                              </div>
                              <div className="flex justify-center pt-4"><Button variant="secondary" onClick={() => setJobMatchResult(null)}>Analyze Another</Button></div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {showCareerPath && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-purple-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-purple-900"><Compass className="w-6 h-6 text-purple-600" /> Career Path</h3>
                      <button onClick={() => setShowCareerPath(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {isAnalzyingCareer ? (
                           <div className="flex flex-col items-center justify-center py-12"><Sparkles className="w-12 h-12 text-purple-600 animate-pulse mb-4" /><p className="text-neutral-500">Mapping future...</p></div>
                      ) : careerPaths.length > 0 ? (
                          <div className="space-y-8">
                               <div className="grid gap-6">
                                   {careerPaths.map((path, i) => (
                                       <div key={i} className="border border-neutral-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                                           <div className="flex justify-between items-start mb-4">
                                               <div><h4 className="text-xl font-bold text-neutral-900">{path.role}</h4><div className="text-sm text-green-600 font-medium mt-1">{path.matchScore}% Skill Match</div></div>
                                               <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">{i+1}</div>
                                           </div>
                                           <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{path.reasoning}</p>
                                           {path.missingSkills.length > 0 && (
                                               <div>
                                                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Skills to Acquire</div>
                                                   <div className="flex flex-wrap gap-2">{path.missingSkills.map(skill => (<span key={skill} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-100">+ {skill}</span>))}</div>
                                               </div>
                                           )}
                                       </div>
                                   ))}
                               </div>
                               <div className="flex justify-center mt-4"><Button variant="secondary" onClick={handleCareerPath}>Regenerate</Button></div>
                          </div>
                      ) : (
                          <div className="text-center py-12"><Button onClick={handleCareerPath} className="bg-purple-600 hover:bg-purple-700 text-white">Analyze Career Path</Button></div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {showLinkedIn && (
          <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
                   <div className="p-6 border-b flex justify-between items-center bg-blue-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-blue-900"><Linkedin className="w-6 h-6 text-blue-600" /> LinkedIn Optimizer</h3>
                      <button onClick={() => setShowLinkedIn(false)} className="p-2 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                       {isGeneratingLinkedIn ? (
                           <div className="flex flex-col items-center justify-center py-12"><Sparkles className="w-12 h-12 text-blue-600 animate-pulse mb-4" /><p className="text-neutral-500">Crafting brand...</p></div>
                       ) : linkedInContent ? (
                           <div className="space-y-8">
                               <div><div className="flex justify-between items-end mb-2"><h4 className="font-bold text-neutral-900">Headline</h4><button onClick={() => navigator.clipboard.writeText(linkedInContent.headline)} className="text-xs text-blue-600 hover:underline">Copy</button></div><div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-medium">{linkedInContent.headline}</div></div>
                               <div><div className="flex justify-between items-end mb-2"><h4 className="font-bold text-neutral-900">About</h4><button onClick={() => navigator.clipboard.writeText(linkedInContent.about)} className="text-xs text-blue-600 hover:underline">Copy</button></div><div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm whitespace-pre-wrap">{linkedInContent.about}</div></div>
                               <div><h4 className="font-bold text-neutral-900 mb-2">Post Ideas</h4><div className="grid gap-4">{linkedInContent.posts.map((post, i) => (<div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm text-sm whitespace-pre-wrap">{post}</div>))}</div></div>
                           </div>
                       ) : (
                          <div className="text-center py-12"><Button onClick={handleLinkedInGen} className="bg-blue-600 hover:bg-blue-700 text-white">Generate Content</Button></div>
                       )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
