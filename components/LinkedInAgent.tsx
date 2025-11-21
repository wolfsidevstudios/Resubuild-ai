
import React, { useState, useEffect } from 'react';
import { X, Linkedin, ArrowRight, Loader2, CheckCircle2, AlertCircle, ScanLine } from 'lucide-react';
import { generateResumeFromLinkedIn } from '../services/geminiService';
import { ResumeData } from '../types';
import { Button } from './Button';
import { Input } from './InputField';

interface LinkedInAgentProps {
    onClose: () => void;
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
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-200 flex flex-col relative animate-in zoom-in-95 duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-neutral-400" />
                </button>

                {/* Header Graphic */}
                <div className="h-40 bg-[#0077b5] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-3">
                        <Linkedin className="w-10 h-10 text-[#0077b5]" />
                    </div>
                    
                    {/* Scanning Effect */}
                    {status === 'scanning' && (
                         <div className="absolute inset-0 bg-white/10 animate-pulse">
                             <div className="w-full h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.8)] absolute top-0 animate-scan"></div>
                         </div>
                    )}
                </div>

                <div className="p-8 md:p-10 text-center">
                    {status === 'idle' && (
                        <form onSubmit={handleTransform} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 mb-2">LinkedIn to Resume</h2>
                                <p className="text-neutral-500 text-sm">
                                    Paste your LinkedIn profile URL. Our AI agent will scan your public info and craft a polished resume instantly.
                                </p>
                            </div>
                            
                            <div className="text-left">
                                <Input 
                                    label="LinkedIn Profile URL" 
                                    value={url} 
                                    onChange={e => setUrl(e.target.value)} 
                                    placeholder="https://www.linkedin.com/in/johndoe"
                                    className="text-lg"
                                />
                                {errorMsg && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errorMsg}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full py-4 text-lg shadow-xl shadow-[#0077b5]/20 bg-[#0077b5] hover:bg-[#006097]">
                                Transform Profile <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    )}

                    {(status === 'scanning' || status === 'analyzing' || status === 'generating') && (
                        <div className="py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="44" stroke="#e5e5e5" strokeWidth="8" fill="none" />
                                    <circle 
                                        cx="48" cy="48" r="44" 
                                        stroke="#0077b5" strokeWidth="8" fill="none" 
                                        strokeDasharray="276" 
                                        strokeDashoffset={276 - (276 * progress) / 100}
                                        className="transition-all duration-300 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#0077b5]">
                                    {progress}%
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 animate-pulse">
                                    {status === 'scanning' && 'Scanning Profile...'}
                                    {status === 'analyzing' && 'Extracting Experience...'}
                                    {status === 'generating' && 'Formatting Resume...'}
                                </h3>
                                <p className="text-neutral-500 text-sm mt-2">AI is translating your profile data</p>
                            </div>
                        </div>
                    )}

                    {status === 'complete' && (
                         <div className="py-6 space-y-6 animate-in zoom-in-95">
                             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                 <CheckCircle2 className="w-10 h-10" />
                             </div>
                             <div>
                                 <h2 className="text-2xl font-bold text-neutral-900">Resume Ready!</h2>
                                 <p className="text-neutral-500 text-sm mt-2">
                                     We've successfully converted your profile into a professional resume format.
                                 </p>
                             </div>
                             <Button onClick={handleFinish} className="w-full py-4 text-lg shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700 border-none">
                                 Open Editor <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="py-6 space-y-6">
                             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                                 <X className="w-10 h-10" />
                             </div>
                             <div>
                                 <h2 className="text-2xl font-bold text-neutral-900">Extraction Failed</h2>
                                 <p className="text-neutral-500 text-sm mt-2">
                                     {errorMsg || "We couldn't access this profile. Please try again or check the URL."}
                                 </p>
                             </div>
                             <Button onClick={() => setStatus('idle')} variant="secondary" className="w-full py-3">
                                 Try Again
                             </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
