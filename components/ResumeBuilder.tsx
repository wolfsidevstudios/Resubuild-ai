
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Experience, Education, Project, CustomSectionItem } from '../types';
import { generateResumeSummary, improveJobDescription, suggestSkills } from '../services/geminiService';
import { saveResume, createEmptyResume } from '../services/storageService';
import { ResumePreview } from './ResumePreview';
import { Input, TextArea } from './InputField';
import { Button } from './Button';
import { ExperienceEditor, EducationEditor, ProjectEditor, CustomSectionEditor } from './SectionEditor';
import { 
  Sparkles, 
  Download, 
  User, 
  Settings2, 
  Trash2,
  Briefcase,
  FileText,
  FolderGit2,
  Palette,
  PlusCircle,
  Layout,
  GraduationCap,
  Save,
  ChevronLeft
} from 'lucide-react';

interface ResumeBuilderProps {
    initialData?: ResumeData;
    onGoHome: () => void;
}

const COLORS = [
  '#000000', // Black
  '#2563EB', // Blue
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#DB2777', // Pink
  '#D97706', // Amber
  '#DC2626', // Red
  '#4B5563', // Gray
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, onGoHome }) => {
  const [data, setData] = useState<ResumeData>(initialData || createEmptyResume());
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save effect
  useEffect(() => {
    const timeout = setTimeout(() => {
        saveResume(data);
        setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data]);

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

  // --- Print ---
  const handlePrint = () => {
    window.print();
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
               <span className="text-xs text-neutral-400 flex items-center gap-1">
                   <Save className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
           </div>
           <div className="flex items-center justify-between">
             <input 
                className="text-xl font-bold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-none w-full mr-4"
                value={data.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="Resume Name"
             />
             <Button onClick={handlePrint} variant="primary" icon={<Download className="w-4 h-4" />}>
                Export
             </Button>
           </div>
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
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" /> Accent Color
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => setData({...data, themeColor: color})}
                                className={`w-10 h-10 rounded-full shadow-sm border-2 transition-all hover:scale-110 ${data.themeColor === color ? 'border-neutral-900 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-2 font-medium">Tip</p>
                    <p className="text-sm text-neutral-500">Use a dark accent color for better readability when printed. Standard black is always the safest choice for Applicant Tracking Systems (ATS).</p>
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
      <ResumePreview data={data} previewRef={previewRef} />

    </div>
  );
}
