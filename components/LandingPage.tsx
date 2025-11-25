
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Layout, 
  Download, 
  CheckCircle2, 
  Star,
  X,
  User,
  Target,
  MessageSquare,
  PenTool,
  Search,
  Bot,
  Play,
  ArrowUp,
  ChevronDown,
  Globe2,
  Cloud,
  FlaskConical,
  BrainCircuit,
  Mail,
  Megaphone,
  GraduationCap,
  BookOpen,
  Briefcase,
  Zap,
  MapPin,
  Calendar,
  Calculator,
  Copy,
  FileText,
  GripVertical,
  Settings,
  Palette,
  Share2,
  Code2,
  Cpu,
  MousePointer2,
  Shield,
  Globe,
  FileCode,
  BarChart3,
  Clock,
  Wand2,
  HelpCircle,
  Book
} from 'lucide-react';
import { Button } from './Button';
import { Auth } from './Auth';
import { ResupilotDemo } from './ResupilotDemo';
import { joinWaitlist } from '../services/firebase';

interface LandingPageProps {
  onStart: () => void;
  isAuthenticated: boolean;
  onGoToDiscover?: () => void;
  onGuestTry?: (prompt: string) => void;
  onGoToAssets?: () => void;
  onViewTerms?: () => void;
  onViewPrivacy?: () => void;
  onViewAbout?: () => void;
  onViewResources?: () => void;
}

// --- Helper Components ---

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.1 }); 
        
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- UI Mockups for Features ---

const MockupResumeBuilder = () => (
    <div className="w-full aspect-video bg-white rounded-xl border border-neutral-200 shadow-lg p-4 flex gap-4 overflow-hidden relative">
        <div className="w-1/4 bg-neutral-50 rounded-lg p-2 space-y-2 hidden md:block">
            <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
            <div className="h-8 w-full bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-600">AI Writing...</div>
            <div className="space-y-1 mt-4">
                <div className="h-2 w-full bg-neutral-200 rounded"></div>
                <div className="h-2 w-3/4 bg-neutral-200 rounded"></div>
            </div>
        </div>
        <div className="flex-1 bg-neutral-100/50 rounded-lg p-6 relative">
            <div className="absolute top-4 right-4 w-20 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-[8px] text-white shadow-md">Export PDF</div>
            <div className="w-16 h-16 bg-neutral-200 rounded-full mb-4"></div>
            <div className="h-4 w-1/2 bg-neutral-800 rounded mb-2"></div>
            <div className="h-2 w-full bg-neutral-300 rounded mb-1"></div>
            <div className="h-2 w-full bg-neutral-300 rounded mb-1"></div>
            <div className="h-2 w-2/3 bg-neutral-300 rounded"></div>
            
            <div className="mt-6 space-y-3">
                 <div className="flex justify-between">
                     <div className="h-3 w-20 bg-neutral-400 rounded"></div>
                     <div className="h-3 w-10 bg-neutral-200 rounded"></div>
                 </div>
                 <div className="h-2 w-full bg-neutral-300 rounded"></div>
                 <div className="h-2 w-11/12 bg-neutral-300 rounded"></div>
            </div>
        </div>
    </div>
);

const MockupAgentBuilder = () => (
    <div className="w-full aspect-video bg-neutral-900 rounded-xl shadow-lg p-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 to-neutral-900"></div>
        <div className="relative z-10 flex justify-center items-center h-full">
            <div className="flex items-center gap-4 md:gap-8">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-xl border-2 border-indigo-500 relative">
                    <User className="w-6 h-6 text-indigo-600" />
                    <div className="absolute -bottom-6 text-white text-[10px] font-mono">Persona</div>
                </div>
                <div className="w-12 h-1 bg-indigo-500/50 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-400 w-1/2 animate-scan"></div>
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-purple-500 relative z-20 scale-110">
                    <Bot className="w-8 h-8 text-purple-600" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                </div>
                <div className="w-12 h-1 bg-purple-500/50 rounded-full relative overflow-hidden">
                     <div className="absolute inset-0 bg-purple-400 w-1/2 animate-scan" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-xl border-2 border-green-500 relative">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    <div className="absolute -bottom-6 text-white text-[10px] font-mono">Task</div>
                </div>
            </div>
        </div>
    </div>
);

