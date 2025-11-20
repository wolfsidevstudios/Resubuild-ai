import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, Bot, User, CheckCircle2, Zap, Target } from 'lucide-react';

export const ResupilotDemo: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [chatText, setChatText] = useState('');

  // Simulation Script Constants
  const PROMPT_TEXT = "I'm a Senior Product Designer with 5 years experience. I specialize in Figma, UI/UX, and design systems. Worked at Spotify and Airbnb.";
  const CHAT_CMD_TEXT = "Make the summary more punchy and add 'Prototyping' to skills.";
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runSequence = async () => {
      // Phase 0: Idle Home (0s)
      
      // Phase 1: Start Typing Prompt (1s)
      timeout = setTimeout(() => setPhase(1), 1000);
      
      // Phase 2: Simulate Typing (1s - 4s)
      let currentText = '';
      for (let i = 0; i < PROMPT_TEXT.length; i++) {
        const delay = 1000 + (i * 30); // Typing speed
        setTimeout(() => {
           currentText += PROMPT_TEXT[i];
           setTypedText(currentText);
        }, delay);
      }

      // Phase 3: Click Generate (4.5s)
      setTimeout(() => setPhase(3), 4500);

      // Phase 4: Loading / Transition (5s)
      setTimeout(() => setPhase(4), 5000);

      // Phase 5: Workspace Appears (7s)
      setTimeout(() => setPhase(5), 7000);

      // Phase 6: Type Chat Command (9s)
      setTimeout(() => setPhase(6), 9000);
      let currentChat = '';
      for (let i = 0; i < CHAT_CMD_TEXT.length; i++) {
        const delay = 9000 + (i * 40);
        setTimeout(() => {
           currentChat += CHAT_CMD_TEXT[i];
           setChatText(currentChat);
        }, delay);
      }

      // Phase 7: Send Chat (12s)
      setTimeout(() => setPhase(7), 12000);

      // Phase 8: Resume Updates (14s)
      setTimeout(() => setPhase(8), 14000);

      // Phase 9: Show Audit Score (16s)
      setTimeout(() => setPhase(9), 16000);

      // Reset (22s)
      setTimeout(() => {
          setPhase(0);
          setTypedText('');
          setChatText('');
          runSequence(); // Loop
      }, 22000);
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
        <div className="relative bg-white rounded-xl h-[400px] md:h-[600px] overflow-hidden w-full">
            
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
            <div className={`absolute inset-0 bg-neutral-50 flex transition-all duration-700 transform ${phase >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                
                {/* Left: Chat */}
                <div className="w-1/3 border-r border-neutral-200 bg-white flex flex-col">
                     <div className="h-14 border-b border-neutral-100 flex items-center px-4 gap-2">
                         <Sparkles className="w-4 h-4 text-blue-600" />
                         <span className="font-bold text-sm">Workspace</span>
                     </div>
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
                                    Updated! I made the summary stronger and added Prototyping.
                                </div>
                            </div>
                         )}
                     </div>
                </div>

                {/* Right: Resume Preview */}
                <div className="flex-1 p-6 flex justify-center bg-neutral-100/50 relative overflow-hidden">
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
                             {/* Highlight flash on update */}
                             <div className={`absolute -inset-2 bg-yellow-100 rounded-lg transition-opacity duration-500 ${phase === 8 ? 'opacity-100' : 'opacity-0'}`}></div>
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
                                  <div>
                                     <div className="flex justify-between mb-1">
                                         <div className="h-3 w-24 bg-neutral-800 rounded"></div>
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
                         
                          {/* Skills - Pop in animation */}
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

                    {/* Audit Score Overlay */}
                    <div className={`absolute top-6 right-6 bg-white p-3 rounded-xl shadow-2xl border border-neutral-100 flex items-center gap-3 transition-all duration-500 ${phase >= 9 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                         <div className="relative w-12 h-12 flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-neutral-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                  <path className="text-green-500" strokeDasharray="95, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                             </svg>
                             <span className="absolute text-xs font-bold">95</span>
                         </div>
                         <div>
                             <div className="text-xs font-bold uppercase text-neutral-400">Audit Score</div>
                             <div className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Excellent</div>
                         </div>
                    </div>

                </div>
            </div>
        </div>

        {/* Timeline / Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-[22000ms] ease-linear w-full" style={{ width: phase === 0 ? '0%' : '100%' }}></div>
    </div>
  );
};