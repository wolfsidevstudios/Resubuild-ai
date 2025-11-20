
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
  Play,
  ArrowUp
} from 'lucide-react';
import { Button } from './Button';
import { Auth } from './Auth';
import { ResupilotDemo } from './ResupilotDemo';

interface LandingPageProps {
  onStart: () => void; // This now means "Enter App" (Dashboard)
  isAuthenticated: boolean;
  onGoToDiscover?: () => void;
  onGuestTry?: (prompt: string) => void;
  onGoToAssets?: () => void;
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

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated, onGoToDiscover, onGuestTry, onGoToAssets }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signup');
  const [playgroundPrompt, setPlaygroundPrompt] = useState('');

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

  const handlePlaygroundSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (playgroundPrompt.trim() && onGuestTry) {
          onGuestTry(playgroundPrompt);
      }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Full Screen Split Auth Overlay */}
      {showAuth && (
          <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-300">
              
              {/* Left Side: Visual Branding (Desktop Only) */}
              <div className="hidden lg:flex w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden">
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white opacity-80">
                       <img 
                          src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                          alt="Resubuild Logo" 
                          className="w-8 h-8 rounded-lg object-cover"
                       />
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
                             <img 
                                src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                                alt="Resubuild Logo" 
                                className="w-12 h-12 rounded-xl object-cover shadow-lg"
                             />
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
            <img 
                src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                alt="Resubuild Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-neutral-900/20 transition-transform hover:scale-105"
            />
            <span className="font-bold text-xl tracking-tight">Resubuild</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
                {onGoToDiscover && (
                    <button onClick={onGoToDiscover} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Discover</button>
                )}
                <button onClick={() => document.getElementById('playground')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Try it Now</button>
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

      {/* Resupilot Demo Section */}
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

      {/* NEW: Playground Section (Test without Login) */}
      <section id="playground" className="py-24 bg-white relative">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <ScrollReveal>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
                      <Zap className="w-4 h-4" /> Free Playground
                  </div>
                  <h2 className="text-4xl font-bold mb-6">Try it right now. No login required.</h2>
                  <p className="text-xl text-neutral-500 mb-10">
                      Describe your role, paste your LinkedIn bio, or just type what you do.
                      We'll generate a full resume for you instantly.
                  </p>

                  <form onSubmit={handlePlaygroundSubmit} className="relative max-w-2xl mx-auto group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <input
                          value={playgroundPrompt}
                          onChange={(e) => setPlaygroundPrompt(e.target.value)}
                          placeholder="e.g. I'm a Barista with 3 years experience looking for a Store Manager role..."
                          className="w-full h-20 pl-8 pr-20 bg-white rounded-[2.5rem] shadow-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg relative z-10"
                      />
                      <button 
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-6 bg-neutral-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all hover:scale-105 z-20 shadow-lg"
                      >
                          Generate <ArrowUp className="w-4 h-4" />
                      </button>
                  </form>
                  <p className="mt-4 text-sm text-neutral-400">
                      Enter a prompt to launch the builder in guest mode.
                  </p>
              </ScrollReveal>
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

      {/* Feature Deep Dive */}
      <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
              {/* Feature 1: Resupilot */}
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                  <div className="flex-1 space-y-6">
                       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                            <Sparkles className="w-4 h-4" /> Resupilot AI
                       </div>
                       <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Just chat. <br/>We'll build.</h2>
                       <p className="text-xl text-neutral-500 leading-relaxed">
                           No more fiddling with formatting. Just tell Resupilot what you need—"Add a skill", "Rewrite my summary", "Make it professional"—and watch it happen instantly.
                       </p>
                  </div>
                  <div className="flex-1 w-full">
                       <div className="relative aspect-square md:aspect-[4/3] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 shadow-2xl shadow-blue-100">
                           {/* Abstract Chat UI */}
                           <div className="absolute bottom-0 w-full p-6 bg-white border-t border-neutral-100">
                               <div className="h-12 bg-neutral-100 rounded-full flex items-center px-4 text-neutral-400 text-sm">Add React to my skills...</div>
                           </div>
                           <div className="p-6 space-y-4">
                               <div className="flex gap-3">
                                   <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                                   <div className="bg-white border border-neutral-100 p-3 rounded-2xl rounded-tl-none text-sm text-neutral-600 shadow-sm">How does your resume look now?</div>
                               </div>
                               <div className="flex gap-3 flex-row-reverse">
                                   <div className="w-8 h-8 bg-neutral-900 rounded-full"></div>
                                   <div className="bg-neutral-900 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">Perfect, thanks!</div>
                               </div>
                           </div>
                       </div>
                  </div>
              </div>

              {/* Feature 2: Audit (Reversed) */}
               <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
                  <div className="flex-1 space-y-6">
                       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-bold">
                            <Target className="w-4 h-4" /> Smart Audit
                       </div>
                       <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Beat the ATS <br/>before you apply.</h2>
                       <p className="text-xl text-neutral-500 leading-relaxed">
                           Get a real-time score on your resume. Our AI scans for keywords, formatting issues, and quantifiable results to ensure you get past the bots.
                       </p>
                  </div>
                  <div className="flex-1 w-full flex justify-center">
                       <div className="relative w-64 h-64 flex items-center justify-center bg-white rounded-full shadow-2xl border-8 border-neutral-50">
                           <div className="text-center">
                               <div className="text-6xl font-bold text-neutral-900">92</div>
                               <div className="text-green-500 font-bold uppercase tracking-wider text-sm mt-1">Excellent</div>
                           </div>
                           {/* Orbiting elements */}
                           <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm animate-bounce">Keywords Found</div>
                           <div className="absolute bottom-10 left-0 bg-neutral-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm animate-pulse">Format Clean</div>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need.</h2>
                <p className="text-neutral-500 text-lg">Powerful tools designed for the modern job seeker.</p>
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
              },
               {
                icon: <PenTool className="w-8 h-8" />,
                title: "Cover Letter Gen",
                desc: "Paste the job description and let our AI write a tailored cover letter that matches your resume's tone.",
                delay: 300
              },
               {
                icon: <Search className="w-8 h-8" />,
                title: "Talent Discovery",
                desc: "Publish your profile to our exclusive talent pool where verified employers can find and message you.",
                delay: 400
              },
               {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Direct Messaging",
                desc: "Chat directly with recruiters and employers who are interested in your profile.",
                delay: 500
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
            <img 
                src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                alt="Resubuild Logo" 
                className="w-6 h-6 rounded-lg object-cover"
            />
            <span className="font-bold tracking-tight">Resubuild</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
              <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
              {onGoToAssets && (
                  <button onClick={onGoToAssets} className="hover:text-neutral-900 transition-colors">Media Kit</button>
              )}
          </div>
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Resubuild. Built for the modern professional.
          </p>
        </div>
      </footer>
    </div>
  );
};
