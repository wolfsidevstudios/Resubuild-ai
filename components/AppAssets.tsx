
import React from 'react';
import { Sparkles, Zap, ArrowUp, Search, Bot, User, Layout, CheckCircle2, PenTool, Download, Share, Bell, Menu, Globe, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { createEmptyResume } from '../services/storageService';

export const AppAssets: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  
  // Common wrapper for a Desktop Browser Window (Aspect Ratio 16:10 roughly)
  // Target resolution for screenshots: ~1280x800 or similar scaled down
  const DesktopWrapper: React.FC<{ title: string; subtitle: string; bg?: string; url?: string; children: React.ReactNode }> = ({ title, subtitle, bg = "bg-neutral-100", url = "kyndra.ai/app", children }) => (
    <div className="flex flex-col gap-6 items-center">
        <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-neutral-900 mb-2">{title}</h2>
            <p className="text-xl text-neutral-500">{subtitle}</p>
        </div>

        <div className={`w-[1000px] h-[625px] ${bg} border border-neutral-200 shadow-2xl rounded-xl overflow-hidden relative flex flex-col flex-shrink-0 select-none ring-1 ring-black/5`}>
            {/* Browser Chrome / Header */}
            <div className="h-10 bg-white border-b border-neutral-200 flex items-center px-4 gap-4 z-20">
                {/* Traffic Lights */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/20"></div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex gap-2 text-neutral-400">
                    <ChevronLeft className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4 opacity-50" />
                </div>

                {/* Address Bar */}
                <div className="flex-1 max-w-2xl bg-neutral-100 rounded-md h-7 flex items-center justify-center text-xs text-neutral-500 font-medium relative">
                     <div className="absolute left-2">
                         <Globe className="w-3 h-3" />
                     </div>
                     https://{url}
                </div>
                
                {/* Window Controls */}
                <div className="flex gap-3 text-neutral-400">
                    <Share className="w-4 h-4" />
                    <Menu className="w-4 h-4" />
                </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 relative z-10 overflow-hidden font-sans">
                {children}
            </div>
        </div>
        
        <div className="text-center mb-12">
             <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2 py-1 rounded">1000 x 625 px</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-12 font-sans">
        <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-16">
                <div>
                    <h1 className="text-5xl font-bold mb-4 text-neutral-900">Kyndra Workspace Assets</h1>
                    <p className="text-xl text-neutral-500">High-fidelity desktop screenshots for marketing and App Store listings.</p>
                </div>
                <button onClick={onHome} className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Back to App
                </button>
            </div>

            <div className="flex flex-col items-center gap-24 pb-24">
                
                {/* SCREEN 1: VIBE CREATE (Desktop) */}
                <DesktopWrapper 
                    title="Vibe Create" 
                    subtitle="Transform natural language into structured documents instantly."
                    url="kyndra.ai/create"
                    bg="bg-white"
                >
                    <div className="absolute inset-0 flex items-center justify-center relative overflow-hidden">
                        {/* Animated Blobs Background */}
                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl"></div>

                        <div className="relative z-10 w-full max-w-3xl text-center">
                             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-bold mb-8 shadow-xl">
                                <Sparkles className="w-4 h-4" /> Kyndra AI
                            </div>
                            <h1 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">What do you want to create?</h1>
                            <p className="text-lg text-neutral-500 mb-10 max-w-xl mx-auto">Describe your role, lesson, or task. We'll handle the structure.</p>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur opacity-20"></div>
                                <div className="bg-white rounded-[2rem] shadow-2xl border border-neutral-200 p-8 min-h-[200px] text-left relative">
                                    <p className="text-2xl text-neutral-800 font-medium leading-relaxed">
                                        I'm a <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded">Senior Product Designer</span> with 7 years of experience. 
                                        I specialize in <span className="text-purple-600 font-bold bg-purple-50 px-1 rounded">Design Systems</span> and UX Research. 
                                        Previously worked at Fintech startups...
                                    </p>
                                    <div className="absolute bottom-6 right-6 w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <ArrowUp className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 mt-8 opacity-60">
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">History Lesson Plan</div>
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">Marketing Lead Resume</div>
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">Biology Quiz</div>
                            </div>
                        </div>
                    </div>
                </DesktopWrapper>

            </div>
        </div>
    </div>
  );
};
