
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, Bot, User, CheckCircle2, Zap, Target, Wand2, Feather, PenTool, Download } from 'lucide-react';

export const ResupilotDemo: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [chatText, setChatText] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  // Simulation Script Constants
  const PROMPT_TEXT = "I'm a Senior Product Designer with 5 years experience. I specialize in Figma, UI/UX, and design systems. Worked at Spotify and Airbnb.";
  const CHAT_CMD_TEXT = "Make the summary more punchy and add 'Prototyping' to skills.";
  
  // Timings (ms)
  // 0-5s: Intro
  // 5-15s: Typing Prompt
  // 15-20s: Generating
  // 20-30s: Workspace Appears & Idle
  // 30-45s: Chat Typing
  // 45-55s: AI Responding/Updating
  // 55-65s: Grammar Check Interaction
  // 65-80s: Audit Interaction
  // 80-95s: Cover Letter Interaction
  // 95-110s: Export

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scriptStart = Date.now();

    const runSequence = async () => {
      const setPhaseAt = (p: number, delay: number) => {
          setTimeout(() => setPhase(p), delay);
      };

      // Phase 0: Idle Home
      setPhaseAt(1, 2000); // Start typing prompt

      // Typing Prompt (Simulated)
      for (let i = 0; i < PROMPT_TEXT.length; i++) {
        setTimeout(() => {
           setTypedText(PROMPT_TEXT.substring(0, i + 1));
        }, 2000 + (i * 40));
      }

      setPhaseAt(3, 8000); // Click Generate
      setPhaseAt(4, 9000); // Generating Loader
      setPhaseAt(5, 14000); // Workspace Appears

      // Typing Chat Command
      setPhaseAt(6, 18000); 
      for (let i = 0; i < CHAT_CMD_TEXT.length; i++) {
        setTimeout(() => {
           setChatText(CHAT_CMD_TEXT.substring(0, i + 1));
        }, 18000 + (i * 50));
      }
      
      setPhaseAt(7, 24000); // Send Chat
      setPhaseAt(8, 27000); // AI Updates Resume (Content Change)

      // Grammar Check Sequence
      setPhaseAt(9, 32000); // Mouse moves to grammar bar
      setPhaseAt(10, 34000); // Click "Fix Grammar" -> Spinner
      setPhaseAt(11, 37000); // Grammar Fixed (Flash text)

      // Audit Sequence
      setPhaseAt(12, 42000); // Mouse moves to Audit button
      setPhaseAt(13, 43000); // Open Audit Modal
      setPhaseAt(14, 45000); // Audit Score Reveals
      setPhaseAt(15, 52000); // Close Audit Modal

      // Cover Letter Sequence
      setPhaseAt(16, 54000); // Open Cover Letter Modal
      setPhaseAt(17, 56000); // Typing Job Desc (Instant paste)
      setPhaseAt(18, 58000); // Generating Letter
      setPhaseAt(19, 61000); // Letter Appears
      setPhaseAt(20, 68000); // Close Cover Letter

      // Export
      setPhaseAt(21, 70000); // Click Export
      
      // Reset Loop
      setTimeout(() => {
          setPhase(0);
          setTypedText('');
          setChatText('');
          runSequence();
      }, 75000); 
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto bg-neutral-900 rounded-3xl p-2 md:p-4 shadow-2xl shadow-neutral-900/50 ring-1 ring-white/10 relative overflow-hidden">
        {/* Browser Chrome */}
        <div className="h-8 flex items-center gap-2 px-4 mb-2 opacity-50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Main Viewport */}
        <div className="relative bg-white rounded-xl h-[450px] md:h-[650px] overflow-hidden w-full font-sans">
            
            {/* --- SCENE 1: HOME (Vibe Create) --- */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${phase >= 4 ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                 {/* Animated Background Blobs */}
                 <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl animate-float"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl animate-float-delayed"></div>
                 
                 <div className="relative z-10 w-full max-w-xl text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold mb-6 shadow-lg">
                        <Sparkles className="w-3 h-3" /> Resupilot AI
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">What do you want to create?</h2>
                    
                    {/* Input Box */}
                    <div className="relative w-full bg-white rounded-[2rem] shadow-2xl border border-neutral-100 h-40 p-6 text-left text-lg md:text-xl text-neutral-600 leading-relaxed overflow-hidden">
                        {typedText}
                        <span className={`inline-block w-0.5 h-5 bg-neutral-900 ml-1 align-middle ${phase < 3 ? 'animate-blink' : 'opacity-0'}`}></span>
                        
                        {/* Generate Button */}
                        <div className={`absolute bottom-4 right-4 w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white transition-all duration-300 ${phase === 3 ? 'scale-90 bg-blue-600' : 'scale-100'}`}>
                            <ArrowUp className="w-5 h-5" />
                        </div>
                    </div>
                 </div>
            </div>

            {/* --- SCENE 2: LOADING TRANSITION --- */}
            <div className={`absolute inset-0 bg-white z-20 flex items-center justify-center transition-opacity duration-500 ${phase === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
                    <div className="text-neutral-500 font-medium animate-pulse">Generating Profile...</div>
                </div>
            </div>

            {/* --- SCENE 3: WORKSPACE (Split Screen) --- */}
            <div className={`absolute inset-0 bg-neutral-50 flex flex-col transition-all duration-700 transform ${phase >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                
                {/* Header Bar */}
                <div className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 z-30">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-blue-600" /> Workspace
                    </div>
                    <div className="flex items-center gap-2">
                        <button className={`text-xs px-2 py-1 rounded hover:bg-neutral-100 flex items-center gap-1 ${phase >= 13 && phase < 15 ? 'bg-neutral-100' : ''}`}>
                            <Zap className="w-3 h-3" /> AI Audit
                        </button>
                        <button className={`text-xs px-2 py-1 rounded hover:bg-neutral-100 flex items-center gap-1 ${phase >= 16 && phase < 20 ? 'bg-neutral-100' : ''}`}>
                            <PenTool className="w-3 h-3" /> Cover Letter
                        </button>
                         <button className={`text-xs px-2 py-1 rounded bg-neutral-900 text-white flex items-center gap-1 ${phase === 21 ? 'scale-95' : ''}`}>
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Chat */}
                    <div className="w-1/3 border-r border-neutral-200 bg-white flex flex-col">
                        <div className="flex-1 p-4 space-y-4 overflow-hidden">
                            {/* Initial AI Message */}
                            <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-blue-600" /></div>
                                <div className="bg-white border border-neutral-200 p-3 rounded-xl rounded-tl-none text-xs shadow-sm">
                                    I've drafted your Product Designer resume.
                                </div>
                            </div>

                            {/* User Typing Chat */}
                            {(phase >= 6) && (
                                <div className="flex gap-2 flex-row-reverse">
                                    <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-3 h-3 text-white" /></div>
                                    <div className="bg-neutral-900 text-white p-3 rounded-xl rounded-tr-none text-xs shadow-sm">
                                        {chatText}
                                        {phase === 6 && <span className="animate-blink">|</span>}
                                    </div>
                                </div>
                            )}
                            
                            {/* AI Confirmation */}
                            {(phase >= 8) && (
                                <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-blue-600" /></div>
                                    <div className="bg-white border border-neutral-200 p-3 rounded-xl rounded-tl-none text-xs shadow-sm">
                                        Updated! I made the summary stronger.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Resume Preview */}
                    <div className="flex-1 p-6 flex justify-center bg-neutral-100/50 relative overflow-hidden">
                        
                        {/* Floating AI Toolbar */}
                        <div className={`absolute top-4 bg-neutral-900 text-white rounded-full shadow-xl flex items-center gap-1 px-3 py-1.5 z-20 transition-all duration-300 ${phase >= 9 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} ${phase === 10 ? 'scale-95' : 'scale-100'}`}>
                             <div className="flex items-center gap-2 px-2 text-xs font-medium">
                                <Wand2 className={`w-3 h-3 ${phase === 10 ? 'animate-spin' : ''}`} />
                                {phase === 10 ? 'Fixing...' : 'Fix Grammar'}
                             </div>
                             <div className="w-px h-3 bg-neutral-700"></div>
                             <div className="flex items-center gap-2 px-2 text-xs font-medium text-neutral-400">
                                <Feather className="w-3 h-3" /> Tone
                             </div>
                        </div>

                        {/* Resume Sheet */}
                        <div className="w-[90%] h-full bg-white shadow-xl rounded-md p-8 origin-top transform scale-90 md:scale-100 transition-all duration-500">
                            
                            {/* Resume Header */}
                            <div className="flex justify-between items-start border-b pb-4 mb-4">
                                <div>
                                    <div className="h-6 w-48 bg-neutral-900 rounded mb-2"></div> {/* Name */}
                                    <div className="h-4 w-32 bg-neutral-400 rounded"></div> {/* Title */}
                                </div>
                                <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                            </div>

                            {/* Summary Section */}
                            <div className="mb-6 transition-all duration-500 relative">
                                <div className="h-3 w-24 bg-neutral-200 rounded mb-2"></div>
                                {/* Chat Edit Highlight */}
                                <div className={`absolute -inset-2 bg-yellow-100 rounded-lg transition-opacity duration-500 ${phase === 8 ? 'opacity-100' : 'opacity-0'}`}></div>
                                {/* Grammar Fix Highlight */}
                                <div className={`absolute -inset-2 bg-green-100 rounded-lg transition-opacity duration-500 ${phase === 11 ? 'opacity-100' : 'opacity-0'}`}></div>
                                
                                <div className={`space-y-1.5 relative z-10 ${phase >= 8 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                    <div className="h-2 bg-current w-full rounded"></div>
                                    <div className="h-2 bg-current w-11/12 rounded"></div>
                                    <div className="h-2 bg-current w-3/4 rounded"></div>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="mb-6">
                                <div className="h-3 w-24 bg-neutral-200 rounded mb-3"></div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <div className="h-3 w-32 bg-neutral-800 rounded"></div>
                                            <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                                        </div>
                                        <div className="h-2 w-20 bg-neutral-400 rounded mb-2"></div>
                                        <div className="space-y-1">
                                            <div className="h-1.5 bg-neutral-100 w-full rounded"></div>
                                            <div className="h-1.5 bg-neutral-100 w-10/12 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Skills */}
                            <div className="mb-6">
                                <div className="h-3 w-24 bg-neutral-200 rounded mb-3"></div>
                                <div className="flex gap-2 flex-wrap">
                                    <div className="h-5 w-12 bg-neutral-100 rounded"></div>
                                    <div className="h-5 w-16 bg-neutral-100 rounded"></div>
                                    <div className="h-5 w-10 bg-neutral-100 rounded"></div>
                                    <div className={`h-5 w-20 bg-blue-100 rounded transform transition-all duration-300 ${phase >= 8 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                                </div>
                            </div>

                        </div>

                        {/* OVERLAYS */}

                        {/* Audit Modal Overlay */}
                        <div className={`absolute inset-0 bg-neutral-900/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${phase >= 13 && phase < 15 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                             <div className={`bg-white p-6 rounded-2xl shadow-2xl w-64 transform transition-transform duration-500 ${phase >= 14 ? 'scale-100' : 'scale-90'}`}>
                                  <div className="flex items-center gap-3 mb-4">
                                      <Target className="w-6 h-6 text-neutral-900" />
                                      <h3 className="font-bold">Audit Score</h3>
                                  </div>
                                  <div className="flex items-center justify-between">
                                       <span className="text-4xl font-bold text-green-600">92</span>
                                       <div className="text-right text-xs text-neutral-500">
                                           <div>Top 10%</div>
                                           <div>Excellent</div>
                                       </div>
                                  </div>
                                  <div className="mt-4 space-y-2">
                                      <div className="h-2 bg-neutral-100 rounded-full w-full overflow-hidden">
                                          <div className="h-full bg-green-500 w-[92%]"></div>
                                      </div>
                                      <div className="text-xs text-neutral-400">Quantified Impact, Strong Verbs</div>
                                  </div>
                             </div>
                        </div>

                        {/* Cover Letter Overlay */}
                        <div className={`absolute inset-0 bg-neutral-900/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${phase >= 16 && phase < 20 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                             <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 h-96 flex flex-col">
                                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
                                      <PenTool className="w-4 h-4 text-blue-600" />
                                      <h3 className="font-bold text-sm">Cover Letter AI</h3>
                                  </div>
                                  {phase < 18 && (
                                      <div className="space-y-2">
                                          <div className="h-8 bg-neutral-100 rounded border border-neutral-200 w-full"></div>
                                          <div className="h-24 bg-neutral-100 rounded border border-neutral-200 w-full flex p-2">
                                              {phase >= 17 && <span className="w-full h-full bg-neutral-200 animate-pulse rounded"></span>}
                                          </div>
                                      </div>
                                  )}
                                  {phase >= 18 && phase < 19 && (
                                       <div className="flex-1 flex items-center justify-center">
                                           <Sparkles className="w-8 h-8 text-neutral-900 animate-pulse" />
                                       </div>
                                  )}
                                  {phase >= 19 && (
                                      <div className="flex-1 space-y-2 overflow-hidden animate-in fade-in">
                                          <div className="h-2 bg-neutral-200 w-1/3 rounded"></div>
                                          <div className="h-2 bg-neutral-100 w-full rounded"></div>
                                          <div className="h-2 bg-neutral-100 w-full rounded"></div>
                                          <div className="h-2 bg-neutral-100 w-5/6 rounded"></div>
                                          <div className="h-2 bg-neutral-100 w-full rounded"></div>
                                          <div className="mt-4 p-2 bg-blue-50 text-blue-800 text-[10px] rounded border border-blue-100">
                                              Tailored to Spotify's design culture...
                                          </div>
                                      </div>
                                  )}
                             </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Timeline / Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-[75000ms] ease-linear w-full" style={{ width: phase === 0 ? '0%' : '100%' }}></div>
        </div>
    </div>
  );
};
