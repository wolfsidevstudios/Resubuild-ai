
import React from 'react';
import { Sparkles, MessageSquare, Target, Layout, CheckCircle2, Zap, ArrowUp, Search } from 'lucide-react';
import { ResumePreview } from './ResumePreview';
import { createEmptyResume } from '../services/storageService';

export const AppAssets: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  // Mock Data for previews
  const mockResume = createEmptyResume('modern');
  mockResume.personalInfo.fullName = "Alex Morgan";
  mockResume.personalInfo.jobTitle = "Product Designer";
  mockResume.personalInfo.summary = "Creative designer with 5+ years experience building user-centric digital products.";

  // Common wrapper for a phone screen (Aspect Ratio ~19.5:9)
  const ScreenWrapper: React.FC<{ title: string; subtitle: string; bg?: string; children: React.ReactNode }> = ({ title, subtitle, bg = "bg-white", children }) => (
    <div className="flex flex-col gap-4">
        <div className={`w-[375px] h-[812px] ${bg} border border-neutral-200 shadow-2xl rounded-[3rem] overflow-hidden relative flex flex-col flex-shrink-0 select-none`}>
            {/* Status Bar Area */}
            <div className="h-12 w-full flex justify-between items-center px-6 pt-2 z-20">
                <span className="text-xs font-bold text-neutral-900">9:41</span>
                <div className="flex gap-1.5">
                    <div className="w-4 h-2.5 bg-neutral-900 rounded-[1px]"></div>
                    <div className="w-3 h-2.5 bg-neutral-900 rounded-[1px]"></div>
                </div>
            </div>

            {/* Marketing Copy */}
            <div className="px-6 pt-4 pb-8 z-20 relative">
                <h2 className="text-3xl font-bold text-neutral-900 leading-tight tracking-tight mb-2">{title}</h2>
                <p className="text-lg text-neutral-500 font-medium leading-snug">{subtitle}</p>
            </div>

            {/* Screen Content */}
            <div className="flex-1 relative z-10">
                {children}
            </div>
            
            {/* Bottom Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-900 rounded-full z-30 opacity-20"></div>
        </div>
        <div className="text-center">
            <button 
                onClick={() => {
                    // Create a simplistic download trigger logic or instructions
                    alert("To save: Use your system screenshot tool (Cmd+Shift+4 on Mac) to capture the screen area.");
                }}
                className="text-xs text-neutral-400 hover:text-neutral-900"
            >
                Download Concept
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 p-12 font-sans">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">App Store Assets</h1>
                    <p className="text-neutral-500">Screenshots designed for 6.5" Display (iPhone 14 Pro Max). Screenshot these to use.</p>
                </div>
                <button onClick={onHome} className="px-6 py-3 bg-white rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                    Back to App
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-12 pb-24">
                
                {/* SCREEN 1: VIBE CREATE */}
                <ScreenWrapper 
                    title="Just Type." 
                    subtitle="Turn a simple text prompt into a full resume instantly."
                >
                    <div className="absolute inset-0 bg-neutral-50 flex flex-col items-center pt-10">
                        <div className="w-[90%] bg-white rounded-[2rem] p-6 shadow-xl border border-neutral-100 relative">
                            <div className="flex items-center gap-2 mb-4 text-blue-600 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" /> Vibe Create
                            </div>
                            <p className="text-xl font-medium text-neutral-900 leading-relaxed">
                                "I'm a Product Designer with 5 years experience in Fintech. I use Figma and React..."
                            </p>
                            <div className="h-20"></div>
                            <div className="absolute bottom-4 right-4 w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-lg">
                                <ArrowUp className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Abstract flowing resume behind */}
                        <div className="w-[85%] mt-[-20px] bg-neutral-200 rounded-t-3xl h-full transform scale-90 opacity-50 z-[-1]"></div>
                    </div>
                </ScreenWrapper>

                {/* SCREEN 2: AI EDITING */}
                <ScreenWrapper 
                    title="AI Co-Pilot." 
                    subtitle="Chat with your resume to edit content and fix grammar."
                >
                     <div className="absolute inset-0 bg-white flex flex-col">
                        {/* Chat UI Top */}
                        <div className="h-1/2 bg-neutral-50 border-b border-neutral-200 p-6 flex flex-col justify-end space-y-4 pb-12">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Sparkles className="w-4 h-4"/></div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-neutral-200 text-sm text-neutral-600 shadow-sm">
                                    I've rewritten your summary to be more punchy.
                                </div>
                            </div>
                             <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white shrink-0">You</div>
                                <div className="bg-neutral-900 p-3 rounded-2xl rounded-tr-none text-sm text-white shadow-sm">
                                    Make it shorter.
                                </div>
                            </div>
                        </div>
                        {/* Resume Preview Bottom */}
                        <div className="flex-1 bg-neutral-100 p-6 overflow-hidden relative">
                             <div className="w-full bg-white shadow-xl rounded-t-xl h-full p-6 transform scale-100 origin-top">
                                 <div className="w-16 h-16 bg-neutral-100 rounded-full mb-4"></div>
                                 <div className="h-6 w-3/4 bg-neutral-900 rounded mb-2"></div>
                                 <div className="h-4 w-1/2 bg-neutral-300 rounded mb-6"></div>
                                 <div className="space-y-2">
                                     <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                     <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                     <div className="h-2 w-5/6 bg-neutral-100 rounded"></div>
                                 </div>
                             </div>
                             {/* Floating Action */}
                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                                 <Zap className="w-4 h-4 text-yellow-400" /> Auto-Fix
                             </div>
                        </div>
                     </div>
                </ScreenWrapper>

                {/* SCREEN 3: SMART AUDIT */}
                <ScreenWrapper 
                    title="Beat the ATS." 
                    subtitle="Get a real-time score and actionable improvements."
                >
                    <div className="absolute inset-0 bg-neutral-50 flex flex-col items-center pt-8">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                             {/* Circle Background */}
                             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-neutral-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-green-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold text-neutral-900">92</span>
                                <span className="text-xs font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1">Excellent</span>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="w-full px-6 space-y-3">
                            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex gap-3 items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900">Quantified Impact</h4>
                                    <p className="text-xs text-neutral-500">You used numbers in 80% of bullets.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex gap-3 items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900">Contact Info</h4>
                                    <p className="text-xs text-neutral-500">Email and LinkedIn are present.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex gap-3 items-start opacity-50">
                                <Target className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900">Missing Keywords</h4>
                                    <p className="text-xs text-neutral-500">Add "Agile" to match job description.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScreenWrapper>

                {/* SCREEN 4: TEMPLATES */}
                <ScreenWrapper 
                    title="Stand Out." 
                    subtitle="Modern, Professional, and Creative templates."
                >
                     <div className="absolute inset-0 bg-neutral-100 overflow-hidden">
                        {/* Card Stack Effect */}
                        <div className="relative w-full h-full flex justify-center pt-12">
                            {/* Back Card */}
                            <div className="absolute top-0 w-[240px] h-[340px] bg-white rounded-xl shadow-xl transform -rotate-6 -translate-x-12 opacity-80 border border-neutral-200"></div>
                            {/* Back Card 2 */}
                            <div className="absolute top-4 w-[240px] h-[340px] bg-white rounded-xl shadow-xl transform rotate-6 translate-x-12 opacity-80 border border-neutral-200"></div>
                            
                            {/* Main Card */}
                            <div className="absolute top-8 w-[260px] h-[360px] bg-white rounded-xl shadow-2xl transform z-10 flex flex-col overflow-hidden border border-neutral-200">
                                <div className="h-24 bg-neutral-900 p-4 flex items-end">
                                    <div className="w-12 h-12 bg-white rounded-full"></div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
                                    <div className="h-2 w-1/2 bg-neutral-100 rounded"></div>
                                    <div className="h-20"></div>
                                    <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                    <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <div className="px-3 py-1 bg-neutral-100 rounded text-xs font-bold">Modern</div>
                                </div>
                            </div>

                            {/* Template Selector UI at bottom */}
                            <div className="absolute bottom-0 w-full h-1/3 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-sm">Choose Style</span>
                                    <Layout className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div className="flex gap-4 overflow-x-hidden">
                                    <div className="w-20 h-24 bg-neutral-900 rounded-lg shrink-0 ring-2 ring-offset-2 ring-neutral-900"></div>
                                    <div className="w-20 h-24 bg-neutral-100 rounded-lg shrink-0 border border-neutral-200"></div>
                                    <div className="w-20 h-24 bg-neutral-100 rounded-lg shrink-0 border border-neutral-200"></div>
                                    <div className="w-20 h-24 bg-neutral-100 rounded-lg shrink-0 border border-neutral-200"></div>
                                </div>
                            </div>
                        </div>
                     </div>
                </ScreenWrapper>

                 {/* SCREEN 5: DISCOVER */}
                 <ScreenWrapper 
                    title="Get Hired." 
                    subtitle="Connect with top employers hiring for your skills."
                >
                     <div className="absolute inset-0 bg-white flex flex-col">
                         {/* Search Bar */}
                         <div className="px-6 pt-2 pb-6">
                             <div className="w-full bg-neutral-100 h-12 rounded-full flex items-center px-4 gap-3 text-neutral-400">
                                 <Search className="w-5 h-5" />
                                 <span className="text-sm font-medium">Remote Design Jobs...</span>
                             </div>
                         </div>

                         {/* Matches */}
                         <div className="flex-1 bg-neutral-50 p-6 space-y-4 overflow-hidden">
                             <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Your Matches</h3>
                             
                             {/* Job Card 1 */}
                             <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                                 <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">G</div>
                                 <div className="flex-1">
                                     <div className="font-bold text-neutral-900">Product Designer</div>
                                     <div className="text-xs text-neutral-500">Google • Remote</div>
                                 </div>
                                 <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                     98%
                                 </div>
                             </div>

                              {/* Job Card 2 */}
                             <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                                 <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold">U</div>
                                 <div className="flex-1">
                                     <div className="font-bold text-neutral-900">UX Researcher</div>
                                     <div className="text-xs text-neutral-500">Uber • San Francisco</div>
                                 </div>
                                 <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                     94%
                                 </div>
                             </div>

                              {/* Job Card 3 */}
                              <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4 opacity-50">
                                 <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">L</div>
                                 <div className="flex-1">
                                     <div className="font-bold text-neutral-900">UI Designer</div>
                                     <div className="text-xs text-neutral-500">Linear • Remote</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                </ScreenWrapper>

            </div>
        </div>
    </div>
  );
};
