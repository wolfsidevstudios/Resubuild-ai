
import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Layout, 
  Download, 
  Wand2, 
  CheckCircle2, 
  FileText,
  Star,
  X
} from 'lucide-react';
import { Button } from './Button';
import { Auth } from './Auth';

interface LandingPageProps {
  onStart: () => void; // This now means "Enter App" (Dashboard)
  isAuthenticated: boolean;
}

// Helper component to draw the abstract resume lines
const SkeletonResume: React.FC<{ variant: 'simple' | 'modern' | 'professional' }> = ({ variant }) => {
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

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, isAuthenticated }) => {
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
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-neutral-900/20">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Resubuild</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-4">
                <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">How it Works</button>
            </div>
            {isAuthenticated ? (
                <Button onClick={onStart} variant="primary" className="px-6">
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
                    <Button onClick={() => handleAction('signup')} variant="primary" className="px-6">
                        Start Building
                    </Button>
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-white via-neutral-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-600 text-sm font-medium mb-4 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <Sparkles className="w-4 h-4 text-neutral-900" />
            <span>Powered by Gemini 2.5 AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-neutral-900">
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
              className="px-10 py-5 text-lg rounded-full shadow-xl shadow-neutral-900/20 hover:shadow-neutral-900/30 hover:-translate-y-1 transition-all"
            >
              Build My Resume <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Visual Resume Stack Preview */}
        <div className="mt-4 relative h-[280px] md:h-[400px] w-full max-w-4xl mx-auto perspective-[2000px] px-4 pointer-events-none">
            
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-neutral-100 via-neutral-50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>

            {/* Left Card - Simple Variant */}
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[125%] md:-translate-x-[115%] rotate-[-6deg] origin-bottom-right z-10 transition-transform duration-700 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-150">
                <SkeletonResume variant="simple" />
            </div>

            {/* Right Card - Modern Variant */}
            <div className="absolute top-8 md:top-10 left-1/2 w-[200px] md:w-[280px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/5 border border-neutral-200/80 transform -translate-x-[25%] md:translate-x-[15%] rotate-[6deg] origin-bottom-left z-10 transition-transform duration-700 ease-out animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards delay-300">
                <SkeletonResume variant="modern" />
            </div>

            {/* Center Card - Professional Variant (Main) */}
            <div className="absolute top-0 left-1/2 w-[220px] md:w-[300px] aspect-[210/297] bg-white rounded-2xl shadow-2xl shadow-neutral-900/15 border border-neutral-200 transform -translate-x-1/2 z-20 transition-transform duration-700 ease-out animate-in fade-in slide-in-from-bottom-16 fill-mode-backwards">
                <SkeletonResume variant="professional" />
                
                {/* Floating Badge on Center Card */}
                <div className="absolute -right-4 top-12 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Enhanced</span>
                </div>
            </div>
        </div>

        <div className="pt-16 flex items-center justify-center gap-8 text-neutral-400 text-sm font-medium flex-wrap relative z-20">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-900" /> No credit card needed</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-900" /> Free Plan Available</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-900" /> Privacy focused</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why choose Resubuild?</h2>
            <p className="text-neutral-500 text-lg">Everything you need to create a professional resume in minutes, designed for modern recruiters.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Wand2 className="w-8 h-8" />,
                title: "AI-Powered Writing",
                desc: "Leverage Gemini 2.5 to rewrite bullet points and generate compelling professional summaries instantly."
              },
              {
                icon: <Layout className="w-8 h-8" />,
                title: "Real-Time Preview",
                desc: "See changes as you type with our split-screen editor. Visual feedback helps you craft the perfect layout."
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "One-Click PDF",
                desc: "Export your resume as a polished, ATS-friendly PDF document ready for application submissions."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl border border-neutral-200/60 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 text-neutral-900 border border-neutral-100 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-widest mb-4">
                    Simple Process
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">From blank page to hired in 3 steps</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-neutral-100 -z-10" />

                {[
                    {
                        step: "01",
                        title: "Enter Details",
                        desc: "Fill in your experience, education, and skills in our easy-to-use editor.",
                        icon: <FileText className="w-6 h-6 text-white" />
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
                        icon: <Download className="w-6 h-6 text-white" />
                    }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center bg-white">
                        <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center shadow-xl shadow-neutral-900/20 mb-8 relative z-10 border-4 border-white">
                            {item.icon}
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm border-2 border-white">
                                {item.step}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-neutral-500 max-w-xs mx-auto">{item.desc}</p>
                    </div>
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
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by professionals</h2>
                    <p className="text-neutral-400 text-lg max-w-xl">See what job seekers are saying about how Resubuild helped them in their career journey.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="text-neutral-400 font-medium">5.0/5 Rating</span>
                </div>
            </div>

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
                    <div key={i} className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-3xl border border-neutral-700/50 hover:bg-neutral-800 transition-colors">
                        <div className="mb-6 text-neutral-300 leading-relaxed italic">"{review.quote}"</div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center font-bold text-sm">
                                {review.author.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold">{review.author}</div>
                                <div className="text-sm text-neutral-500">{review.role}</div>
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
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
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
                    <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                        <h3 className="font-bold text-lg text-neutral-900 mb-2 flex items-start gap-3">
                            <span className="text-neutral-300">0{i+1}.</span> {faq.q}
                        </h3>
                        <p className="text-neutral-600 leading-relaxed pl-10">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-white px-6">
         <div className="max-w-5xl mx-auto bg-neutral-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-neutral-900/20 overflow-hidden relative">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to launch your career?</h2>
                <p className="text-neutral-400 text-xl mb-10 max-w-2xl mx-auto">Join thousands of professionals who have built their resumes with Resubuild.</p>
                <Button 
                  onClick={() => handleAction('signup')} 
                  className="bg-white text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 px-10 py-4 h-auto text-lg rounded-full font-bold border-0"
                >
                  Build Resume Now
                </Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-100 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-bold tracking-tight">Resubuild</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
              <a href="#" className="hover:text-neutral-900">Privacy</a>
              <a href="#" className="hover:text-neutral-900">Terms</a>
              <a href="#" className="hover:text-neutral-900">Contact</a>
          </div>
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Resubuild. Built for the modern professional.
          </p>
        </div>
      </footer>
    </div>
  );
};
