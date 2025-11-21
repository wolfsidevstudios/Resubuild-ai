
import React, { useState, useEffect } from 'react';
import { X, Linkedin, ArrowRight, Loader2, CheckCircle2, AlertCircle, ScanLine, Sparkles } from 'lucide-react';
import { generateResumeFromLinkedIn } from '../services/geminiService';
import { ResumeData } from '../types';
import { Button } from './Button';
import { Input } from './InputField';

interface LinkedInAgentProps {
    onClose?: () => void; // Optional in full-screen mode
    onSave: (resume: ResumeData) => void;
}

type AgentState = 'idle' | 'scanning' | 'analyzing' | 'generating' | 'complete' | 'error';

export const LinkedInAgent: React.FC<LinkedInAgentProps> = ({ onClose, onSave }) => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<AgentState>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);

    const handleTransform = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes('linkedin.com/in/')) {
            setErrorMsg('Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/yourname)');
            return;
        }
        
        setStatus('scanning');
        setErrorMsg('');
        
        // Simulated Progress Animation
        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 5) + 1;
            if (p > 90) clearInterval(interval);
            else setProgress(p);
        }, 200);

        try {
            // Step 1: Simulate Scanning
            await new Promise(r => setTimeout(r, 1500));
            setStatus('analyzing');
            
            // Step 2: Call AI Service
            const resume = await generateResumeFromLinkedIn(url);
            
            clearInterval(interval);
            setProgress(100);
            setStatus('complete');
            setGeneratedResume(resume);

        } catch (err) {
            clearInterval(interval);
            setStatus('error');
            setErrorMsg('Failed to process profile. Please check your API Key or try again.');
        }
    };

    const handleFinish = () => {
        if (generatedResume) {
            onSave(generatedResume);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-neutral-50/50">
            
            {/* Background Decoration */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-200 flex flex-col relative animate-in zoom-in-95 duration-300">
                
                {/* Header Graphic */}
                <div className="h-48 bg-[#0077b5] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center rotate-3">
                        <Linkedin className="w-12 h-12 text-[#0077b5]" />
                    </div>
                    <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">
                        <Sparkles className="w-3 h-3" /> Powered by Gemini 3.0 Pro
                    </div>
                    
                    {/* Scanning Effect */}
                    {status === 'scanning' && (
                         <div className="absolute inset-0 bg-white/10 animate-pulse">
                             <div className="w-full h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.8)] absolute top-0 animate-scan"></div>
                         </div>
                    )}
                </div>

                <div className="p-10 md:p-16 text-center">
                    {status === 'idle' && (
                        <form onSubmit={handleTransform} className="space-y-8 max-w-lg mx-auto">
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-3">LinkedIn to Resume Agent</h2>
                                <p className="text-neutral-500 text-lg">
                                    Paste your LinkedIn profile URL. Our specialized agent will scan your public info, infer missing details, and craft a polished resume.
                                </p>
                            </div>
                            
                            <div className="text-left">
                                <Input 
                                    label="LinkedIn Profile URL" 
                                    value={url} 
                                    onChange={e => setUrl(e.target.value)} 
                                    placeholder="https://www.linkedin.com/in/johndoe"
                                    className="text-lg py-4"
                                />
                                {errorMsg && (
                                    <p className="text-red-500 text-sm mt-3 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-[#0077b5]/20 bg-[#0077b5] hover:bg-[#006097] rounded-xl">
                                Transform Profile <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    )}

                    {(status === 'scanning' || status === 'analyzing' || status === 'generating') && (
                        <div className="py-12 space-y-8">
                            <div className="relative w-32 h-32 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="#e5e5e5" strokeWidth="8" fill="none" />
                                    <circle 
                                        cx="64" cy="64" r="60" 
                                        stroke="#0077b5" strokeWidth="8" fill="none" 
                                        strokeDasharray="377" 
                                        strokeDashoffset={377 - (377 * progress) / 100}
                                        className="transition-all duration-300 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-3xl text-[#0077b5]">
                                    {progress}%
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold text-neutral-900 animate-pulse mb-2">
                                    {status === 'scanning' && 'Scanning Profile Structure...'}
                                    {status === 'analyzing' && 'Reasoning over Experience...'}
                                    {status === 'generating' && 'Formatting Final Document...'}
                                </h3>
                                <p className="text-neutral-500">
                                    Using Gemini 3.0 Pro to analyze career history and skills.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'complete' && (
                         <div className="py-8 space-y-8 animate-in zoom-in-95">
                             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-lg">
                                 <CheckCircle2 className="w-12 h-12" />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-bold text-neutral-900 mb-3">Transformation Complete!</h2>
                                 <p className="text-neutral-500 text-lg">
                                     We've successfully converted your profile into a professional resume format using our advanced reasoning model.
                                 </p>
                             </div>
                             <Button onClick={handleFinish} className="w-full max-w-md mx-auto py-5 text-lg shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700 border-none rounded-xl">
                                 Open in Editor <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="py-8 space-y-8">
                             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-lg">
                                 <X className="w-12 h-12" />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-bold text-neutral-900 mb-3">Extraction Failed</h2>
                                 <p className="text-neutral-500 text-lg">
                                     {errorMsg || "We couldn't access this profile. Please try again or check the URL."}
                                 </p>
                             </div>
                             <Button onClick={() => setStatus('idle')} variant="secondary" className="w-full max-w-md mx-auto py-4">
                                 Try Again
                             </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
