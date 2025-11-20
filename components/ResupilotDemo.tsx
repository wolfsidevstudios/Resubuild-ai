
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, Bot, User, Zap, Target, Wand2, Feather, PenTool, Download, MousePointer2 } from 'lucide-react';

export const ResupilotDemo: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [chatText, setChatText] = useState('');
  
  // Mouse Cursor Position State (x, y in percentage)
  const [mousePos, setMousePos] = useState({ x: 90, y: 90 });
  const [isClicking, setIsClicking] = useState(false);

  // Simulation Script Constants
  const PROMPT_TEXT = "I'm a Senior Product Designer with 5 years experience. I specialize in Figma, UI/UX, and design systems.";
  const CHAT_CMD_TEXT = "Make the summary more punchy and add 'Prototyping' to skills.";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runSequence = async () => {
      const moveTo = (x: number, y: number, delay: number, duration = 500) => {
          setTimeout(() => setMousePos({ x, y }), delay);
      };
      const click = (delay: number) => {
          setTimeout(() => setIsClicking(true), delay);
          setTimeout(() => setIsClicking(false), delay + 200);
      };
      const setPhaseAt = (p: number, delay: number) => {
          setTimeout(() => setPhase(p), delay);
      };

      // === START SEQUENCE ===
      
      // Phase 0: Idle Home
      // Move Mouse to Input
      moveTo(50, 60, 1000);
      click(1500);

      setPhaseAt(1, 1800); // Start typing prompt

      // Typing Prompt Simulation
      for (let i = 0; i < PROMPT_TEXT.length; i++) {
        setTimeout(() => {
           setTypedText(PROMPT_TEXT.substring(0, i + 1));
        }, 2000 + (i * 30));
      }

      // Move to Generate Button
      moveTo(85, 80, 5000);
      click(5500);
      setPhaseAt(3, 5500); // Button State Change

      setPhaseAt(4, 6500); // Generate Loader
      setPhaseAt(5, 9000); // Workspace Appears

      // Chat Edit Sequence
      // Move to Chat Input
      moveTo(20, 90, 10000);
      click(10500);
      setPhaseAt(6, 10600); // Focus Chat

      // Type Chat Command
      for (let i = 0; i < CHAT_CMD_TEXT.length; i++) {
        setTimeout(() => {
           setChatText(CHAT_CMD_TEXT.substring(0, i + 1));
        }, 11000 + (i * 40));
      }

      // Click Send
      moveTo(30, 90, 14000);
      click(14500);
      setPhaseAt(7, 14500); // Message Sent
      setPhaseAt(8, 17000); // AI Response & Resume Update

      // Grammar Fix Sequence
      moveTo(60, 15, 19000); // Move to Toolbar
      click(19500); // Click Fix
      setPhaseAt(10, 19500); // Fixing State
      setPhaseAt(11, 21500); // Fixed

      // Audit Sequence
      moveTo(55, 5, 23000); // Move to Audit Button
      click(23500);
      setPhaseAt(13, 23500); // Open Audit
      setPhaseAt(14, 25000); // Reveal Score
      moveTo(90, 5, 28000); // Move away to close (simulated)
      click(28500);
      setPhaseAt(15, 28500); // Close Audit

      // Export Sequence
      moveTo(90, 5, 29000); // Move to Export
      click(29500);
      setPhaseAt(21, 29500); // Export Action

      // Reset Loop
      setTimeout(() => {
          setPhase(0);
          setTypedText('');
          setChatText('');
          setMousePos({ x: 90, y: 90 });
          runSequence();
      }, 34000); 
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto bg-neutral-900 rounded-3xl p-2 md:p-4 shadow-2xl shadow-neutral-900/50 ring-1 ring-white/10 relative overflow-hidden select-none cursor-none">
        {/* Browser Chrome */}
        <div className="h-8 flex items-center gap-2 px-4 mb-2 opacity-50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Main Viewport */}
        <div className="relative bg-white rounded-xl h-[450px] md:h-[600px] overflow-hidden w-full font-sans">
            
            {/* --- SCENE 1: HOME (Vibe Create) --- */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${phase >= 4 ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
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
                         <button className={`text-xs px-2 py-1 rounded bg-neutral-900 text-white flex items-center gap-1 ${phase === 21 ? 'scale-95' : ''}`}>
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Chat */}
                    <div className="w-1/3 border-r border-neutral-200 bg-white flex flex-col">
                        <div className="flex-1 p-4 space-y-4 overflow-hidden">
                            <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-blue-600" /></div>
                                <div className="bg-white border border-neutral-200 p-3 rounded-xl rounded-tl-none text-xs shadow-sm">
                                    I've drafted your Product Designer resume.
                                </div>
                            </div>

                            {(phase >= 7) && (
                                <div className="flex gap-2 flex-row-reverse">
                                    <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-3 h-3 text-white" /></div>
                                    <div className="bg-neutral-900 text-white p-3 rounded-xl rounded-tr-none text-xs shadow-sm">
                                        {chatText}
                                    </div>
                                </div>
                            )}
                            
                            {(phase >= 8) && (
                                <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-blue-600" /></div>
                                    <div className="bg-white border border-neutral-200 p-3 rounded-xl rounded-tl-none text-xs shadow-sm">
                                        Updated! I made the summary stronger.
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Chat Input */}
                         <div className="p-4 border-t border-neutral-200">
                            <div className="relative">
                                <input 
                                    disabled 
                                    value={phase >= 6 && phase < 7 ? chatText : ''}
                                    placeholder="Type a command..." 
                                    className="w-full bg-neutral-100 rounded-full px-4 py-2 text-xs" 
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-900 rounded-full p-1"><ArrowUp className="w-3 h-3 text-white" /></button>
                            </div>
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
                                {/* Highlights */}
                                <div className={`absolute -inset-2 bg-yellow-100 rounded-lg transition-opacity duration-500 ${phase === 8 ? 'opacity-100' : 'opacity-0'}`}></div>
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
                                    <div className={`h-5 w-20 bg-blue-100 rounded transform transition-all duration-300 ${phase >= 8 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Overlay */}
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
                                  </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOUSE CURSOR SIMULATION */}
            <div 
                className="absolute w-6 h-6 pointer-events-none z-50 transition-all duration-500 ease-in-out"
                style={{ 
                    left: `${mousePos.x}%`, 
                    top: `${mousePos.y}%`,
                }}
            >
                 {/* Ripple effect on click */}
                 {isClicking && (
                     <div className="absolute inset-0 -left-2 -top-2 w-10 h-10 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
                 )}
                <MousePointer2 className="w-6 h-6 text-black fill-white drop-shadow-lg" />
            </div>

            {/* Timeline Progress */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-[34000ms] ease-linear w-full" style={{ width: phase === 0 ? '0%' : '100%' }}></div>
        </div>
    </div>
  );
};
