import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Layout, 
  Download, 
  Wand2, 
  CheckCircle2, 
  FileText,
  Star,
  X,
  Palette,
  AlignLeft,
  Briefcase,
  Users,
  Trophy,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  MessageSquare,
  PenTool,
  Search,
  Bot,
  Play
} from 'lucide-react';
import { Button } from './Button';
import { Auth } from './Auth';
import { ResupilotDemo } from './ResupilotDemo';

interface LandingPageProps {
  onStart: () => void; // This now means "Enter App" (Dashboard)
  isAuthenticated: boolean;
  onGoToDiscover?: () => void;
}

// --- Helper Components for Animations ---

const CountUp: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.5 });
        
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only animate once
            }
        }, { threshold: 0.15 }); // Trigger when 15% visible
        
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

// Helper component to draw the abstract resume lines
const SkeletonResume: React.FC<{ variant: 'simple' | 'modern' | 'professional' | 'creative' | 'minimal' }> = ({ variant }) => {
  
  // Creative Layout (Sidebar)
  if (variant === 'creative') {
      return (
        <div className="flex h-full w-full bg-white cursor-default select-none pointer-events-none overflow-hidden">
            <div className="w-1/3 bg-neutral-800 h-full p-3 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-600 mx-auto"></div>
                <div className="h-1.5 bg-neutral-600 w-3/4 mx-auto rounded-full"></div>
                <div className="h-1.5 bg-neutral-600 w-1/2 mx-auto rounded-full"></div>
                <div className="mt-4 space-y-2">
                    <div className="h-1 bg-neutral-700 w-full rounded-full"></div>
                    <div className="h-1 bg-neutral-700 w-5/6 rounded-full"></div>
                    <div className="h-1 bg-neutral-700 w-4/5 rounded-full"></div>
                </div>
            </div>
            <div className="flex-1 p-3 space-y-3">
                <div className="h-2 bg-neutral-200 w-1/3 rounded-full mb-2"></div>
                <div className="space-y-1.5">
                    <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
                    <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
                    <div className="h-1.5 bg-neutral-100 w-3/4 rounded-full"></div>
                </div>
                <div className="h-2 bg-neutral-200 w-1/4 rounded-full mt-4 mb-2"></div>
                <div className="flex gap-2">
                     <div className="w-1 h-full bg-neutral-100"></div>
                     <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-neutral-100 w-11/12 rounded-full"></div>
                        <div className="h-1.5 bg-neutral-100 w-2/3 rounded-full"></div>
                     </div>
                </div>
            </div>
        </div>
      );
  }

  // Minimal Layout (Centered)
  if (variant === 'minimal') {
      return (
        <div className="flex flex-col h-full w-full p-4 bg-white cursor-default select-none pointer-events-none items-center">
             <div className="w-12 h-12 rounded-full bg-neutral-100 mb-3"></div>
             <div className="h-3 bg-neutral-800 w-1/2 rounded-full mb-2"></div>
             <div className="h-1.5 bg-neutral-300 w-1/3 rounded-full mb-6"></div>
             
             <div className="w-full space-y-4">
                 <div className="flex flex-col items-center gap-1">
                     <div className="h-1.5 bg-neutral-200 w-1/6 rounded-full mb-1"></div>
                     <div className="h-1 bg-neutral-100 w-3/4 rounded-full"></div>
                     <div className="h-1 bg-neutral-100 w-5/6 rounded-full"></div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <div className="h-1.5 bg-neutral-200 w-1/6 rounded-full mb-1"></div>
                     <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                     <div className="h-1 bg-neutral-100 w-4/5 rounded-full"></div>
                 </div>
             </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full w-full p-4 md:p-5 bg-white cursor-default select-none pointer-events-none">
      {/* Header */}
      <div className={`flex items-center gap-3 mb-5 ${variant === 'modern' ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-100 flex-shrink-0"></div>
        <div className={`space-y-2 flex-1 ${variant === 'modern' ? 'text-right' : ''} ${variant === 'simple' ? 'text-center' : ''}`}>
          <div className={`h-3 bg-neutral-800 w-3/4 rounded-full ${variant === 'simple' ? 'mx-auto' : variant === 'modern' ? 'ml-auto' : ''}`}></div>
          <div className={`h-2 bg-neutral-200 w-1/2 rounded-full ${variant === 'simple' ? 'mx-auto' : variant === 'modern' ? 'ml-auto' : ''}`}></div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4 flex-1">
        {/* Block 1 */}
        <div className="space-y-2">
            <div className="h-2 bg-neutral-100 w-1/4 rounded-full mb-3"></div>
            <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
            <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
            <div className="h-1.5 bg-neutral-100 w-5/6 rounded-full"></div>
        </div>

         {/* Block 2 */}
         <div className="space-y-2">
            <div className="h-2 bg-neutral-100 w-1/3 rounded-full mb-3"></div>
            {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-2">
                    <div className="w-1 h-1.5 bg-neutral-200 rounded-full mt-0.5"></div>
                    <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 bg-neutral-50 w-11/12 rounded-full"></div>
                        <div className="h-1.5 bg-neutral-50 w-3/4 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Skills (visible if Professional) */}
        {variant === 'professional' && (
             <div className="pt-2">
                <div className="h-2 bg-neutral-100 w-1/5 rounded-full mb-3"></div>
                <div className="flex gap-2 flex-wrap">
                    <div className="h-4 w-12 bg-neutral-50 rounded border border-neutral-100"></div>
                    <div className="h-4 w-16 bg-neutral-50 rounded border border-neutral-100"></div>
                    <div className="h-4 w-10 bg-neutral-50 rounded border border-neutral-100"></div>
                    <div className="h-4 w-14 bg-neutral-50 rounded border border-neutral-100"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated, onGoToDiscover }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signup');

  const handleAction = (view: 'signin' | 'signup') => {
      if (isAuthenticated) {
          onStart();
      } else {
          setAuthView(view);
          setShowAuth(true);
          document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
  };

  const closeAuth = () => {
      setShowAuth(false);
      document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Full Screen Split Auth Overlay */}
      {showAuth && (
          <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-300">
              
              {/* Left Side: Visual Branding (Desktop Only) */}
              <div className="hidden lg:flex w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden">
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white opacity-80">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-neutral-900">
                         <FileText className="w-4 h-4" />
                       </div>
                       <span className="font-bold text-lg">Resubuild</span>
                  </div>

                  {/* Abstract Decoration */}
                  <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-neutral-900 to-neutral-900"></div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center">
                      {/* Animated Resume Preview */}
                      <div className="animate-float">
                          <div className="w-[260px] h-[370px] bg-white rounded-xl shadow-2xl rotate-[-3deg] overflow-hidden border border-white/10">
                              <SkeletonResume variant="professional" />
                              {/* Floating Badge */}
                              <div className="absolute -right-3 top-12 bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white/10">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>AI Optimized</span>
                              </div>
                          </div>
                      </div>

                      <div className="mt-12 max-w-md text-center px-6">
                          <p className="text-xl font-medium text-neutral-200 mb-4">"The AI suggestions are frighteningly good. It helped me rewrite my entire experience section in minutes."</p>
                          <div className="flex items-center justify-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">MC</div>
                               <div className="text-left">
                                   <div className="text-sm font-bold text-white">Marcus Chen</div>
                                   <div className="text-xs text-neutral-400">Senior UX Designer</div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right Side: Auth Form */}
              <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 md:p-12 bg-white">
                   <button 
                      onClick={closeAuth}
                      className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                   
                   <div className="w-full max-w-md">
                        <div className="lg:hidden flex items-center justify-center mb-8">
                             <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <FileText className="w-5 h-5" />
                             </div>
                        </div>
                        <Auth onSuccess={() => { closeAuth(); onStart(); }} defaultView={authView} />
                   </div>
              </div>
          </div>
      )}


      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-neutral-900/20 transition-transform hover:scale-105">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Resubuild</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
                {onGoToDiscover && (
                    <button onClick={onGoToDiscover} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Discover</button>
                )}
                <button onClick={() => document.getElementById('tips')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Expert Tips</button>
            </div>
            {isAuthenticated ? (
                <Button onClick={onStart} variant="primary" className="px-6 shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20">
                    Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                     <button 
                        onClick={() => handleAction('signin')}
                        className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors px-3 py-2"
                    >
                        Log In
                    </button>
                    <Button onClick={() => handleAction('signup')} variant="primary" className="px-6 shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20">
                        Start Building
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
            <Sparkles className="w-4 h-4 text-neutral-900" />
            <span>Powered by Gemini 2.5 AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-neutral-900 drop-shadow-sm">
            Craft your perfect resume <br className="hidden md:block" />
            <span className="text-neutral-400">with Resubuild.</span>
          </h1>
          
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            The intelligent resume builder that helps you land your dream job. 
            Smart content suggestions, real-time previews, and instant PDF exports.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-12">
            <Button 
              onClick={() => handleAction('signup')} 
              className="px-10 py-5 text-lg rounded-full shadow-xl shadow-neutral-900/20 hover:shadow-neutral-900/30 hover:-translate-y-1 transition-all duration-300"
            >
              Build My Resume <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {onGoToDiscover && (
                <Button 
                    onClick={onGoToDiscover}
                    variant="secondary"
                    className="px-10 py-5 text-lg rounded-full hover:-translate-y-1 transition-transform"
                >
                    Discover Resumes
                </Button>
            )}
          </div>
        </div>

        {/* Visual Resume Stack Preview */}
        <div className="mt-4 relative h-[280px] md:h-[400px] w-full max-w-4xl mx-auto perspective-[2000px] px-4 pointer-events-none">
            
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-neutral-100 via-neutral-50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>

            {/* Left Card - Simple Variant */}
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[125%] md:-translate-x-[115%] rotate-[-6deg] origin-bottom-right z-10 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-150">
                <SkeletonResume variant="simple" />
            </div>

            {/* Right Card - Modern Variant */}
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[25%] md:translate-x-[15%] rotate-[6deg] origin-bottom-left z-10 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-300">
                <SkeletonResume variant="modern" />
            </div>

            {/* Center Card - Professional Variant (Main) */}
            <div className="absolute top-0 left-1/2 w-[220px] md:w-[300px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/15 border border-neutral-200 transform -translate-x-1/2 z-20 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-16 fill-mode-backwards">
                <SkeletonResume variant="professional" />
                
                {/* Floating Badge on Center Card */}
                <div className="absolute -right-4 top-12 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Enhanced</span>
                </div>
            </div>
        </div>
      </section>

      {/* NEW: Resupilot Demo Section */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden text-white">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-12">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold mb-6 backdrop-blur-md">
                        <Play className="w-4 h-4 fill-current" /> See It In Action
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Don't just build. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Vibe Create.</span></h2>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Watch how Resupilot takes a simple natural language prompt and turns it into a perfectly formatted resume in seconds.
                    </p>
              </div>
              
              {/* The Animated Demo Component */}
              <ResupilotDemo />
          </div>
      </section>

      {/* Stats Strip (New) */}
      <section className="bg-white py-16 text-neutral-900 border-y border-neutral-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <ScrollReveal>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"><CountUp end={15000} suffix="+" duration={2500} /></div>
                <div className="text-sm text-neutral-500 font-medium uppercase tracking-widest">Resumes Created</div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"><CountUp end={35} suffix="+" duration={2000} /></div>
                <div className="text-sm text-neutral-500 font-medium uppercase tracking-widest">Countries</div>
            </ScrollReveal>
             <ScrollReveal delay={200}>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"><CountUp end={92} suffix="%" duration={2000} /></div>
                <div className="text-sm text-neutral-500 font-medium uppercase tracking-widest">Interview Rate</div>
            </ScrollReveal>
             <ScrollReveal delay={300}>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"><CountUp end={100} suffix="%" duration={1500} /></div>
                <div className="text-sm text-neutral-500 font-medium uppercase tracking-widest">ATS Friendly</div>
            </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Resubuild?</h2>
                <p className="text-neutral-500 text-lg">Everything you need to create a professional resume in minutes, designed for modern recruiters.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Wand2 className="w-8 h-8" />,
                title: "AI-Powered Writing",
                desc: "Leverage Gemini 2.5 to rewrite bullet points and generate compelling professional summaries instantly.",
                delay: 0
              },
              {
                icon: <Layout className="w-8 h-8" />,
                title: "Real-Time Preview",
                desc: "See changes as you type with our split-screen editor. Visual feedback helps you craft the perfect layout.",
                delay: 100
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "One-Click PDF",
                desc: "Export your resume as a polished, ATS-friendly PDF document ready for application submissions.",
                delay: 200
              }
            ].map((feature, idx) => (
              <ScrollReveal key={idx} delay={feature.delay}>
                <div className="bg-white p-10 rounded-3xl border border-neutral-200/60 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 group h-full">
                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 text-neutral-900 border border-neutral-100 group-hover:scale-110 transition-transform duration-300 group-hover:bg-neutral-900 group-hover:text-white">
                    {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900">{feature.title}</h3>
                    <p className="text-neutral-500 leading-relaxed text-lg">
                    {feature.desc}
                    </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* New Feature Deep Dive Section */}
      <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 space-y-32">
              
              {/* Feature 1: Resupilot AI */}
              <ScrollReveal>
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6 lg:pr-8">
                         <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
                            <Bot className="w-8 h-8" />
                         </div>
                         <h3 className="text-4xl font-bold leading-tight">Chat with your resume.<br/>Meet Resupilot AI.</h3>
                         <p className="text-xl text-neutral-500 leading-relaxed">
                             Resubuild isn't just a form filler. It's a conversation. Use our AI agent to write, edit, and refine your resume naturally.
                         </p>
                         <div className="space-y-3 text-neutral-700 font-medium">
                             <div className="flex items-center gap-3">
                                 <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                 <span>"Make my summary more punchy"</span>
                             </div>
                             <div className="flex items-center gap-3">
                                 <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                 <span>"Add Figma to my skill set"</span>
                             </div>
                             <div className="flex items-center gap-3">
                                 <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                 <span>"Generate a cover letter for this job"</span>
                             </div>
                         </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative bg-neutral-50 rounded-3xl p-8 border border-neutral-100 shadow-2xl shadow-neutral-900/5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                             <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                             <div className="space-y-4">
                                 <div className="flex gap-4 items-start">
                                     <div className="w-8 h-8 rounded-full bg-neutral-900 flex-shrink-0"></div>
                                     <div className="bg-neutral-900 text-white px-5 py-3 rounded-2xl rounded-tl-none text-sm">
                                         Can you rewrite my experience at TechCorp to sound more impressive?
                                     </div>
                                 </div>
                                 <div className="flex gap-4 items-start flex-row-reverse">
                                     <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div>
                                     <div className="bg-white border border-neutral-200 px-5 py-3 rounded-2xl rounded-tr-none text-sm text-neutral-700 shadow-sm">
                                         I've updated the bullet points to focus on your leadership in the API migration project.
                                     </div>
                                 </div>
                                 <div className="flex gap-4 items-start flex-row-reverse animate-pulse">
                                      <div className="bg-white border border-neutral-200 px-5 py-3 rounded-2xl rounded-tr-none text-sm text-neutral-400 shadow-sm">
                                         ...
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
              </ScrollReveal>

              {/* Feature 2: Smart Audit */}
              <ScrollReveal>
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="flex-1 space-y-6 lg:pl-8">
                         <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-2">
                            <Target className="w-8 h-8" />
                         </div>
                         <h3 className="text-4xl font-bold leading-tight">Beat the ATS Bots with<br/>Smart Scoring.</h3>
                         <p className="text-xl text-neutral-500 leading-relaxed">
                             Don't guess if your resume is good enough. Our AI Audit scans your document against 50+ checkpoints used by hiring systems.
                         </p>
                         <Button variant="outline" onClick={() => handleAction('signup')}>
                             Audit My Resume Free <ArrowRight className="ml-2 w-4 h-4" />
                         </Button>
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                        <div className="relative w-[300px] h-[300px]">
                            <div className="absolute inset-0 bg-yellow-50/50 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-white rounded-full shadow-xl border border-neutral-100 flex items-center justify-center flex-col">
                                <div className="text-7xl font-bold text-neutral-900 mb-2">92</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">Resume Score</div>
                                <div className="mt-6 flex gap-2">
                                     <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Quantified Impact</span>
                                     <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Action Verbs</span>
                                </div>
                            </div>
                            {/* Floating Checkpoints */}
                            <div className="absolute top-0 right-0 bg-white p-3 rounded-xl shadow-lg border border-neutral-100 flex items-center gap-2 animate-bounce text-sm font-medium text-neutral-700">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Readable Fonts
                            </div>
                             <div className="absolute bottom-10 left-[-20px] bg-white p-3 rounded-xl shadow-lg border border-neutral-100 flex items-center gap-2 animate-bounce delay-75 text-sm font-medium text-neutral-700">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> No Typos
                            </div>
                        </div>
                    </div>
                </div>
              </ScrollReveal>

              {/* Feature 3: Tailored Content */}
              <ScrollReveal>
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6 lg:pr-8">
                         <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-2">
                            <PenTool className="w-8 h-8" />
                         </div>
                         <h3 className="text-4xl font-bold leading-tight">Perfect Cover Letters<br/>in seconds.</h3>
                         <p className="text-xl text-neutral-500 leading-relaxed">
                             Paste a job description, and we'll write a cover letter that connects your unique experience to the company's needs.
                         </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden relative h-[300px]">
                             <div className="absolute top-0 left-0 w-full h-12 bg-neutral-50 border-b border-neutral-100 flex items-center px-4 gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
                             </div>
                             <div className="p-8 pt-16 space-y-4">
                                 <div className="h-4 bg-neutral-100 w-1/3 rounded-full"></div>
                                 <div className="space-y-2">
                                     <div className="h-2 bg-neutral-100 w-full rounded-full"></div>
                                     <div className="h-2 bg-neutral-100 w-full rounded-full"></div>
                                     <div className="h-2 bg-neutral-100 w-5/6 rounded-full"></div>
                                     <div className="h-2 bg-neutral-100 w-full rounded-full"></div>
                                 </div>
                                 <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3 mt-4">
                                     <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                     <div className="space-y-2 w-full">
                                         <div className="h-2 bg-purple-200 w-full rounded-full"></div>
                                         <div className="h-2 bg-purple-200 w-4/5 rounded-full"></div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
              </ScrollReveal>

               {/* Feature 4: Employer Matching */}
              <ScrollReveal>
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="flex-1 space-y-6 lg:pl-8">
                         <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-2">
                            <Search className="w-8 h-8" />
                         </div>
                         <h3 className="text-4xl font-bold leading-tight">Get discovered by<br/>Top Employers.</h3>
                         <p className="text-xl text-neutral-500 leading-relaxed">
                             Publish your resume to our Discover network. Employers use our AI Recruiter to find candidates just like you.
                         </p>
                         <div className="flex gap-4">
                             <div className="text-center">
                                 <div className="text-2xl font-bold text-neutral-900">500+</div>
                                 <div className="text-xs text-neutral-500 uppercase tracking-wider">Companies</div>
                             </div>
                             <div className="w-px bg-neutral-200 h-10"></div>
                              <div className="text-center">
                                 <div className="text-2xl font-bold text-neutral-900">24h</div>
                                 <div className="text-xs text-neutral-500 uppercase tracking-wider">Avg Response</div>
                             </div>
                         </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                 <div className="flex items-center gap-3 mb-3">
                                     <div className="w-8 h-8 bg-neutral-900 rounded-full"></div>
                                     <div>
                                         <div className="h-2 w-16 bg-neutral-200 rounded-full mb-1"></div>
                                         <div className="h-1.5 w-10 bg-neutral-100 rounded-full"></div>
                                     </div>
                                 </div>
                                 <div className="h-8 w-full bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center text-xs text-neutral-400">View Profile</div>
                             </div>
                             <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                 <div className="flex items-center gap-3 mb-3">
                                     <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                                     <div>
                                         <div className="h-2 w-16 bg-neutral-200 rounded-full mb-1"></div>
                                         <div className="h-1.5 w-10 bg-neutral-100 rounded-full"></div>
                                     </div>
                                 </div>
                                 <div className="h-8 w-full bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center text-xs text-neutral-400">View Profile</div>
                             </div>
                             <div className="bg-neutral-900 p-4 rounded-2xl shadow-xl col-span-2 transform -translate-y-12 mx-8 text-white text-center">
                                  <div className="text-sm font-medium mb-1">New Message</div>
                                  <div className="text-lg font-bold">"We'd love to interview you!"</div>
                             </div>
                        </div>
                    </div>
                </div>
              </ScrollReveal>

          </div>
      </section>

      {/* Expert Tips */}
      <section id="tips" className="py-24 bg-neutral-50 relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <ScrollReveal>
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-widest mb-4">
                            Expert Career Advice
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tips for a winning resume</h2>
                        <p className="text-neutral-500 text-lg">
                            Our templates are designed to pass the robots, but your content needs to impress the humans. Here is how to stand out.
                        </p>
                    </div>
                </div>
             </ScrollReveal>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                     {
                         title: "Quantify Impact",
                         text: "Don't just list duties. Use numbers. 'Increased sales by 20%' beats 'Managed sales'.",
                         icon: <TrendingUp className="w-6 h-6" />
                     },
                     {
                         title: "Action Verbs",
                         text: "Start bullet points with strong verbs like 'Spearheaded', 'Executed', or 'Developed'.",
                         icon: <Zap className="w-6 h-6" />
                     },
                     {
                         title: "Tailor Content",
                         text: "Customize your skills section for every job application to match their keywords.",
                         icon: <Target className="w-6 h-6" />
                     },
                     {
                         title: "Keep it Recent",
                         text: "Focus on your last 10-15 years of experience. Summarize older roles briefly.",
                         icon: <Lightbulb className="w-6 h-6" />
                     }
                 ].map((tip, i) => (
                     <ScrollReveal key={i} delay={i * 100}>
                        <div className="bg-white p-8 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300 group h-full">
                            <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-900 mb-6 shadow-sm group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                {tip.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-3">{tip.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{tip.text}</p>
                        </div>
                     </ScrollReveal>
                 ))}
             </div>
          </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <ScrollReveal>
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Templates for every career</h2>
                        <p className="text-neutral-500 text-lg">
                            Whether you are a creative designer or a financial analyst, we have a layout that highlights your strengths.
                        </p>
                    </div>
                    <Button onClick={() => handleAction('signup')} variant="outline" className="h-12 px-6 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors">
                        View All Templates
                    </Button>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      {
                          title: "Modern",
                          desc: "Clean and balanced.",
                          icon: <Layout className="w-5 h-5" />,
                          variant: "modern"
                      },
                      {
                          title: "Professional",
                          desc: "Traditional and serif.",
                          icon: <FileText className="w-5 h-5" />,
                          variant: "professional"
                      },
                      {
                          title: "Creative",
                          desc: "Bold sidebar accent.",
                          icon: <Palette className="w-5 h-5" />,
                          variant: "creative"
                      },
                      {
                          title: "Minimal",
                          desc: "Simple and centered.",
                          icon: <AlignLeft className="w-5 h-5" />,
                          variant: "minimal"
                      }
                  ].map((t, i) => (
                      <ScrollReveal key={i} delay={i * 100}>
                        <div className="group cursor-pointer" onClick={() => handleAction('signup')}>
                            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden aspect-[210/297] mb-5 relative shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                                    {/* Render appropriate skeleton */}
                                    <div className="transform scale-[0.4] origin-top-left w-[250%] h-[250%] p-6 pointer-events-none">
                                        <SkeletonResume variant={t.variant as any} />
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white px-6 py-3 rounded-full shadow-xl font-bold text-sm text-neutral-900 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Use Template
                                        </div>
                                    </div>
                            </div>
                            <div className="flex items-start gap-3 px-2">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-neutral-900 border border-neutral-100 shadow-sm">
                                    {t.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{t.title}</h3>
                                    <p className="text-neutral-500 text-sm">{t.desc}</p>
                                </div>
                            </div>
                        </div>
                      </ScrollReveal>
                  ))}
              </div>
          </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-neutral-50 border-t border-neutral-100">
         <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-widest mb-4">
                        Simple Process
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">From blank page to hired in 3 steps</h2>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-neutral-200 -z-10" />

                {[
                    {
                        step: "01",
                        title: "Enter Details",
                        desc: "Fill in your experience, education, and skills in our easy-to-use editor.",
                        icon: <Users className="w-6 h-6 text-white" />
                    },
                    {
                        step: "02",
                        title: "Enhance with AI",
                        desc: "Use our AI tools to polish your descriptions and generate a professional summary.",
                        icon: <Sparkles className="w-6 h-6 text-white" />
                    },
                    {
                        step: "03",
                        title: "Download PDF",
                        desc: "Preview your document and download a perfectly formatted PDF instantly.",
                        icon: <Trophy className="w-6 h-6 text-white" />
                    }
                ].map((item, i) => (
                    <ScrollReveal key={i} delay={i * 150}>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center shadow-xl shadow-neutral-900/20 mb-8 relative z-10 border-4 border-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                {item.icon}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm border-2 border-white">
                                    {item.step}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-neutral-500 max-w-xs mx-auto">{item.desc}</p>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-neutral-500 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-neutral-700 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal>
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by professionals</h2>
                        <p className="text-neutral-400 text-lg max-w-xl">See what job seekers are saying about how Resubuild helped them in their career journey.</p>
                    </div>
                    <div className="flex gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                        </div>
                        <span className="text-neutral-200 font-medium ml-2">5.0/5 Rating</span>
                    </div>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        quote: "I was struggling to write a summary that stood out. Resubuild's AI generated the perfect one in seconds. I got the interview!",
                        author: "Sarah Jenkins",
                        role: "Product Manager"
                    },
                    {
                        quote: "The minimalist design is exactly what recruiters are looking for. Clean, professional, and no formatting headaches.",
                        author: "David Chen",
                        role: "Software Engineer"
                    },
                    {
                        quote: "Finally a resume builder that is actually free and doesn't force you to sign up. The real-time preview is a game changer.",
                        author: "Emily Rossi",
                        role: "Marketing Specialist"
                    }
                ].map((review, i) => (
                    <ScrollReveal key={i} delay={i * 100}>
                        <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-3xl border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1">
                            <div className="mb-6 text-neutral-300 leading-relaxed italic relative">
                                <span className="absolute -top-4 -left-2 text-6xl text-neutral-700 opacity-30 font-serif">"</span>
                                {review.quote}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center font-bold text-sm shadow-lg">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold">{review.author}</div>
                                    <div className="text-sm text-neutral-500">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollReveal>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                </div>
            </ScrollReveal>
            
            <div className="space-y-4">
                {[
                    {
                        q: "Is Resubuild really free?",
                        a: "Yes, Resubuild is free to use. Create an account to save your resumes and access them from any device."
                    },
                    {
                        q: "How is my data stored?",
                        a: "We use secure authentication. Your resume data is currently stored securely on your device, linked to your account."
                    },
                    {
                        q: "Can I import my existing resume?",
                        a: "Currently, we support building from scratch to ensure the best formatting compatibility with our templates. Import features are coming soon."
                    },
                    {
                        q: "Is the PDF ATS-friendly?",
                        a: "Absolutely. We use standard text-based PDF generation that is easily readable by Applicant Tracking Systems (ATS) used by most companies."
                    }
                ].map((faq, i) => (
                    <ScrollReveal key={i} delay={i * 50}>
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 cursor-default">
                            <h3 className="font-bold text-lg text-neutral-900 mb-2 flex items-start gap-3">
                                <span className="text-neutral-300 font-mono">0{i+1}</span> {faq.q}
                            </h3>
                            <p className="text-neutral-600 leading-relaxed pl-9">
                                {faq.a}
                            </p>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
          </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-white px-6">
         <div className="max-w-5xl mx-auto bg-neutral-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-neutral-900/20 overflow-hidden relative group">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
            
            <ScrollReveal>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to launch your career?</h2>
                    <p className="text-neutral-400 text-xl mb-10 max-w-2xl mx-auto">Join thousands of professionals who have built their resumes with Resubuild.</p>
                    <Button 
                    onClick={() => handleAction('signup')} 
                    className="bg-white text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 px-10 py-4 h-auto text-lg rounded-full font-bold border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                    Build Resume Now
                    </Button>
                </div>
            </ScrollReveal>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-100 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <div className="w-6 h-6 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-bold tracking-tight">Resubuild</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
              <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
          </div>
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Resubuild. Built for the modern professional.
          </p>
        </div>
      </footer>
    </div>
  );
};