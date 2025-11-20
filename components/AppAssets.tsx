
import React from 'react';
import { Sparkles, Zap, ArrowUp, Search, Bot, User, Layout, CheckCircle2, PenTool, Download, Share, Bell, Menu, Globe, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { createEmptyResume } from '../services/storageService';

export const AppAssets: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  
  // Common wrapper for a Desktop Browser Window (Aspect Ratio 16:10 roughly)
  // Target resolution for screenshots: ~1280x800 or similar scaled down
  const DesktopWrapper: React.FC<{ title: string; subtitle: string; bg?: string; url?: string; children: React.ReactNode }> = ({ title, subtitle, bg = "bg-neutral-100", url = "resubuild.com/app", children }) => (
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
                    <h1 className="text-5xl font-bold mb-4 text-neutral-900">Desktop App Assets</h1>
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
                    subtitle="Transform natural language into a structured resume instantly."
                    url="resubuild.com/create"
                    bg="bg-white"
                >
                    <div className="absolute inset-0 flex items-center justify-center relative overflow-hidden">
                        {/* Animated Blobs Background */}
                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl"></div>

                        <div className="relative z-10 w-full max-w-3xl text-center">
                             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-bold mb-8 shadow-xl">
                                <Sparkles className="w-4 h-4" /> Resupilot AI
                            </div>
                            <h1 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">What do you want to create?</h1>
                            <p className="text-lg text-neutral-500 mb-10 max-w-xl mx-auto">Describe your role or paste your LinkedIn bio. We'll handle the formatting.</p>

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
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">Software Engineer</div>
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">Marketing Lead</div>
                                <div className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-500">Registered Nurse</div>
                            </div>
                        </div>
                    </div>
                </DesktopWrapper>


                {/* SCREEN 2: AI WORKSPACE (Desktop Split) */}
                <DesktopWrapper 
                    title="AI Co-Pilot Workspace" 
                    subtitle="A split-screen editor where you chat with AI to refine your resume in real-time."
                    url="resubuild.com/workspace"
                >
                     <div className="flex h-full">
                        {/* Sidebar: Chat */}
                        <div className="w-1/3 bg-white border-r border-neutral-200 flex flex-col">
                            <div className="h-14 border-b border-neutral-100 flex items-center px-6 font-bold gap-2 text-neutral-900">
                                <Bot className="w-5 h-5 text-blue-600" /> AI Assistant
                            </div>
                            <div className="flex-1 p-6 space-y-6 bg-neutral-50/30">
                                {/* AI Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Sparkles className="w-4 h-4"/></div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-neutral-200 text-sm text-neutral-600 shadow-sm">
                                        I've drafted your summary. It focuses on your leadership in Fintech. Shall I add your technical skills next?
                                    </div>
                                </div>
                                {/* User Message */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white shrink-0"><User className="w-4 h-4"/></div>
                                    <div className="bg-neutral-900 p-4 rounded-2xl rounded-tr-none text-sm text-white shadow-sm">
                                        Yes, please add Figma, React, and User Testing. Also, make the summary more punchy.
                                    </div>
                                </div>
                                {/* AI Typing */}
                                <div className="flex gap-3">
                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Sparkles className="w-4 h-4"/></div>
                                     <div className="bg-neutral-200/50 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-10 w-16">
                                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                                     </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-neutral-200 bg-white">
                                <div className="relative">
                                    <input className="w-full pl-4 pr-10 py-3 bg-neutral-100 rounded-full text-sm" placeholder="Ask AI to make changes..." />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center text-white"><ArrowUp className="w-3 h-3"/></div>
                                </div>
                            </div>
                        </div>

                        {/* Main: Resume Preview */}
                        <div className="flex-1 bg-neutral-100 p-10 overflow-hidden flex justify-center relative">
                            {/* Toolbar */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-1 py-1 rounded-full shadow-xl flex items-center gap-1 z-20">
                                <div className="px-4 py-1.5 bg-neutral-800 rounded-full text-xs font-bold flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-yellow-400" /> Fix Grammar
                                </div>
                                <div className="w-px h-3 bg-neutral-700 mx-1"></div>
                                <div className="px-3 py-1.5 text-xs font-medium text-neutral-300">Tone Polish</div>
                            </div>

                            <div className="w-[210mm] bg-white shadow-2xl h-[800px] transform scale-[0.8] origin-top rounded-sm p-12 text-xs">
                                {/* Mock Resume Content */}
                                <div className="flex justify-between items-end border-b-2 border-neutral-900 pb-6 mb-8">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-1">Alex Morgan</h1>
                                        <p className="text-neutral-500 text-lg">Senior Product Designer</p>
                                    </div>
                                    <div className="text-right space-y-1 text-neutral-500">
                                        <div>alex@example.com</div>
                                        <div>San Francisco, CA</div>
                                    </div>
                                </div>
                                <div className="space-y-6 max-w-2xl">
                                    <div className="p-4 -ml-4 rounded-lg bg-blue-50 border border-blue-100 relative group">
                                        <div className="absolute -right-2 -top-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Updated</div>
                                        <h3 className="font-bold uppercase text-neutral-400 tracking-wider text-[10px] mb-2">Summary</h3>
                                        <p className="leading-relaxed text-neutral-800 text-sm">
                                            Award-winning Product Designer with 7+ years of experience leading design systems for high-growth Fintech startups. 
                                            Proven track record of reducing churn by 15% through UX optimization. Expert in translating complex data into intuitive interfaces.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold uppercase text-neutral-400 tracking-wider text-[10px] mb-4">Experience</h3>
                                        <div className="mb-4">
                                            <div className="flex justify-between font-bold text-base mb-1">
                                                <span>Lead Designer</span>
                                                <span>2020 - Present</span>
                                            </div>
                                            <div className="text-neutral-500 mb-2">Stripe • Remote</div>
                                            <ul className="space-y-1 text-neutral-600 list-disc ml-4">
                                                <li>Spearheaded the redesign of the merchant dashboard, increasing engagement by 25%.</li>
                                                <li>Managed a team of 4 junior designers and established the global design system.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </DesktopWrapper>


                {/* SCREEN 3: SMART AUDIT (Desktop Overlay) */}
                <DesktopWrapper 
                    title="Smart Audit" 
                    subtitle="Real-time content analysis with scoring and actionable improvements."
                    url="resubuild.com/audit"
                >
                    <div className="absolute inset-0 bg-neutral-50 flex">
                        {/* Blurry Resume Background */}
                        <div className="flex-1 p-12 filter blur-[2px] opacity-50 pointer-events-none select-none">
                             <div className="w-full h-full bg-white shadow-lg border border-neutral-200"></div>
                        </div>

                        {/* Audit Modal Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white w-[600px] rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                                    <div className="flex items-center gap-2 font-bold text-lg">
                                        <Target className="w-5 h-5 text-neutral-900" /> AI Resume Audit
                                    </div>
                                    <div className="w-8 h-8 bg-white rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400">×</div>
                                </div>
                                
                                <div className="p-8 flex gap-8">
                                    {/* Score Circle */}
                                    <div className="w-40 shrink-0 text-center">
                                        <div className="relative w-32 h-32 mx-auto mb-4">
                                             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-neutral-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <path className="text-green-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-bold text-neutral-900">92</span>
                                                <span className="text-xs font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1">Excellent</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold">Fix Issues</button>
                                    </div>

                                    {/* Checklist */}
                                    <div className="flex-1 space-y-4">
                                        <h4 className="font-bold text-sm text-neutral-500 uppercase tracking-wider mb-2">Analysis Report</h4>
                                        
                                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex gap-3">
                                            <div className="mt-0.5 text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
                                            <div>
                                                <div className="font-bold text-neutral-900 text-sm">Strong Impact</div>
                                                <p className="text-xs text-neutral-600">Great job quantifying results in your experience section.</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex gap-3">
                                            <div className="mt-0.5 text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
                                            <div>
                                                <div className="font-bold text-neutral-900 text-sm">ATS Optimized</div>
                                                <p className="text-xs text-neutral-600">Layout is fully readable by automated systems.</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 opacity-80">
                                            <div className="mt-0.5 text-red-600"><CheckCircle2 className="w-5 h-5" /></div>
                                            <div>
                                                <div className="font-bold text-neutral-900 text-sm">Keyword Gap</div>
                                                <p className="text-xs text-neutral-600">Consider adding "Agile Methodology" to skills.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DesktopWrapper>

                {/* SCREEN 4: TEMPLATES (Grid) */}
                <DesktopWrapper 
                    title="Professional Templates" 
                    subtitle="Choose from a gallery of designs tailored for every industry."
                    url="resubuild.com/templates"
                >
                    <div className="absolute inset-0 bg-neutral-50 p-10 flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-8 w-full max-w-4xl h-full items-center">
                            
                            {/* Template 1 */}
                            <div className="group relative h-[400px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-neutral-200 overflow-hidden">
                                <div className="h-32 bg-neutral-900 p-6 flex items-end">
                                    <div className="w-16 h-16 bg-white rounded-full border-4 border-neutral-900"></div>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="h-6 w-3/4 bg-neutral-200 rounded"></div>
                                    <div className="h-4 w-1/2 bg-neutral-100 rounded"></div>
                                    <div className="h-20"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                        <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-white border-t border-neutral-100 flex justify-between items-center">
                                    <span className="font-bold text-sm">Modern</span>
                                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                </div>
                            </div>

                             {/* Template 2 (Active) */}
                             <div className="group relative h-[440px] bg-white rounded-xl shadow-2xl ring-4 ring-neutral-900/5 transform scale-105 border border-neutral-200 overflow-hidden z-10">
                                <div className="h-full p-8 flex flex-col text-center items-center">
                                     <div className="w-20 h-20 rounded-full bg-neutral-100 mb-6"></div>
                                     <div className="h-6 w-48 bg-neutral-800 rounded mb-2"></div>
                                     <div className="h-4 w-32 bg-neutral-300 rounded mb-8"></div>
                                     <div className="w-full space-y-4">
                                         <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                         <div className="h-2 w-5/6 bg-neutral-100 rounded"></div>
                                         <div className="h-2 w-4/5 bg-neutral-100 rounded"></div>
                                     </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Popular
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-white border-t border-neutral-100 flex justify-between items-center">
                                    <span className="font-bold text-sm">Minimal</span>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-4 rounded-full bg-neutral-900"></div>
                                        <div className="w-4 h-4 rounded-full bg-neutral-300"></div>
                                    </div>
                                </div>
                            </div>

                             {/* Template 3 */}
                             <div className="group relative h-[400px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-neutral-200 overflow-hidden flex">
                                <div className="w-1/3 bg-neutral-800 h-full p-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full mb-6"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-white/10 rounded"></div>
                                        <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="w-2/3 p-4 space-y-3">
                                    <div className="h-6 w-full bg-neutral-200 rounded mb-4"></div>
                                    <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                    <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-white border-t border-neutral-100 flex justify-between items-center pl-[35%]">
                                    <span className="font-bold text-sm">Creative</span>
                                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </DesktopWrapper>

                {/* SCREEN 5: DISCOVER (Desktop Grid) */}
                <DesktopWrapper 
                    title="Employer Dashboard" 
                    subtitle="Employers can browse verified profiles and use AI to match candidates."
                    url="resubuild.com/hiring"
                >
                     <div className="flex h-full bg-neutral-50">
                         {/* Sidebar */}
                         <div className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col gap-6">
                             <div className="font-bold text-lg flex items-center gap-2"><Bot className="w-6 h-6" /> Hiring AI</div>
                             <div className="space-y-1">
                                 <div className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg font-medium text-sm">Discover Talent</div>
                                 <div className="px-4 py-2 text-neutral-500 rounded-lg font-medium text-sm">Saved Candidates</div>
                                 <div className="px-4 py-2 text-neutral-500 rounded-lg font-medium text-sm">Messages</div>
                             </div>
                             <div className="mt-auto p-4 bg-blue-50 rounded-xl border border-blue-100">
                                 <div className="text-xs font-bold text-blue-800 mb-1">AI Recruiter</div>
                                 <p className="text-xs text-blue-600">"I found 3 new matches for your React role."</p>
                             </div>
                         </div>

                         {/* Content */}
                         <div className="flex-1 p-8 overflow-hidden">
                             <div className="flex justify-between items-center mb-8">
                                 <h2 className="text-2xl font-bold">Top Candidates</h2>
                                 <div className="flex gap-2">
                                     <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-bold">Filter</button>
                                     <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold">Post Job</button>
                                 </div>
                             </div>

                             <div className="grid grid-cols-3 gap-6">
                                 {/* Candidate Card 1 */}
                                 <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-lg">AM</div>
                                         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">98% Match</span>
                                     </div>
                                     <div className="mb-4">
                                         <h3 className="font-bold text-lg">Alex Morgan</h3>
                                         <p className="text-neutral-500 text-sm">Product Designer • Ex-Stripe</p>
                                     </div>
                                     <div className="flex flex-wrap gap-2 mb-4">
                                         <span className="bg-neutral-50 border border-neutral-100 px-2 py-1 rounded text-xs font-medium">Figma</span>
                                         <span className="bg-neutral-50 border border-neutral-100 px-2 py-1 rounded text-xs font-medium">React</span>
                                     </div>
                                     <button className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold">View Profile</button>
                                 </div>

                                 {/* Candidate Card 2 */}
                                 <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">JD</div>
                                         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">95% Match</span>
                                     </div>
                                     <div className="mb-4">
                                         <h3 className="font-bold text-lg">John Doe</h3>
                                         <p className="text-neutral-500 text-sm">Senior Frontend Eng</p>
                                     </div>
                                     <div className="flex flex-wrap gap-2 mb-4">
                                         <span className="bg-neutral-50 border border-neutral-100 px-2 py-1 rounded text-xs font-medium">TypeScript</span>
                                         <span className="bg-neutral-50 border border-neutral-100 px-2 py-1 rounded text-xs font-medium">Node</span>
                                     </div>
                                     <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm font-bold">View Profile</button>
                                 </div>

                                 {/* Candidate Card 3 */}
                                 <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all opacity-60">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">SK</div>
                                         <span className="bg-neutral-100 text-neutral-500 text-xs font-bold px-2 py-1 rounded-full">80% Match</span>
                                     </div>
                                     <div className="mb-4">
                                         <h3 className="font-bold text-lg">Sarah Kim</h3>
                                         <p className="text-neutral-500 text-sm">UX Researcher</p>
                                     </div>
                                     <div className="flex flex-wrap gap-2 mb-4">
                                         <span className="bg-neutral-50 border border-neutral-100 px-2 py-1 rounded text-xs font-medium">Research</span>
                                     </div>
                                     <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm font-bold">View Profile</button>
                                 </div>
                             </div>
                         </div>
                     </div>
                </DesktopWrapper>

            </div>
        </div>
    </div>
  );
};
