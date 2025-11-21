
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
  User,
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
  ArrowUp,
  ChevronDown,
  Building2,
  Globe2,
  Cloud,
  FlaskConical,
  BrainCircuit,
  Mail,
  Loader2
} from 'lucide-react';
import { Button } from './Button';
import { Auth } from './Auth';
import { ResupilotDemo } from './ResupilotDemo';
import { joinWaitlist } from '../services/firebase';

interface LandingPageProps {
  onStart: () => void; // This now means "Enter App" (Dashboard)
  isAuthenticated: boolean;
  onGoToDiscover?: () => void;
  onGuestTry?: (prompt: string) => void;
  onGoToAssets?: () => void;
  onViewTerms?: () => void;
  onViewPrivacy?: () => void;
  onViewAbout?: () => void; // Add About handler
}

// --- Helper Components ---

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
                observer.disconnect(); 
            }
        }, { threshold: 0.15 }); 
        
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

// Helper to draw the abstract resume lines
const SkeletonResume: React.FC<{ variant: 'simple' | 'modern' | 'professional' | 'creative' | 'minimal' }> = ({ variant }) => {
  if (variant === 'creative') {
      return (
        <div className="flex h-full w-full bg-white cursor-default select-none pointer-events-none overflow-hidden">
            <div className="w-1/3 bg-neutral-800 h-full p-3 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-600 mx-auto"></div>
                <div className="h-1.5 bg-neutral-600 w-3/4 mx-auto rounded-full"></div>
                <div className="h-1.5 bg-neutral-600 w-1/2 mx-auto rounded-full"></div>
            </div>
            <div className="flex-1 p-3 space-y-3">
                <div className="h-2 bg-neutral-200 w-1/3 rounded-full mb-2"></div>
                <div className="space-y-1.5">
                    <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
                    <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
                </div>
            </div>
        </div>
      );
  }
  if (variant === 'minimal') {
      return (
        <div className="flex flex-col h-full w-full p-4 bg-white cursor-default select-none pointer-events-none items-center">
             <div className="w-12 h-12 rounded-full bg-neutral-100 mb-3"></div>
             <div className="h-3 bg-neutral-800 w-1/2 rounded-full mb-2"></div>
             <div className="w-full space-y-4 mt-4">
                 <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                 <div className="h-1 bg-neutral-100 w-4/5 rounded-full"></div>
             </div>
        </div>
      );
  }
  return (
    <div className="flex flex-col h-full w-full p-4 md:p-5 bg-white cursor-default select-none pointer-events-none">
      <div className={`flex items-center gap-3 mb-5 ${variant === 'modern' ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-100 flex-shrink-0"></div>
        <div className={`space-y-2 flex-1 ${variant === 'modern' ? 'text-right' : ''}`}>
          <div className={`h-3 bg-neutral-800 w-3/4 rounded-full ${variant === 'modern' ? 'ml-auto' : ''}`}></div>
          <div className={`h-2 bg-neutral-200 w-1/2 rounded-full ${variant === 'modern' ? 'ml-auto' : ''}`}></div>
        </div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
            <div className="h-2 bg-neutral-100 w-1/4 rounded-full mb-3"></div>
            <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
            <div className="h-1.5 bg-neutral-100 w-full rounded-full"></div>
        </div>
         <div className="space-y-2">
            <div className="h-2 bg-neutral-100 w-1/3 rounded-full mb-3"></div>
            {[1, 2].map(i => (
                <div key={i} className="flex gap-2">
                    <div className="w-1 h-1.5 bg-neutral-200 rounded-full mt-0.5"></div>
                    <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 bg-neutral-50 w-11/12 rounded-full"></div>
                        <div className="h-1.5 bg-neutral-50 w-3/4 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated, onGoToDiscover, onGuestTry, onGoToAssets, onViewTerms, onViewPrivacy, onViewAbout }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signup');
  const [playgroundPrompt, setPlaygroundPrompt] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Waitlist State
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

  const handlePlaygroundSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (playgroundPrompt.trim() && onGuestTry) {
          onGuestTry(playgroundPrompt);
      }
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

  const FAQs = [
      { q: "Is Resubuild really free?", a: "Yes! You can build, edit, and export your resume for free. We also offer premium features like AI Audit and Talent Discovery for power users." },
      { q: "How does the AI work?", a: "We use Gemini 2.5, Google's latest multimodal model. It understands context, job descriptions, and professional tone to write content that sounds like you, but better." },
      { q: "Can I download as PDF?", a: "Absolutely. Our exports are high-quality, ATS-friendly PDFs that preserve formatting perfectly across all devices." },
      { q: "Will my data be shared?", a: "Only if you choose to 'Publish' your profile to our Discover page. Otherwise, your data is private and stored securely." }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Auth Modal */}
      {showAuth && (
          <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-300">
              <div className="hidden lg:flex w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden">
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white opacity-80">
                       <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                       <span className="font-bold text-lg">Resubuild</span>
                  </div>
                  <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-neutral-900 to-neutral-900"></div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center">
                      <div className="animate-float">
                          <div className="w-[260px] h-[370px] bg-white rounded-xl shadow-2xl rotate-[-3deg] overflow-hidden border border-white/10">
                              <SkeletonResume variant="professional" />
                              <div className="absolute -right-3 top-12 bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white/10">
                                  <Sparkles className="w-2.5 h-2.5" /> <span>AI Optimized</span>
                              </div>
                          </div>
                      </div>
                      <div className="mt-12 max-w-md text-center px-6">
                          <p className="text-xl font-medium text-neutral-200 mb-4">"I landed my dream job at Spotify in 2 weeks. The AI audit is a game changer."</p>
                          <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">SJ</div>
                                <div className="text-left">
                                   <div className="text-sm font-bold text-white">Sarah Jenkins</div>
                                   <div className="text-xs text-neutral-400">Product Designer</div>
                               </div>
                          </div>
                      </div>
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
            <span className="font-bold text-xl tracking-tight">Resubuild</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <button onClick={onViewAbout} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">About</button>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
                <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Pricing</button>
                {onGoToDiscover && (
                    <button onClick={onGoToDiscover} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Discover</button>
                )}
            </div>
            {isAuthenticated ? (
                <Button onClick={onStart} variant="primary" className="px-6 shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20">
                    Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                     <button onClick={() => handleAction('signin')} className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors px-3 py-2">Log In</button>
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
            Smart content generation, real-time previews, and instant PDF exports.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-12">
            <Button 
              onClick={() => handleAction('signup')} 
              className="px-10 py-5 text-lg rounded-full shadow-xl shadow-neutral-900/20 hover:shadow-neutral-900/30 hover:-translate-y-1 transition-all duration-300"
            >
              Build My Resume <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {onGoToDiscover && (
                <Button onClick={onGoToDiscover} variant="secondary" className="px-10 py-5 text-lg rounded-full hover:-translate-y-1 transition-transform">
                    Discover Resumes
                </Button>
            )}
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

        {/* Visual Resume Stack */}
        <div className="mt-4 relative h-[280px] md:h-[400px] w-full max-w-4xl mx-auto perspective-[2000px] px-4 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-neutral-100 via-neutral-50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[125%] md:-translate-x-[115%] rotate-[-6deg] origin-bottom-right z-10 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-150">
                <SkeletonResume variant="simple" />
            </div>
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[25%] md:translate-x-[15%] rotate-[6deg] origin-bottom-left z-10 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-300">
                <SkeletonResume variant="modern" />
            </div>
            <div className="absolute top-0 left-1/2 w-[220px] md:w-[300px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/15 border border-neutral-200 transform -translate-x-1/2 z-20 transition-transform duration-1000 ease-out animate-in fade-in slide-in-from-bottom-16 fill-mode-backwards">
                <SkeletonResume variant="professional" />
                <div className="absolute -right-4 top-12 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                    <Sparkles className="w-3 h-3" /> <span>AI Enhanced</span>
                </div>
            </div>
        </div>
      </section>

      {/* Logo Strip (Social Proof) */}
      <section className="py-10 border-y border-neutral-100 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-sm text-neutral-500 font-semibold uppercase tracking-widest mb-8">Trusted by professionals at</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
                  {/* Replaced with text for simplicity, usually SVGs */}
                  <span className="text-xl font-bold font-serif">Google</span>
                  <span className="text-xl font-bold tracking-tighter">Spotify</span>
                  <span className="text-xl font-bold italic">Stripe</span>
                  <span className="text-xl font-bold">Airbnb</span>
                  <span className="text-xl font-bold font-serif">Notion</span>
              </div>
          </div>
      </section>

      {/* Resupilot Demo Section */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden text-white">
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
              <ResupilotDemo />
          </div>
      </section>

      {/* Playground Section */}
      <section id="playground" className="py-24 bg-white relative border-b border-neutral-100">
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
                      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-6 bg-neutral-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all hover:scale-105 z-20 shadow-lg">
                          Generate <ArrowUp className="w-4 h-4" />
                      </button>
                  </form>
              </ScrollReveal>
          </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white py-16 text-neutral-900 relative overflow-hidden">
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
      <section id="features" className="py-24 bg-neutral-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
              {/* Resupilot */}
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
                       <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl shadow-blue-100">
                           <div className="absolute bottom-0 w-full p-6 bg-white border-t border-neutral-100 z-10">
                               <div className="h-12 bg-neutral-100 rounded-full flex items-center px-4 text-neutral-400 text-sm">Add React to my skills...</div>
                           </div>
                           <div className="p-6 space-y-4">
                               <div className="flex gap-3">
                                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600"/></div>
                                   <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-2xl rounded-tl-none text-sm text-neutral-600 shadow-sm">How does your resume look now?</div>
                               </div>
                               <div className="flex gap-3 flex-row-reverse">
                                   <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white"/></div>
                                   <div className="bg-neutral-900 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">Perfect, thanks!</div>
                               </div>
                           </div>
                       </div>
                  </div>
              </div>

              {/* Smart Audit */}
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
                       <div className="relative w-72 h-72 flex items-center justify-center bg-white rounded-full shadow-2xl border-8 border-neutral-50">
                           <div className="text-center">
                               <div className="text-6xl font-bold text-neutral-900">92</div>
                               <div className="text-green-500 font-bold uppercase tracking-wider text-sm mt-1">Excellent</div>
                           </div>
                           <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm animate-bounce">Keywords Found</div>
                           <div className="absolute bottom-10 left-0 bg-neutral-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm animate-pulse">Format Clean</div>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">How it works</h2>
                  <p className="text-xl text-neutral-500">Three simple steps to your dream job.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                   <ScrollReveal>
                       <div className="text-center">
                           <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                               <MessageSquare className="w-10 h-10" />
                           </div>
                           <h3 className="text-xl font-bold mb-3">1. Input your info</h3>
                           <p className="text-neutral-500 leading-relaxed">
                               Describe your experience naturally or upload a current resume. Our AI parses and organizes it instantly.
                           </p>
                       </div>
                   </ScrollReveal>
                   <ScrollReveal delay={150}>
                       <div className="text-center">
                           <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                               <Wand2 className="w-10 h-10" />
                           </div>
                           <h3 className="text-xl font-bold mb-3">2. AI Optimization</h3>
                           <p className="text-neutral-500 leading-relaxed">
                               Use Smart Polish to fix grammar, enhance tone, and add strong action verbs with a single click.
                           </p>
                       </div>
                   </ScrollReveal>
                   <ScrollReveal delay={300}>
                       <div className="text-center">
                           <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-600">
                               <Download className="w-10 h-10" />
                           </div>
                           <h3 className="text-xl font-bold mb-3">3. Export & Apply</h3>
                           <p className="text-neutral-500 leading-relaxed">
                               Download a perfectly formatted PDF or publish to our Discover network to let employers find you.
                           </p>
                       </div>
                   </ScrollReveal>
              </div>
          </div>
      </section>

      {/* All Features Grid */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need.</h2>
                <p className="text-neutral-500 text-lg">Powerful tools designed for the modern job seeker.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Layout className="w-6 h-6" />, title: "Real-Time Preview", desc: "See changes as you type with our split-screen editor." },
              { icon: <Download className="w-6 h-6" />, title: "One-Click PDF", desc: "Export your resume as a polished, ATS-friendly PDF document." },
              { icon: <PenTool className="w-6 h-6" />, title: "Cover Letter Gen", desc: "AI writes tailored cover letters matching your resume's tone." },
              { icon: <Search className="w-6 h-6" />, title: "Talent Discovery", desc: "Publish your profile to our exclusive employer talent pool." },
              { icon: <MessageSquare className="w-6 h-6" />, title: "Direct Messaging", desc: "Chat directly with recruiters interested in your profile." },
              { icon: <Globe2 className="w-6 h-6" />, title: "Custom Domains", desc: "Share your resume with a personalized link (coming soon)." }
            ].map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="bg-white p-8 rounded-2xl border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 text-neutral-900 border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-neutral-900">{feature.title}</h3>
                    <p className="text-neutral-500 leading-relaxed">
                    {feature.desc}
                    </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section id="pricing" className="py-24 bg-white border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Choose your path.</h2>
                  <p className="text-xl text-neutral-500">Powerful features for every stage of your career.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  
                  {/* Free Plan */}
                  <ScrollReveal>
                      <div className="h-full p-8 rounded-3xl border border-neutral-200 bg-white flex flex-col hover:shadow-xl transition-all">
                          <div className="mb-4">
                              <h3 className="text-xl font-bold text-neutral-900">Free</h3>
                              <div className="text-4xl font-bold mt-4 mb-1">$0</div>
                              <p className="text-sm text-neutral-500">Forever free for everyone.</p>
                          </div>
                          <div className="flex-1 space-y-4 my-8">
                              {["Unlimited Resumes", "Basic AI Tools (Flash)", "PDF Export", "Resume Templates", "Job Search"].map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                                      <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" /> {feat}
                                  </div>
                              ))}
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
                              Coming Soon
                          </div>
                          <div className="mb-4">
                              <h3 className="text-xl font-bold text-blue-900">Plus</h3>
                              <div className="text-4xl font-bold mt-4 mb-1 text-blue-900">$10<span className="text-lg font-normal text-blue-400">/mo</span></div>
                              <p className="text-sm text-blue-500">For power users.</p>
                          </div>
                          <div className="flex-1 space-y-4 my-8">
                              {["Everything in Free", "Gemini 2.5 Pro & 3.0 Pro", "100 AI Credits / Day", "Deep Reasoning Mode", "Priority Processing"].map((feat, i) => (
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
                              Coming Soon
                          </div>
                          
                          {/* Labs Circle Visual */}
                          <div className="relative h-40 mb-2 flex items-center justify-center mt-4">
                                {/* Outer Orbit */}
                                <div className="absolute w-32 h-32 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '15s' }}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-purple-500/20">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-neutral-900 p-1.5 rounded-full border border-white/20 shadow-lg shadow-pink-500/20">
                                        <FlaskConical className="w-4 h-4 text-pink-400" />
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
                              <p className="text-sm text-neutral-400">The ultimate AI career suite.</p>
                              <div className="text-4xl font-bold mt-4 mb-1">$20<span className="text-lg font-normal text-neutral-500">/mo</span></div>
                          </div>

                          <div className="flex-1 space-y-4 my-4 relative z-10 border-t border-white/10 pt-6">
                              {[
                                  { name: "Unlimited AI Credits", icon: Zap },
                                  { name: "Future Labs Access", icon: FlaskConical },
                                  { name: "Cloud Storage (10GB)", icon: Cloud },
                                  { name: "Human Expert Review", icon: User },
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

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
           <div className="max-w-7xl mx-auto px-6">
               <h2 className="text-4xl font-bold text-center mb-16">Loved by thousands.</h2>
               <div className="grid md:grid-cols-3 gap-8">
                   {[
                       { text: "I was struggling to get interviews. After using Resubuild's audit tool, I fixed my keywords and got a call from Google the next week.", name: "David Chen", role: "Software Engineer", bg: "bg-blue-50" },
                       { text: "The AI writing suggestions are actually good. It doesn't sound robotic, it sounds like a better version of me.", name: "Sarah Miller", role: "Marketing Director", bg: "bg-purple-50" },
                       { text: "Finally, a resume builder that doesn't mess up the formatting when I export to PDF. Worth every penny (even though it's free!).", name: "James Wilson", role: "Product Manager", bg: "bg-green-50" }
                   ].map((t, i) => (
                       <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg flex flex-col">
                           <div className="flex gap-1 text-yellow-400 mb-4">
                               {[1,2,3,4,5].map(x => <Star key={x} className="w-4 h-4 fill-current" />)}
                           </div>
                           <p className="text-lg text-neutral-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                           <div className="mt-auto flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center font-bold text-neutral-900`}>
                                   {t.name.charAt(0)}
                               </div>
                               <div>
                                   <div className="font-bold text-sm">{t.name}</div>
                                   <div className="text-xs text-neutral-400">{t.role}</div>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
          <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {FAQs.map((faq, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                          <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full p-6 text-left flex justify-between items-center font-bold text-lg"
                          >
                              {faq.q}
                              <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                          </button>
                          <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <p className="text-neutral-500 leading-relaxed">{faq.a}</p>
                          </div>
                      </div>
                  ))}
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
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to launch your career?</h2>
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
            <img src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
            <span className="font-bold tracking-tight">Resubuild</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500 flex-wrap justify-center">
              <a href="#" className="hover:text-neutral-900 transition-colors">Features</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Pricing</a>
              <a href="/design-pilot" className="hover:text-purple-600 text-purple-600 font-bold transition-colors flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Design Pilot</a>
              <button onClick={onViewAbout} className="hover:text-neutral-900 transition-colors font-medium text-neutral-600">About Us</button> {/* Added About Button */}
              <button onClick={onViewPrivacy} className="hover:text-neutral-900 transition-colors">Privacy</button>
              <button onClick={onViewTerms} className="hover:text-neutral-900 transition-colors">Terms</button>
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
