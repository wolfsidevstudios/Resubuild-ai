
import React, { useState, useEffect } from 'react';
import { ResumeData, Experience, Education } from '../types';
import { createEmptyResume, saveResume, saveAPIKey, hasAPIKey, getStoredAPIKey } from '../services/storageService';
import { generateResumeSummary, improveJobDescription, suggestSkills } from '../services/geminiService';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, User, Briefcase, GraduationCap, Loader2, Key } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: ResumeData) => void;
  onCancel: () => void;
  userId: string;
}

type Step = 'apikey' | 'personal' | 'education' | 'experience' | 'skills' | 'processing';

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel, userId }) => {
  const [step, setStep] = useState<Step>('apikey');
  const [data, setData] = useState<ResumeData>(createEmptyResume());
  const [loadingMsg, setLoadingMsg] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Check if API key exists already
  useEffect(() => {
      if (hasAPIKey()) {
          setApiKey(getStoredAPIKey() || '');
      }
  }, []);

  // Temporary state for array inputs during onboarding
  const [tempJob, setTempJob] = useState({ company: '', position: '', description: '' });
  const [tempEdu, setTempEdu] = useState({ institution: '', degree: '' });

  const updatePersonal = (field: string, value: string) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const handleSaveKey = () => {
      if (apiKey.trim()) {
          saveAPIKey(apiKey.trim());
      }
      setStep('personal');
  };

  const handleFinalize = async () => {
    setStep('processing');
    
    try {
      // 1. Add the entered experience if any
      let finalExperience = [...data.experience];
      if (tempJob.company && tempJob.position) {
         const newExp: Experience = {
            id: crypto.randomUUID(),
            company: tempJob.company,
            position: tempJob.position,
            description: tempJob.description,
            startDate: '2022', // Default placeholders
            endDate: 'Present',
            current: true
         };
         finalExperience = [newExp, ...finalExperience];
      }

      // 2. Add entered education if any
      let finalEdu = [...data.education];
      if (tempEdu.institution) {
          const newEdu: Education = {
              id: crypto.randomUUID(),
              institution: tempEdu.institution,
              degree: tempEdu.degree,
              field: '',
              graduationDate: '2022'
          };
          finalEdu = [newEdu, ...finalEdu];
      }

      // 3. AI Magic
      setLoadingMsg('Optimizing your profile...');
      
      // Generate summary if missing
      let summary = data.personalInfo.summary;
      if (!summary && data.personalInfo.jobTitle) {
          setLoadingMsg('Drafting a professional summary...');
          const mockDataForAI = { ...data, experience: finalExperience };
          try {
            summary = await generateResumeSummary(mockDataForAI);
          } catch(e) {
            console.error(e);
          }
      }

      // Enhance experience if present
      let enhancedExperience = finalExperience;
      if (finalExperience.length > 0 && finalExperience[0].description) {
          setLoadingMsg('Polishing job descriptions...');
          try {
            const improved = await improveJobDescription(finalExperience[0].description, finalExperience[0].position);
            enhancedExperience[0].description = improved;
          } catch (e) {
              console.error(e);
          }
      }
      
      // Suggest skills if empty
      let finalSkills = data.skills;
      if (finalSkills.length === 0 && data.personalInfo.jobTitle) {
           setLoadingMsg('Identifying top skills...');
           try {
               const suggestions = await suggestSkills(data.personalInfo.jobTitle, summary || '');
               finalSkills = suggestions.slice(0, 6);
           } catch (e) { console.error(e); }
      }

      const finalResume: ResumeData = {
          ...data,
          name: data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'My Resume',
          personalInfo: { ...data.personalInfo, summary: summary || '' },
          experience: enhancedExperience,
          education: finalEdu,
          skills: finalSkills
      };

      saveResume(finalResume, userId);
      
      // Small delay to show completion
      setLoadingMsg('Ready!');
      setTimeout(() => {
          onComplete(finalResume);
      }, 800);

    } catch (error) {
        console.error("Onboarding Error", error);
        onComplete(data); // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex items-center justify-center p-6">
      
      {/* Cancel Button */}
      <button onClick={onCancel} className="absolute top-6 right-6 text-sm font-medium text-neutral-400 hover:text-neutral-900">
        Exit
      </button>

      <div className="w-full max-w-2xl">
        
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-3 mb-12">
            {['apikey', 'personal', 'education', 'experience', 'skills'].map((s, i) => {
                const steps = ['apikey', 'personal', 'education', 'experience', 'skills', 'processing'];
                const currentIndex = steps.indexOf(step);
                const thisIndex = steps.indexOf(s);
                const isCompleted = currentIndex > thisIndex;
                const isCurrent = currentIndex === thisIndex;

                return (
                    <div key={s} className={`h-2 rounded-full transition-all duration-500 ${isCurrent ? 'w-12 bg-neutral-900' : isCompleted ? 'w-12 bg-neutral-900' : 'w-3 bg-neutral-200'}`} />
                );
            })}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {step === 'apikey' && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Key className="w-8 h-8 text-neutral-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Activate Intelligence</h2>
                        <p className="text-neutral-500">Enter your Gemini API Key to enable AI features.</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                         <Input 
                            label="Gemini API Key" 
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            autoFocus
                        />
                        <p className="text-xs text-neutral-500 mt-3">
                            Your key is stored locally on your device. We do not send it to any server other than Google's API. 
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-neutral-900 font-medium ml-1 underline">Get a key here</a>.
                        </p>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <Button onClick={handleSaveKey} className="w-full md:w-auto px-8" disabled={!apiKey && !process.env.API_KEY}>
                             {apiKey ? 'Save & Continue' : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 'personal' && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-8 h-8 text-neutral-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Let's start with the basics</h2>
                        <p className="text-neutral-500">Who is this resume for?</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Full Name" value={data.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="e.g. Alex Smith" autoFocus />
                        <Input label="Target Job Title" value={data.personalInfo.jobTitle} onChange={e => updatePersonal('jobTitle', e.target.value)} placeholder="e.g. Product Manager" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Email" value={data.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="alex@example.com" />
                        <Input label="Location" value={data.personalInfo.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="City, Country" />
                    </div>
                    <div className="pt-6 flex justify-between items-center">
                         <Button variant="ghost" onClick={() => setStep('apikey')}>Back</Button>
                        <Button onClick={() => setStep('education')} className="w-full md:w-auto px-8" disabled={!data.personalInfo.fullName}>
                            Next Step <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 'education' && (
                <div className="space-y-6">
                     <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <GraduationCap className="w-8 h-8 text-neutral-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Where did you study?</h2>
                        <p className="text-neutral-500">Add your most recent education.</p>
                    </div>
                    <Input label="School / University" value={tempEdu.institution} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})} placeholder="e.g. Stanford University" autoFocus />
                    <Input label="Degree / Certification" value={tempEdu.degree} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})} placeholder="e.g. Bachelor's in Computer Science" />
                    
                    <div className="pt-6 flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep('personal')}>Back</Button>
                        <Button onClick={() => setStep('experience')} className="w-full md:w-auto px-8">
                           {tempEdu.institution ? 'Next Step' : 'Skip Education'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 'experience' && (
                <div className="space-y-6">
                     <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-8 h-8 text-neutral-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Tell us about your work</h2>
                        <p className="text-neutral-500">Describe your most recent role.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Company" value={tempJob.company} onChange={e => setTempJob({...tempJob, company: e.target.value})} placeholder="e.g. Google" autoFocus />
                        <Input label="Job Title" value={tempJob.position} onChange={e => setTempJob({...tempJob, position: e.target.value})} placeholder="e.g. Senior Developer" />
                    </div>
                    <TextArea label="What did you do there?" value={tempJob.description} onChange={e => setTempJob({...tempJob, description: e.target.value})} placeholder="Briefly describe your responsibilities..." className="min-h-[120px]" />

                    <div className="pt-6 flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep('education')}>Back</Button>
                        <Button onClick={() => setStep('skills')} className="w-full md:w-auto px-8">
                             {tempJob.company ? 'Next Step' : 'Skip Experience'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

             {step === 'skills' && (
                <div className="space-y-6">
                     <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-neutral-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Highlight your skills</h2>
                        <p className="text-neutral-500">Type a skill and press Enter to add it.</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                         <Input 
                            label="" 
                            placeholder="e.g. Leadership, Python, Marketing... (Press Enter)" 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim();
                                    if (val && !data.skills.includes(val)) {
                                        setData(prev => ({ ...prev, skills: [...prev.skills, val] }));
                                        e.currentTarget.value = '';
                                    }
                                }
                            }}
                            autoFocus
                        />
                        <div className="flex flex-wrap gap-2 mt-4 min-h-[60px]">
                            {data.skills.map(skill => (
                                <span key={skill} className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm font-medium flex items-center gap-2 animate-in zoom-in duration-200">
                                    {skill}
                                </span>
                            ))}
                            {data.skills.length === 0 && <span className="text-neutral-400 text-sm italic mt-2">Skills will appear here...</span>}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep('experience')}>Back</Button>
                        <Button onClick={handleFinalize} className="w-full md:w-auto px-10 py-4 text-base shadow-xl shadow-neutral-900/10">
                            Build My Resume <Sparkles className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                <div className="text-center space-y-8 py-12">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-neutral-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-neutral-900 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <Sparkles className="w-8 h-8 text-neutral-900 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">AI is building your resume</h3>
                        <p className="text-neutral-500 animate-pulse">{loadingMsg}</p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
