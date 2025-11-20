import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { generateResumeSummary, improveJobDescription, suggestSkills } from '../services/geminiService';
import { ResumePreview } from './ResumePreview';
import { Input, TextArea } from './InputField';
import { Button } from './Button';
import { ExperienceEditor, EducationEditor } from './SectionEditor';
import { 
  Sparkles, 
  Download, 
  User, 
  Settings2, 
  Trash2,
  Briefcase,
  FileText
} from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: 'Alex Taylor',
    email: 'alex.taylor@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'linkedin.com/in/alextaylor',
    jobTitle: 'Product Designer',
    summary: 'Creative Product Designer with 5+ years of experience in building user-centric digital products. Proven track record of improving user engagement and streamlining design processes. Adept at collaborating with cross-functional teams to deliver high-quality solutions.',
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Inc.',
      position: 'Senior Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: '• Led the redesign of the core mobile application, resulting in a 25% increase in daily active users.\n• Collaborated with engineering and product teams to define product strategy and roadmap.\n• Mentored junior designers and established a new design system used across 3 products.'
    },
    {
      id: '2',
      company: 'Creative Solutions',
      position: 'UI/UX Designer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      current: false,
      description: '• Designed intuitive interfaces for web and mobile applications for fintech clients.\n• Conducted user research and usability testing to iterate on design prototypes.\n• Worked closely with developers to ensure accurate implementation of designs.'
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of Design',
      degree: 'Bachelor of Arts',
      field: 'Interaction Design',
      graduationDate: 'May 2018'
    }
  ],
  projects: [],
  skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS', 'Agile Methodology', 'Design Systems']
};

interface ResumeBuilderProps {
    onGoHome: () => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onGoHome }) => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const previewRef = useRef<HTMLDivElement>(null);

  // --- State Updates ---
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateExperience = (newExperience: Experience[]) => {
    setData(prev => ({ ...prev, experience: newExperience }));
  };

  const updateEducation = (newEducation: Education[]) => {
    setData(prev => ({ ...prev, education: newEducation }));
  };

  // --- AI Handlers ---

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateResumeSummary(data);
      updatePersonalInfo('summary', summary);
    } catch (error) {
      alert('Failed to generate summary. Please check your API key or try again.');
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
    
    // Use the most recent experience description for context, or summary
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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-50 overflow-hidden animate-in fade-in duration-500">
      
      {/* Left Panel: Editor */}
      <div className="w-full md:w-[550px] lg:w-[600px] flex flex-col bg-white border-r border-neutral-200 shadow-xl z-10 no-print">
        
        {/* Top Bar */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
               <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight group-hover:text-neutral-700 transition-colors">Resubuild</h1>
          </div>
          <Button onClick={handlePrint} variant="primary" icon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 overflow-x-auto hide-scrollbar">
          {[
            { id: 'personal', label: 'Personal', icon: User },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: Settings2 },
            { id: 'skills', label: 'Skills', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
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

        </div>
      </div>

      {/* Right Panel: Preview */}
      <ResumePreview data={data} previewRef={previewRef} />

    </div>
  );
}