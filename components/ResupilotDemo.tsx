
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, Bot, User, Zap, Target, Wand2, Feather, Download, MousePointer2, CheckCircle2, ScanLine, Layout, MessageSquare, PenTool, FileText } from 'lucide-react';

export const ResupilotDemo: React.FC = () => {
  const [phase, setPhase] = useState(0); 
  const [textInput, setTextInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  
  // Animation State
  const [mousePos, setMousePos] = useState({ x: 110, y: 110 }); // Start off screen
  const [isClicking, setIsClicking] = useState(false);
  
  // UI States for Demo
  const [showScanLine, setShowScanLine] = useState(false);
  const [scoreRevealed, setScoreRevealed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'ai'|'user', text: string}[]>([
      { role: 'ai', text: "I've drafted your resume. It includes a strong summary and your Figma experience." }
  ]);

  const PROMPT_1 = "Product Designer. 5y exp. Figma.";
  const PROMPT_2 = "Add React skills.";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const runSequence = async () => {
      const setMouse = (x: number, y: number, delay: number) => {
          const t = setTimeout(() => setMousePos({ x, y }), delay);
          timeouts.push(t);
      };
      const clickMouse = (delay: number) => {
          const t1 = setTimeout(() => setIsClicking(true), delay);
          const t2 = setTimeout(() => setIsClicking(false), delay + 200);
          timeouts.push(t1, t2);
      };
      const scene = (p: number, delay: number) => {
          const t = setTimeout(() => setPhase(p), delay);
          timeouts.push(t);
      };
      const typeText = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, startDelay: number) => {
           const t = setTimeout(() => {
                let current = "";
                text.split("").forEach((char, i) => {
                    setTimeout(() => setter(prev => prev + char), i * 50);
                });
           }, startDelay);
           timeouts.push(t);
      };

      // --- TIMELINE START (Total ~55s) ---
      
      // 0s: INTRO SCENES
      scene(1, 0);    // "Stop Formatting"
      scene(2, 2000); // "Start Creating"
      
      // --- SECTION 1: VIBE CREATE ---
      scene(3, 4000); // Title: "Vibe Create"
      scene(4, 6000); // Action: Input Box
      
      setMouse(50, 60, 6500); // Hover Input
      clickMouse(6800); // Click Input
      typeText(PROMPT_1, setTextInput, 7000); // Type Prompt
      
      setMouse(88, 76, 9000); // Hover Generate Button (Bottom Right of Input)
      clickMouse(9500); // Click Generate
      
      scene(5, 9800); // Transition/Loading
      
      // --- SECTION 2: AI CHAT ---
      scene(6, 11500); // Title: "AI Chat"
      scene(7, 13500); // Action: Workspace (Chat Focus)
      
      setMouse(15, 88, 14500); // Hover Chat Input (Bottom Left Sidebar)
      clickMouse(14800);
      typeText(PROMPT_2, setChatInput, 15000);
      
      setMouse(26, 88, 16500); // Hover Send Button (Next to chat input)
      clickMouse(17000);
      
      // Simulate Chat Response
      setTimeout(() => {
          setChatInput('');
          setChatMessages(prev => [...prev, { role: 'user', text: PROMPT_2 }]);
          setTimeout(() => {
              setChatMessages(prev => [...prev, { role: 'ai', text: "Done. I've added React and updated your skills section." }]);
          }, 1000);
      }, 17200);

      // --- SECTION 3: AI AUDIT ---
      scene(8, 19500); // Title: "AI Audit"
      scene(9, 21500); // Action: Workspace (Header Focus)
      
      setMouse(68, 7, 22500); // Hover Audit Button (Header Top Right-ish)
      clickMouse(23000);
      
      setTimeout(() => setShowScanLine(true), 23200); 
      setTimeout(() => { setShowScanLine(false); setScoreRevealed(true); }, 25000);
      
      setMouse(90, 15, 26000); // Move away to see score
      
      // --- SECTION 4: SMART POLISH ---
      scene(10, 27500); // Title: "Smart Polish"
      scene(11, 29500); // Action: Workspace (Preview Focus)
      
      setMouse(58, 18, 30500); // Hover "Fix Grammar" (Floating Pill)
      clickMouse(31000);
      
      setTimeout(() => setShowRipple(true), 31100);
      setTimeout(() => setShowRipple(false), 32000);
      
      // --- SECTION 5: COVER LETTER ---
      scene(12, 33000); // Title: "Cover Letter"
      scene(13, 35000); // Action: Workspace
      
      setMouse(78, 7, 36000); // Hover Cover Letter Button (Header)
      clickMouse(36500);
      
      setTimeout(() => setShowCoverModal(true), 36600);
      
      setMouse(50, 65, 37500); // Hover "Generate" in Modal
      clickMouse(38000);
      
      setTimeout(() => setShowCoverModal(false), 39000); // Close modal

      // --- SECTION 6: EXPORT ---
      scene(14, 40000); // Title: "Instant Export"
      scene(15, 42000); // Action: Workspace
      
      setMouse(92, 7, 43000); // Hover Export Button (Header Far Right)
      clickMouse(43500);
      
      setTimeout(() => setShowConfetti(true), 43600);
      
      // --- OUTRO ---
      scene(16, 45500); // "Your best work"
      scene(17, 48000); // "Resubuild"

      // --- LOOP ---
      const loopT = setTimeout(() => {
          setPhase(0);
          setTextInput('');
          setChatInput('');
          setChatMessages([{ role: 'ai', text: "I've drafted your resume. It includes a strong summary and your Figma experience." }]);
          setMousePos({ x: 110, y: 110 });
          setScoreRevealed(false);
          setShowScanLine(false);
          setShowCoverModal(false);
          setShowConfetti(false);
          runSequence();
      }, 52000);
      timeouts.push(loopT);
    };

    runSequence();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto aspect-video md:aspect-[16/9] bg-neutral-900 rounded-3xl shadow-2xl shadow-neutral-900/50 ring-1 ring-white/10 relative overflow-hidden select-none cursor-none font-sans group">
        
        {/* Browser Chrome */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-neutral-800/90 backdrop-blur-md z-[60] flex items-center px-4 gap-2 border-b border-white/5">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center text-xs text-neutral-500 font-mono ml-4 opacity-50">resubuild.com/demo</div>
        </div>

        {/* === TITLES & TEXT (White Layer) === */}
        <div className={`absolute inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-500 ${[1,2,3,6,8,10,12,14,16,17].includes(phase) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="text-center px-6">
                 {phase === 1 && <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-neutral-900 animate-in slide-in-from-bottom-8 fade-in duration-700">Stop Formatting.</h1>}
                 {phase === 2 && <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-neutral-900 animate-in slide-in-from-bottom-8 fade-in duration-700">Start Creating.</h1>}
                 
                 {/* Feature Titles */}
                 {[
                     { p: 3, icon: Sparkles, title: "Vibe Create", sub: "Text to Resume. Instantly.", color: "blue" },
                     { p: 6, icon: MessageSquare, title: "AI Chat", sub: "Refine with natural language.", color: "indigo" },
                     { p: 8, icon: Target, title: "AI Audit", sub: "Real-time scoring & feedback.", color: "green" },
                     { p: 10, icon: Wand2, title: "Smart Polish", sub: "Fix grammar & tone in one click.", color: "purple" },
                     { p: 12, icon: PenTool, title: "Cover Letter", sub: "Tailored letters for every job.", color: "pink" },
                     { p: 14, icon: Download, title: "Instant Export", sub: "ATS-Ready PDF Download.", color: "orange" },
                 ].map(item => phase === item.p && (
                     <div key={item.p} className="animate-in zoom-in-90 fade-in duration-500">
                         <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${item.color}-50 text-${item.color}-600 text-sm font-bold mb-6`}>
                             <item.icon className="w-4 h-4" /> Feature
                         </div>
                         <h1 className="text-6xl md:text-8xl font-bold text-neutral-900 tracking-tight">{item.title}</h1>
                         <p className="text-xl text-neutral-500 mt-4">{item.sub}</p>
                     </div>
                 ))}

                 {/* Outro */}
                 {phase === 16 && <h1 className="text-6xl md:text-8xl font-bold text-neutral-900 animate-in zoom-in-90 fade-in duration-500">Your best work.</h1>}
                 {phase === 17 && (
                     <div className="animate-in zoom-in-90 fade-in duration-500">
                        <h1 className="text-6xl md:text-8xl font-bold text-neutral-900 mb-4">Resubuild.</h1>
                        <div className="flex items-center justify-center gap-2 text-neutral-400 text-xl tracking-widest uppercase">
                            <Bot className="w-5 h-5" /> AI Powered
                        </div>
                     </div>
                 )}
             </div>
        </div>

        {/* === SCENE: INPUT (Phase 4) === */}
        <div className={`absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center transition-all duration-700 ${phase === 4 || phase === 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
             <div className="w-full max-w-2xl px-8 relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-neutral-900 text-center">Describe your role.</h2>
                
                <div className="relative w-full bg-white rounded-[2rem] shadow-2xl border border-neutral-200 h-40 p-8 text-2xl text-neutral-800 leading-relaxed overflow-hidden">
                    <span className="text-neutral-900">{textInput}</span>
                    <span className="inline-block w-0.5 h-6 bg-blue-600 ml-1 animate-blink"></span>
                    
                    {/* Generate Button */}
                    <div className={`absolute bottom-4 right-4 w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white transition-all duration-300 ${phase === 5 ? 'scale-90 bg-blue-600' : 'scale-100'}`}>
                         {phase === 5 ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowUp className="w-6 h-6" />}
                    </div>
                </div>
             </div>
        </div>

        {/* === SCENE: WORKSPACE (Phases 7, 9, 11, 13, 15) === */}
        <div className={`absolute inset-0 bg-neutral-100 pt-10 flex flex-col transition-all duration-700 ${[7,9,11,13,15].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
             
             {/* HEADER */}
             <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
                 <div className="flex items-center gap-2 font-bold text-neutral-900">
                     <Sparkles className="w-4 h-4 text-blue-600" /> Workspace
                 </div>
                 
                 {/* Header Buttons for Interaction */}
                 <div className="flex items-center gap-3">
                     <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${phase === 9 ? 'bg-neutral-900 text-white scale-105 ring-4 ring-neutral-200' : 'bg-neutral-100 text-neutral-600'}`}>
                         <Target className="w-3 h-3" /> Audit
                     </div>
                     <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${phase === 13 ? 'bg-neutral-900 text-white scale-105 ring-4 ring-neutral-200' : 'bg-neutral-100 text-neutral-600'}`}>
                         <PenTool className="w-3 h-3" /> Letter
                     </div>
                     <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${phase === 15 ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-neutral-900 text-white'}`}>
                         <Download className="w-3 h-3" /> Export
                     </div>
                 </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                 {/* CHAT SIDEBAR */}
                 <div className={`w-72 bg-white border-r border-neutral-200 flex flex-col shrink-0 transition-all duration-500 ${phase === 7 ? 'translate-x-0' : '-translate-x-0'}`}>
                      <div className="flex-1 p-4 space-y-4 overflow-hidden">
                          {chatMessages.map((m, i) => (
                              <div key={i} className={`flex gap-3 animate-in slide-in-from-bottom-2 fade-in ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-neutral-900 text-white'}`}>
                                      {m.role === 'ai' ? <Bot className="w-3 h-3"/> : <User className="w-3 h-3"/>}
                                  </div>
                                  <div className={`p-2.5 rounded-2xl text-xs max-w-[80%] ${m.role === 'ai' ? 'bg-neutral-100 text-neutral-700 rounded-tl-none' : 'bg-neutral-900 text-white rounded-tr-none'}`}>
                                      {m.text}
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                      {/* Chat Input Area */}
                      <div className="p-3 border-t border-neutral-100 relative">
                          <div className="bg-neutral-100 h-10 rounded-full flex items-center px-3 overflow-hidden">
                              <span className="text-xs text-neutral-800 whitespace-nowrap">{chatInput}</span>
                              {phase === 7 && !chatInput && <span className="w-0.5 h-3 bg-blue-600 animate-blink ml-1"></span>}
                          </div>
                          <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center text-white transition-transform ${chatInput ? 'scale-100' : 'scale-0'}`}>
                              <ArrowUp className="w-3 h-3" />
                          </div>
                      </div>
                 </div>

                 {/* PREVIEW AREA */}
                 <div className="flex-1 bg-neutral-100/50 p-8 relative flex justify-center overflow-hidden">
                      
                      {/* Floating AI Toolbar (Phase 11) */}
                      <div className={`absolute top-6 z-30 transition-all duration-500 ${phase === 11 ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
                           <div className="bg-neutral-900 text-white rounded-full shadow-xl flex items-center gap-1 px-1 py-1 pr-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-800 rounded-full relative overflow-hidden group">
                                    <Wand2 className="w-3 h-3" /> Fix Grammar
                                    {showRipple && <div className="absolute inset-0 bg-white/40 animate-ping rounded-full"></div>}
                                </div>
                                <div className="w-px h-3 bg-neutral-700 mx-1"></div>
                                <span className="text-xs text-neutral-400">Tone Polish</span>
                           </div>
                       </div>

                      {/* Mock Resume */}
                      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 transform scale-95 origin-top border border-neutral-200/50 relative">
                           {/* Confetti Overlay */}
                           {showConfetti && (
                               <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
                                   {[...Array(20)].map((_, i) => (
                                       <div key={i} className="absolute w-2 h-2 bg-blue-500 rounded-full animate-float" style={{ left: `${Math.random()*100}%`, top: '-10px', animationDelay: `${Math.random()}s`, backgroundColor: ['#3b82f6', '#a855f7', '#22c55e'][Math.floor(Math.random()*3)] }}></div>
                                   ))}
                               </div>
                           )}

                           {/* Resume Content */}
                           <div className="flex justify-between mb-8 border-b border-neutral-100 pb-6">
                               <div className="space-y-2">
                                   <div className="h-6 w-48 bg-neutral-900 rounded-md"></div>
                                   <div className="h-4 w-32 bg-neutral-400 rounded-md"></div>
                               </div>
                               <div className="h-12 w-12 bg-neutral-100 rounded-full"></div>
                           </div>
                           
                           {/* Summary with Polish Effect */}
                           <div className="mb-8 space-y-2 relative group">
                                <div className={`absolute -inset-2 bg-blue-50/50 rounded-lg transition-opacity duration-500 ${showRipple ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className="h-3 w-24 bg-neutral-200 rounded mb-3"></div>
                                <div className="h-2 w-full bg-neutral-600 rounded"></div>
                                <div className="h-2 w-11/12 bg-neutral-600 rounded"></div>
                                <div className="h-2 w-10/12 bg-neutral-600 rounded"></div>
                           </div>

                           <div className="space-y-6">
                               {[1,2].map(i => (
                                   <div key={i}>
                                       <div className="flex justify-between mb-2">
                                           <div className="h-3 w-32 bg-neutral-900 rounded"></div>
                                           <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                                       </div>
                                       <div className="space-y-1.5">
                                           <div className="h-2 w-full bg-neutral-100 rounded"></div>
                                           <div className="h-2 w-11/12 bg-neutral-100 rounded"></div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                      </div>

                      {/* Scan Overlay (Phase 9) */}
                      {showScanLine && (
                          <div className="absolute inset-0 z-30 pointer-events-none">
                              <div className="w-full h-1 bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-scan"></div>
                              <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay"></div>
                          </div>
                      )}

                      {/* Score Overlay (Phase 9) */}
                      {phase === 9 && scoreRevealed && (
                          <div className="absolute top-20 right-10 z-40 animate-in zoom-in-95 duration-300">
                               <div className="bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 text-center w-40">
                                    <div className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Score</div>
                                    <div className="text-4xl font-bold text-neutral-900 mb-2">92</div>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold">
                                        <CheckCircle2 className="w-3 h-3" /> Great
                                    </div>
                               </div>
                          </div>
                      )}

                      {/* Cover Letter Modal (Phase 13) */}
                      {showCoverModal && (
                          <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-900/10 backdrop-blur-sm animate-in fade-in">
                              <div className="bg-white w-80 p-6 rounded-2xl shadow-2xl animate-in zoom-in-95">
                                  <div className="flex items-center gap-2 mb-4 font-bold text-sm">
                                      <PenTool className="w-4 h-4 text-pink-500"/> Generate Letter
                                  </div>
                                  <div className="space-y-3 mb-6">
                                      <div className="h-8 bg-neutral-100 rounded-lg w-full"></div>
                                      <div className="h-24 bg-neutral-100 rounded-lg w-full"></div>
                                  </div>
                                  <div className="h-10 bg-neutral-900 rounded-full w-full flex items-center justify-center text-white text-xs font-bold">
                                      Generate
                                  </div>
                              </div>
                          </div>
                      )}
                 </div>
             </div>
        </div>

        {/* === MOUSE CURSOR === */}
        <div 
            className="absolute w-8 h-8 z-[100] pointer-events-none transition-all duration-500 ease-out"
            style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        >
            {isClicking && <div className="absolute inset-0 -left-2 -top-2 w-12 h-12 border-2 border-neutral-900/30 rounded-full animate-ping"></div>}
            <MousePointer2 className="w-6 h-6 text-neutral-900 fill-white drop-shadow-2xl" />
        </div>

        {/* Timeline Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-blue-600 z-[100] transition-all duration-[55000ms] ease-linear" style={{ width: phase === 0 ? '0%' : '100%' }}></div>
    </div>
  );
};