const MockupStudent = () => (
    <div className="w-full aspect-video bg-pink-50 rounded-xl border border-pink-100 shadow-inner p-6 relative overflow-hidden flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 w-3/4">
            <div className="bg-white p-4 rounded-xl shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-500 border border-pink-100">
                <div className="flex items-center gap-2 mb-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
                    <Copy className="w-3 h-3" /> Flashcard
                </div>
                <div className="text-sm font-bold text-neutral-800 mb-2">Mitochondria</div>
                <div className="w-full h-px bg-neutral-100 mb-2"></div>
                <div className="text-[10px] text-neutral-500 leading-relaxed">The powerhouse of the cell, responsible for generating ATP through respiration.</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500 translate-y-8 border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-3 h-3" /> Study Plan
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-neutral-50 p-1.5 rounded">
                        <span className="text-[8px] font-bold text-neutral-600">Monday</span>
                        <span className="text-[8px] text-blue-500">Calculus</span>
                    </div>
                    <div className="flex justify-between items-center bg-neutral-50 p-1.5 rounded">
                        <span className="text-[8px] font-bold text-neutral-600">Tuesday</span>
                        <span className="text-[8px] text-purple-500">Physics</span>
                    </div>
                    <div className="flex justify-between items-center bg-neutral-50 p-1.5 rounded">
                        <span className="text-[8px] font-bold text-neutral-600">Wednesday</span>
                        <span className="text-[8px] text-green-500">History</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MockupTeacher = () => (
    <div className="w-full aspect-video bg-orange-50 rounded-xl border border-orange-100 shadow-inner p-8 relative overflow-hidden flex items-center">
        <div className="bg-white w-full max-w-md mx-auto rounded-lg border border-neutral-200 shadow-xl p-6 relative">
            <div className="absolute -top-3 -left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm transform -rotate-12">
                A+ Grade
            </div>
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
                <div>
                    <div className="text-xs font-bold text-orange-600 uppercase mb-1">Lesson Plan</div>
                    <div className="font-bold text-neutral-900">The Solar System</div>
                </div>
                <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Grade 5</span>
            </div>
            <div className="space-y-4">
                <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-neutral-800">Objective</div>
                        <div className="h-1.5 w-48 bg-neutral-200 rounded mt-1"></div>
                    </div>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-neutral-800">Activity (15 min)</div>
                        <div className="h-1.5 w-32 bg-neutral-200 rounded mt-1"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MockupLinkedIn = () => (
    <div className="w-full aspect-video bg-[#0077b5] rounded-xl shadow-lg relative flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 flex gap-4 items-center">
            {/* URL Input */}
            <div className="bg-white rounded-xl p-3 shadow-2xl flex items-center gap-3 w-64 animate-in slide-in-from-left duration-700">
                <div className="w-8 h-8 bg-[#0077b5] rounded flex items-center justify-center text-white font-bold text-xs">in</div>
                <div className="flex-1">
                    <div className="h-2 w-24 bg-neutral-200 rounded mb-1"></div>
                    <div className="h-1.5 w-16 bg-neutral-100 rounded"></div>
                </div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-white animate-pulse" />
            
            {/* Result Resume */}
            <div className="bg-white rounded-xl p-3 shadow-2xl w-48 h-32 animate-in slide-in-from-right duration-700 delay-200 flex flex-col">
                <div className="flex gap-2 mb-2 border-b border-neutral-100 pb-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                    <div>
                        <div className="h-2 w-20 bg-neutral-800 rounded mb-1"></div>
                        <div className="h-1.5 w-12 bg-neutral-400 rounded"></div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="h-1 w-full bg-neutral-200 rounded"></div>
                    <div className="h-1 w-full bg-neutral-200 rounded"></div>
                    <div className="h-1 w-2/3 bg-neutral-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

// --- FEATURES DATA ---

const FEATURES = [
    {
        title: "AI Resume Builder",
        desc: "Chat with your resume. Our AI acts as a professional writer, refining your bullets and summary in real-time.",
        icon: Sparkles,
        visual: <MockupResumeBuilder />,
        color: "blue"
    },
    {
        title: "LinkedIn Transformer",
        desc: "Turn any public LinkedIn URL into a formatted, ATS-optimized resume JSON in seconds using deep reasoning.",
        icon: Globe,
        visual: <MockupLinkedIn />,
        color: "sky"
    },
    {
        title: "Agent Builder",
        desc: "Visually connect data nodes to build custom AI assistants. Create a 'Recruiter Persona' or 'Study Buddy' with drag-and-drop.",
        icon: BrainCircuit,
        visual: <MockupAgentBuilder />,
        color: "purple"
    },
    {
        title: "Student Toolkit",
        desc: "Flashcards, essay outlines, and GPA calculators all in one place. Study smarter with AI-generated schedules.",
        icon: GraduationCap,
        visual: <MockupStudent />,
        color: "pink"
    },
    {
        title: "Teacher Studio",
        desc: "Automate lesson planning, rubric creation, and quiz generation. Focus on teaching, not paperwork.",
        icon: BookOpen,
        visual: <MockupTeacher />,
        color: "orange"
    },
    {
        title: "Vibe Create",
        desc: "Simply describe your career history in plain English, and watch Kyndra construct a full resume structure instantly.",
        icon: Zap,
        visual: (
            <div className="w-full aspect-video bg-neutral-900 rounded-xl p-6 flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">"I'm a designer with 5 years exp..."</div>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        ),
        color: "yellow"
    },
    {
        title: "Design Pilot",
        desc: "Experimental visuals. Ask for 'Cyberpunk' or 'Swiss Minimalist' and get a unique CSS-styled resume.",
        icon: Palette,
        visual: (
            <div className="w-full aspect-video bg-gradient-to-br from-fuchsia-600 to-purple-900 rounded-xl p-6 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-white w-64 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="font-mono text-xs opacity-70 mb-2">theme: cyberpunk</div>
                    <div className="font-bold text-2xl mb-1">Neon Glow</div>
                    <div className="text-xs opacity-50">Generated by AI</div>
                </div>
            </div>
        ),
        color: "fuchsia"
    },
    {
        title: "Custom Forms",
        desc: "Generate surveys and sign-up forms with AI. Publish them instantly and track responses in your dashboard.",
        icon: FileCode,
        visual: (
            <div className="w-full aspect-video bg-neutral-100 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 w-3/4 flex gap-4 items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div>
                    <div className="h-2 w-full bg-neutral-100 rounded"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 w-3/4 flex gap-4 items-center opacity-75">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div>
                    <div className="h-2 w-2/3 bg-neutral-100 rounded"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 w-3/4 flex gap-4 items-center opacity-50">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div>
                    <div className="h-2 w-1/2 bg-neutral-100 rounded"></div>
                </div>
            </div>
        ),
        color: "emerald"
    },
    {
        title: "Salary Negotiator",
        desc: "Don't leave money on the table. Get a custom negotiation script based on your leverage and market data.",
        icon: Calculator,
        visual: (
            <div className="w-full aspect-video bg-green-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center relative z-10">
                    <div className="text-xs font-bold text-green-600 uppercase mb-1 tracking-widest">Offer Increase</div>
                    <div className="text-5xl font-bold text-green-700">+$15k</div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100/0 to-green-200/30 animate-pulse"></div>
            </div>
        ),
        color: "green"
    },
    {
        title: "Cover Letter Gen",
        desc: "Paste a job description and get a tailored cover letter that highlights why you are the perfect match.",
        icon: PenTool,
        visual: (
            <div className="w-full aspect-video bg-white border border-neutral-200 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 p-8 bg-neutral-50 rounded-full"><PenTool className="w-12 h-12 text-neutral-300"/></div>
                <div className="space-y-3 w-2/3">
                    <div className="h-2 bg-neutral-100 rounded w-full"></div>
                    <div className="h-2 bg-neutral-100 rounded w-full"></div>
                    <div className="h-2 bg-neutral-100 rounded w-full"></div>
                    <div className="h-2 bg-neutral-100 rounded w-3/4"></div>
                    <div className="h-2 bg-neutral-100 rounded w-full"></div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-full">Generate</div>
            </div>
        ),
        color: "indigo"
    },
    {
        title: "Job Matcher",
        desc: "Our AI scans thousands of remote jobs to find roles that match your specific skills and experience level.",
        icon: Target,
        visual: (
            <div className="w-full aspect-video bg-neutral-900 rounded-xl p-6 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-64 h-64 border border-white rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="w-48 h-48 border border-white rounded-full absolute animate-[spin_7s_linear_infinite_reverse]"></div>
                </div>
                <Target className="w-16 h-16 text-white relative z-10" />
                <div className="absolute bottom-6 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-white text-xs">
                    15 Matches Found
                </div>
            </div>
        ),
        color: "red"
    },
    {
        title: "Global Translator",
        desc: "Instantly translate your resume into any language while preserving the formatting and structure.",
        icon: Globe2,
        visual: (
            <div className="w-full aspect-video bg-cyan-50 rounded-xl flex items-center justify-center gap-4 relative overflow-hidden">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-cyan-900 z-10">Hello</div>
                <ArrowRight className="w-4 h-4 text-cyan-400 z-10" />
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-cyan-900 z-10">Hola</div>
                <ArrowRight className="w-4 h-4 text-cyan-400 z-10" />
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-cyan-900 z-10">Bonjour</div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] opacity-10"></div>
            </div>
        ),
        color: "cyan"
    },
    {
        title: "Interview Prep",
        desc: "Get AI-generated interview questions tailored to your specific resume and the job role you're applying for.",
        icon: MessageSquare,
        visual: (
            <div className="w-full aspect-video bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
                <div className="bg-neutral-100 rounded-t-xl rounded-br-xl p-4 w-3/4 text-xs text-neutral-600">
                    Tell me about a time you failed.
                </div>
                <div className="bg-blue-600 rounded-t-xl rounded-bl-xl p-4 w-3/4 text-xs text-white self-end">
                    Here is a suggested STAR response...
                </div>
            </div>
        ),
        color: "blue"
    },
    {
        title: "Email Writer",
        desc: "Draft professional emails for resignations, follow-ups, and networking with a single click.",
        icon: Mail,
        visual: (
            <div className="w-full aspect-video bg-slate-50 rounded-xl flex items-center justify-center relative">
                <Mail className="w-20 h-20 text-slate-300" />
                <div className="absolute bottom-8 bg-white px-6 py-2 rounded-full shadow-lg text-sm font-bold text-slate-700 flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Sent!
                </div>
            </div>
        ),
        color: "slate"
    },
    {
        title: "Deep Audit",
        desc: "Get a comprehensive score (0-100) and actionable feedback on how to improve your resume's impact.",
        icon: Shield,
        visual: (
            <div className="w-full aspect-video bg-white border border-neutral-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="w-40 h-40 border-[12px] border-neutral-100 rounded-full flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600">98</div>
                        <div className="text-[10px] uppercase font-bold text-neutral-400">Score</div>
                    </div>
                </div>
                <svg className="absolute w-40 h-40 rotate-[-90deg]">
                    <circle cx="80" cy="80" r="74" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="465" strokeDashoffset="20" className="animate-[dash_2s_ease-out]" />
                </svg>
            </div>
        ),
        color: "emerald"
    },
    {
        title: "Cloud Storage",
        desc: "Save all your documents, forms, and resumes securely in the cloud. Access them from anywhere.",
        icon: Cloud,
        visual: (
            <div className="w-full aspect-video bg-blue-50 rounded-xl flex items-center justify-center relative">
                <Cloud className="w-24 h-24 text-blue-200" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        ),
        color: "blue"
    },
    {
        title: "Resume to Website",
        desc: "Convert your resume into a personal portfolio website code (HTML/Tailwind) ready to host.",
        icon: Code2,
        visual: (
            <div className="w-full aspect-video bg-neutral-900 rounded-xl p-6 font-mono text-[10px] text-green-400 leading-relaxed overflow-hidden opacity-90">
                <span className="text-purple-400">export default</span> <span className="text-yellow-300">function</span> <span className="text-blue-400">Portfolio</span>() {'{'}<br/>
                &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">div</span> class="hero"&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">h1</span>&gt;John Doe&lt;/<span className="text-red-400">h1</span>&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">p</span>&gt;Developer&lt;/<span className="text-red-400">p</span>&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">div</span>&gt;<br/>
                &nbsp;&nbsp;);<br/>
                {'}'}
            </div>
        ),
        color: "stone"
    },
    {
        title: "ATS Optimization",
        desc: "Switch to 'ATS Mode' to strip graphics and ensure your resume parses perfectly in hiring systems.",
        icon: Cpu,
        visual: (
            <div className="w-full aspect-video bg-white border border-neutral-200 rounded-xl p-8 flex flex-col gap-3">
                <div className="h-3 w-full bg-neutral-900 rounded-sm"></div>
                <div className="h-2 w-full bg-neutral-200 rounded-sm"></div>
                <div className="h-2 w-full bg-neutral-200 rounded-sm"></div>
                <div className="h-2 w-3/4 bg-neutral-200 rounded-sm"></div>
                <div className="mt-4 pt-4 border-t border-dashed border-neutral-200">
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Parsing: 100%
                    </div>
                </div>
            </div>
        ),
        color: "gray"
    },
    {
        title: "Analytics",
        desc: "Track views and submissions on your custom forms. Know exactly when people are engaging.",
        icon: BarChart3,
        visual: (
            <div className="w-full aspect-video bg-white border border-neutral-200 rounded-xl p-6 flex items-end gap-2 items-end justify-center">
                <div className="w-8 h-12 bg-blue-100 rounded-t-md"></div>
                <div className="w-8 h-20 bg-blue-200 rounded-t-md"></div>
                <div className="w-8 h-32 bg-blue-400 rounded-t-md"></div>
                <div className="w-8 h-24 bg-blue-300 rounded-t-md"></div>
                <div className="w-8 h-40 bg-blue-600 rounded-t-md shadow-lg"></div>
            </div>
        ),
        color: "blue"
    },
    {
        title: "Grammar Polish",
        desc: "Automatically fix spelling errors and grammar mistakes without changing your tone.",
        icon: Wand2,
        visual: (
            <div className="w-full aspect-video bg-purple-50 rounded-xl flex items-center justify-center">
                <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <span className="text-neutral-400 line-through decoration-red-500 decoration-2">Recieved</span>
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-700 font-bold">Received</span>
                </div>
            </div>
        ),
        color: "purple"
    }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated, onGoToDiscover, onGuestTry, onGoToAssets, onViewTerms, onViewPrivacy, onViewAbout, onViewResources }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signup');
  const [waitlistPlan, setWaitlistPlan] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const handleAction = (view: 'signin' | 'signup') => {
      if (isAuthenticated) {
          onStart();
      } else {
          setAuthView(view);
          setShowAuth(true);
          document.body.style.overflow = 'hidden';
      }
  };

  const closeAuth = () => {
      setShowAuth(false);
      document.body.style.overflow = 'auto';
  };

  const openWaitlist = (plan: string) => {
      setWaitlistPlan(plan);
      setWaitlistEmail('');
      setWaitlistSuccess(false);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!waitlistEmail || !waitlistPlan) return;
      
      setIsSubmittingWaitlist(true);
      try {
          await joinWaitlist(waitlistEmail, waitlistPlan);
          setWaitlistSuccess(true);
          setTimeout(() => {
              setWaitlistPlan(null); // Close modal after delay
          }, 3000);
      } catch (e) {
          console.error(e);
          alert("Something went wrong. Please try again.");
      } finally {
          setIsSubmittingWaitlist(false);
      }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Auth Modal */}
      {showAuth && (
          <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-300">
              <div className="hidden lg:flex w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden">
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white opacity-80">
                       <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                       <span className="font-bold text-lg">Kyndra</span>
                  </div>
                  <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-neutral-900 to-neutral-900"></div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-12">
                      <Sparkles className="w-16 h-16 mb-6 text-purple-400" />
                      <h2 className="text-4xl font-bold mb-4">Welcome to the future of work.</h2>
                      <p className="text-xl text-neutral-400">Join thousands of students, teachers, and professionals using Kyndra to achieve more.</p>
                  </div>
              </div>
              <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 md:p-12 bg-white">
                   <button onClick={closeAuth} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors z-10">
                        <X className="w-6 h-6" />
                    </button>
                   <div className="w-full max-w-md">
                        <div className="lg:hidden flex items-center justify-center mb-8">
                             <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                        </div>
                        <Auth onSuccess={() => { closeAuth(); onStart(); }} defaultView={authView} />
                   </div>
              </div>
          </div>
      )}

      {/* Waitlist Modal */}
      {waitlistPlan && (
          <div className="fixed inset-0 z-[100] bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95">
                  <button 
                    onClick={() => setWaitlistPlan(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full text-neutral-400"
                  >
                      <X className="w-5 h-5" />
                  </button>
                  
                  {waitlistSuccess ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                              <CheckCircle2 className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-neutral-900 mb-2">You're on the list!</h3>
                          <p className="text-neutral-500">We'll notify you as soon as {waitlistPlan} becomes available.</p>
                      </div>
                  ) : (
                      <div className="text-center">
                          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Mail className="w-6 h-6 text-neutral-900" />
                          </div>
                          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Join the Waitlist</h3>
                          <p className="text-neutral-500 mb-6">
                              Get early access to <strong>{waitlistPlan}</strong> features.
                          </p>
                          
                          <form onSubmit={handleJoinWaitlist} className="space-y-4">
                              <div className="text-left">
                                  <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">Email Address</label>
                                  <input 
                                      type="email" 
                                      required
                                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                      placeholder="you@example.com"
                                      value={waitlistEmail}
                                      onChange={(e) => setWaitlistEmail(e.target.value)}
                                  />
                              </div>
                              <Button 
                                  type="submit" 
                                  className="w-full py-3 text-base"
                                  isLoading={isSubmittingWaitlist}
                              >
                                  Join Now
                              </Button>
                          </form>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-neutral-900/20 transition-transform hover:scale-105" />
            <div>
                <span className="font-bold text-xl tracking-tight block leading-none">Kyndra Workspace</span>
                <span className="text-[10px] font-medium text-neutral-400 block mt-0.5 uppercase tracking-wide">Formerly Resubuild AI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <button onClick={onViewAbout} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">About</button>
                <button onClick={onViewResources} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Resources</button>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
                <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Plans</button>
            </div>
            {isAuthenticated ? (
                <Button onClick={onStart} variant="primary" className="px-6 shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20">
                    Launch Workspace <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                     <button onClick={() => handleAction('signin')} className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors px-3 py-2">Log In</button>
                    <Button onClick={() => handleAction('signup')} variant="primary" className="px-6 shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20">
                        Get Started
                    </Button>
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-white via-neutral-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-600 text-sm font-medium mb-4 shadow-sm hover:shadow-md transition-all cursor-default animate-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Powered by Gemini 2.5 AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-neutral-900 drop-shadow-sm">
            The AI Workspace <br className="hidden md:block" />
            <span className="text-neutral-400">for Everyone.</span>
          </h1>
          
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            One suite for your entire journey. Build resumes, plan lessons, generate study guides, and automate your workflow with Kyndra.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-12">
            <Button 
              onClick={() => handleAction('signup')} 
              className="px-10 py-5 text-lg rounded-full shadow-xl shadow-neutral-900/20 hover:shadow-neutral-900/30 hover:-translate-y-1 transition-all duration-300"
            >
              Launch Workspace <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <button onClick={() => document.getElementById('suites')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 text-lg font-bold text-neutral-600 hover:text-neutral-900 transition-colors">
                Explore Tools
            </button>
          </div>

          {/* Product Hunt Badge */}
          <div className="flex justify-center -mt-6 pb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <a 
                href="https://www.producthunt.com/products/resubuild-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-resubuild-ai" 
                target="_blank" 
                rel="noreferrer"
                className="block rounded-full overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                  <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1040610&theme=dark&t=1763675720966" 
                    alt="Resubuild ai - Craft your perfect resume with Resubuild. | Product Hunt" 
                    style={{ width: '250px', height: '54px' }} 
                    width="250" 
                    height="54" 
                  />
              </a>
          </div>

        </div>
      </section>

      {/* Suites Grid */}
      <section id="suites" className="py-24 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Tools for every role.</h2>
                  <p className="text-xl text-neutral-500">Everything you need to succeed, all in one place.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {/* Career Suite */}
                  <ScrollReveal>
                      <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:shadow-xl transition-all h-full flex flex-col group">
                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <Briefcase className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">Career Suite</h3>
                          <p className="text-neutral-500 mb-6 flex-1">
                              Build ATS-friendly resumes, generate cover letters, and find your dream job with AI assistance.
                          </p>
                          <ul className="space-y-3 mb-8">
                              {['AI Resume Builder', 'Cover Letter Gen', 'LinkedIn Agent', 'Job Matcher'].map(item => (
                                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                                      <CheckCircle2 className="w-4 h-4 text-blue-500" /> {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </ScrollReveal>

                  {/* Education Suite (Student) */}
                  <ScrollReveal delay={100}>
                      <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:shadow-xl transition-all h-full flex flex-col group">
                          <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <GraduationCap className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">Student Hub</h3>
                          <p className="text-neutral-500 mb-6 flex-1">
                              Study smarter. Generate flashcards, essay outlines, and custom study schedules in seconds.
                          </p>
                          <ul className="space-y-3 mb-8">
                              {['Essay Outliner', 'Flashcard Generator', 'Study Planner', 'Homework Helper'].map(item => (
                                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                                      <CheckCircle2 className="w-4 h-4 text-pink-500" /> {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </ScrollReveal>

                  {/* Education Suite (Teacher) */}
                  <ScrollReveal delay={200}>
                      <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:shadow-xl transition-all h-full flex flex-col group">
                          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <BookOpen className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">Teacher Studio</h3>
                          <p className="text-neutral-500 mb-6 flex-1">
                              Automate lesson planning and grading so you can focus on what matters most: teaching.
                          </p>
                          <ul className="space-y-3 mb-8">
                              {['Lesson Planner', 'Quiz Generator', 'Rubric Creator', 'Report Card Writer'].map(item => (
                                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                                      <CheckCircle2 className="w-4 h-4 text-orange-500" /> {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </ScrollReveal>
              </div>
          </div>
      </section>

      {/* --- MEGA FEATURE SHOWCASE --- */}
      <section id="features" className="bg-white border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-24">
              <div className="text-center mb-24">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-bold mb-6">
                      <Sparkles className="w-4 h-4" /> Explore All Features
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">One platform. Infinite possibilities.</h2>
                  <p className="text-xl text-neutral-500 max-w-2xl mx-auto">Dive deep into the tools that power Kyndra Workspace.</p>
              </div>

              <div className="space-y-32">
                  {FEATURES.map((feature, index) => (
                      <ScrollReveal key={index} delay={index * 50}>
                          <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                              <div className="flex-1 w-full">
                                  {feature.visual}
                              </div>
                              <div className="flex-1 text-center md:text-left">
                                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 mb-6 shadow-sm`}>
                                      <feature.icon className="w-6 h-6" />
                                  </div>
                                  <h3 className="text-3xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                                  <p className="text-lg text-neutral-500 leading-relaxed">{feature.desc}</p>
                              </div>
                          </div>
                      </ScrollReveal>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Section - Added for Content Density */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-xl text-neutral-500">Common questions about Kyndra Workspace.</p>
              </div>
              <div className="space-y-6">
                  {[
                      { q: "Is Resubuild/Kyndra really free?", a: "Yes! Our core features like the resume builder, job search, and basic AI tools are free to use. We support the platform with unobtrusive ads." },
                      { q: "How does the AI Resume Builder work?", a: "We use advanced LLMs (Gemini 2.5/3.0) to analyze your input and format it into a professional JSON structure. We then render this into ATS-friendly PDFs." },
                      { q: "Is my data safe?", a: "Absolutely. Your personal data is stored securely. We do not sell your data to third parties. You can export or delete your account at any time." },
                      { q: "Can I use this for school?", a: "Yes, our Student Hub features specific tools for essay outlining, flashcard generation, and study planning tailored for high school and university students." }
                  ].map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200">
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <HelpCircle className="w-5 h-5 text-blue-600" /> {item.q}
                          </h3>
                          <p className="text-neutral-600 leading-relaxed">{item.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Resupilot Demo Section */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden text-white border-t border-neutral-800">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-12">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold mb-6 backdrop-blur-md">
                        <Play className="w-4 h-4 fill-current" /> See It In Action
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Intelligent creation. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Vibe Create.</span></h2>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Watch how Kyndra takes a simple natural language prompt and turns it into structured documents, plans, and designs.
                    </p>
              </div>
              <ResupilotDemo />
          </div>
      </section>

      {/* Pricing / Plans Section */}
      <section id="pricing" className="py-24 bg-white border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Simple pricing.</h2>
                  <p className="text-xl text-neutral-500">Powerful features for everyone, supported by ads or subscription.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  
                  {/* Free Plan */}
                  <ScrollReveal>
                      <div className="h-full p-8 rounded-3xl border border-neutral-200 bg-white flex flex-col hover:shadow-xl transition-all">
                          <div className="mb-4">
                              <h3 className="text-xl font-bold text-neutral-900">Kyndra Free</h3>
                              <div className="text-4xl font-bold mt-4 mb-1">$0</div>
                              <p className="text-sm text-neutral-500">Forever free access to all tools.</p>
                          </div>
                          <div className="flex-1 space-y-4 my-8">
                              {["Unlimited Resumes", "Basic AI Tools (Flash)", "Lesson Planner", "Study Tools", "Job Search", "Ad-Supported Experience"].map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                                      <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" /> {feat}
                                  </div>
                              ))}
                              <p className="text-xs text-neutral-400 mt-4 border-t border-neutral-100 pt-4 italic">* We use Google AdSense to keep this service free for everyone.</p>
                          </div>
                          <Button onClick={() => handleAction('signup')} variant="secondary" className="w-full">
                              Get Started
                          </Button>
                      </div>
                  </ScrollReveal>

                  {/* Plus Plan */}
                  <ScrollReveal delay={100}>
                      <div className="h-full p-8 rounded-3xl border-2 border-blue-100 bg-blue-50/30 flex flex-col hover:shadow-xl transition-all relative overflow-hidden">
                          <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                              Waitlist
                          </div>
                          <div className="mb-4">
                              <h3 className="text-xl font-bold text-blue-900">Kyndra Plus</h3>
                              <div className="text-4xl font-bold mt-4 mb-1 text-blue-900">$10<span className="text-lg font-normal text-blue-400">/mo</span></div>
                              <p className="text-sm text-blue-500">Ad-free with Pro models.</p>
                          </div>
                          <div className="flex-1 space-y-4 my-8">
                              {["Everything in Free", "No Ads", "Gemini 2.5 Pro & 3.0 Pro", "100 AI Credits / Day", "Deep Reasoning Mode", "Priority Processing"].map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-blue-800">
                                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> {feat}
                                  </div>
                              ))}
                          </div>
                          <button 
                            onClick={() => openWaitlist('Plus Plan')}
                            className="w-full py-2.5 rounded-full border border-blue-200 text-blue-600 font-bold text-sm bg-white/50 hover:bg-white hover:shadow-sm transition-all"
                          >
                              Join Waitlist
                          </button>
                      </div>
                  </ScrollReveal>

                  {/* Kyndra Circle */}
                  <ScrollReveal delay={200}>
                      <div className="h-full p-8 rounded-3xl border border-neutral-800 bg-neutral-900 text-white flex flex-col shadow-2xl hover:scale-105 transition-transform relative overflow-hidden group">
                          {/* Background Gradients */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-white/10 z-20">
                              Waitlist
                          </div>
                          
                          {/* Labs Circle Visual */}
                          <div className="relative h-40 mb-2 flex items-center justify-center mt-4">
                                {/* Outer Orbit */}
                                <div className="absolute w-32 h-32 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '15s' }}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-purple-500/20">
                                        <FlaskConical className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-pink-500/20">
                                        <BookOpen className="w-4 h-4 text-pink-400" />
                                    </div>
                                </div>
                                
                                {/* Inner Orbit (Reverse) */}
                                <div className="absolute w-20 h-20 border border-white/10 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '10s' }}>
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-blue-500/20">
                                        <Bot className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-emerald-500/20">
                                        <BrainCircuit className="w-3 h-3 text-emerald-400" />
                                    </div>
                                </div>
                                
                                {/* Core */}
                                <div className="absolute w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.6)] z-10 relative">
                                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
                                </div>
                          </div>

                          <div className="mb-6 relative z-10 text-center">
                              <h3 className="text-2xl font-bold mb-1 tracking-tight">Kyndra Circle</h3>
                              <p className="text-sm text-neutral-400">The ultimate AI productivity suite.</p>
                              <div className="text-4xl font-bold mt-4 mb-1">$20<span className="text-lg font-normal text-neutral-500">/mo</span></div>
                          </div>

                          <div className="flex-1 space-y-4 my-4 relative z-10 border-t border-white/10 pt-6">
                              {[
                                  { name: "Unlimited AI Credits", icon: Zap },
                                  { name: "Future Labs Access", icon: FlaskConical },
                                  { name: "Cloud Storage (10GB)", icon: Cloud },
                                  { name: "Advanced Automation Agents", icon: Bot },
                                  { name: "Custom Domains", icon: Globe2 }
                              ].map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                      <feat.icon className="w-4 h-4 text-purple-400 shrink-0" /> {feat.name}
                                  </div>
                              ))}
                          </div>
                          <button 
                            onClick={() => openWaitlist('Kyndra Circle')}
                            className="w-full py-3 rounded-full bg-white text-neutral-900 font-bold text-sm hover:bg-neutral-100 transition-colors relative z-10 mt-auto shadow-lg"
                          >
                              Join Circle Waitlist
                          </button>
                      </div>
                  </ScrollReveal>

              </div>
          </div>
      </section>

      {/* Ad Transparency Section */}
      <section className="py-24 bg-white border-t border-neutral-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 text-sm font-bold mb-6">
                  <Megaphone className="w-4 h-4" /> Transparency
              </div>
              <h2 className="text-4xl font-bold mb-6">Why we show ads.</h2>
              <p className="text-xl text-neutral-500 mb-12 leading-relaxed">
                  Our mission is to make success accessible to everyone, regardless of budget. 
                  To keep Kyndra free, we display ads in non-intrusive areas.
              </p>

              <div className="grid md:grid-cols-3 gap-8 text-left">
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-green-600">
                          <Layout className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Zero Distractions</h3>
                      <p className="text-sm text-neutral-500">We never show ads inside the editor or during critical tasks.</p>
                  </div>
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-600">
                          <X className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">No Pop-ups</h3>
                      <p className="text-sm text-neutral-500">We hate them too. You won't see annoying pop-overs blocking your view.</p>
                  </div>
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-purple-600">
                          <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Clean Exports</h3>
                      <p className="text-sm text-neutral-500">Your documents are 100% clean. No watermarks, no branding, no ads.</p>
                  </div>
              </div>

              <div className="mt-12 pt-8 border-t border-neutral-100 text-center text-xs text-neutral-400 max-w-2xl mx-auto">
                  <p className="mb-2">
                      Our ad implementation follows strict <a href="https://support.google.com/adsense/answer/48182" target="_blank" rel="noreferrer" className="underline hover:text-neutral-600">Google AdSense Program Policies</a>.
                  </p>
                  <div className="flex justify-center gap-4">
                      <button onClick={onViewPrivacy} className="underline hover:text-neutral-600">Privacy Policy</button>
                      <span>•</span>
                      <button onClick={onViewTerms} className="underline hover:text-neutral-600">Terms of Service</button>
                      <span>•</span>
                      <button onClick={onViewPrivacy} className="underline hover:text-neutral-600">Cookie Policy</button>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-white px-6">
         <div className="max-w-5xl mx-auto bg-neutral-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-neutral-900/20 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
            
            <ScrollReveal>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to achieve more?</h2>
                    <p className="text-neutral-400 text-xl mb-10 max-w-2xl mx-auto">Join thousands of users building their future with Kyndra Workspace.</p>
                    <Button 
                        onClick={() => handleAction('signup')} 
                        className="bg-white text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 px-10 py-4 h-auto text-lg rounded-full font-bold border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        Launch Workspace
                    </Button>
                </div>
            </ScrollReveal>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-100 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
            <span className="font-bold tracking-tight">Kyndra Workspace</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500 flex-wrap justify-center">
              <a href="#" className="hover:text-neutral-900 transition-colors">Features</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Pricing</a>
              <button onClick={onViewResources} className="hover:text-purple-600 text-purple-600 font-bold transition-colors flex items-center gap-1"><Book className="w-3 h-3"/> Resources & Guides</button>
              <a href="/design-pilot" className="hover:text-purple-600 text-purple-600 font-bold transition-colors flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Design Pilot</a>
              <button onClick={onViewAbout} className="hover:text-neutral-900 transition-colors font-medium text-neutral-600">About Us</button> 
              <button onClick={onViewPrivacy} className="hover:text-neutral-900 transition-colors">Privacy</button>
              <button onClick={onViewTerms} className="hover:text-neutral-900 transition-colors">Terms</button>
              {onGoToAssets && (
                  <button onClick={onGoToAssets} className="hover:text-neutral-900 transition-colors">Media Kit</button>
              )}
          </div>
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Kyndra Workspace (formerly Resubuild). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
