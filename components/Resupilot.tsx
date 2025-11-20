
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, X, Save, Send, Bot, User } from 'lucide-react';
import { generateResumeFromPrompt } from '../services/geminiService';
import { saveResume } from '../services/storageService';
import { ResumeData } from '../types';
import { ResumePreview } from './ResumePreview';
import { Button } from './Button';
import { Input } from './InputField';

interface ResupilotProps {
    userId: string;
    onExit: () => void;
    onSave: (resume: ResumeData) => void;
}

export const Resupilot: React.FC<ResupilotProps> = ({ userId, onExit, onSave }) => {
    const [view, setView] = useState<'home' | 'workspace'>('home');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
    const [chatHistory, setChatHistory] = useState<{role: 'ai' | 'user', content: string}[]>([
        { role: 'ai', content: "I've created a first draft based on your request. What would you like to tweak? You can say things like 'Make the summary more punchy' or 'Add Figma to my skills'." }
    ]);
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const data = await generateResumeFromPrompt(prompt);
            setCurrentResume(data);
            setView('workspace');
        } catch (error) {
            alert("Failed to generate resume. Please check your API key.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !currentResume) return;

        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        
        // Simulate AI processing for now (In a real app, we would call an 'updateResume' AI endpoint)
        // For this demo, we'll add a placeholder response or re-run generation if the user asks for a total rewrite
        setTimeout(async () => {
             setChatHistory(prev => [...prev, { role: 'ai', content: "I'm refining the resume based on that feedback... (Note: In this demo version, conversational editing uses the initial generation logic. Try asking for a completely new role to see changes!)" }]);
             
             // Re-generate contextually for demo purposes
             try {
                 const newData = await generateResumeFromPrompt(`${prompt}. Feedback: ${userMsg}`);
                 setCurrentResume(newData);
             } catch(e) {
                 console.error(e);
             }
        }, 1000);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, view]);

    const handleSaveAndExit = () => {
        if (currentResume) {
            saveResume(currentResume, userId);
            onSave(currentResume);
        }
    };

    // --- HOME VIEW (Vibe Create) ---
    if (view === 'home') {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
                
                {/* Animated Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>

                <button 
                    onClick={onExit} 
                    className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full z-20"
                >
                    <X className="w-6 h-6 text-neutral-500" />
                </button>

                <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-bold mb-8 shadow-lg shadow-blue-200/50">
                        <Sparkles className="w-4 h-4" /> Resupilot AI
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-neutral-900">
                        What do you want to create?
                    </h2>
                    <p className="text-xl text-neutral-500 mb-12 max-w-2xl">
                        Describe your dream role, your experience, or paste your LinkedIn about section. We'll vibe create the rest.
                    </p>

                    <form onSubmit={handleInitialSubmit} className="w-full relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. I'm a Senior Marketing Manager with 7 years experience at tech startups. I specialize in growth and SEO..."
                            className="w-full h-48 p-8 text-xl bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-200/50 border border-neutral-100 focus:ring-2 focus:ring-neutral-900 focus:outline-none resize-none leading-relaxed"
                        />
                        
                        <button 
                            type="submit"
                            disabled={!prompt.trim() || isGenerating}
                            className="absolute bottom-6 right-6 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg"
                        >
                            {isGenerating ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <ArrowUp className="w-6 h-6" />
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {["Software Engineer at Google", "Marketing Director", "New Grad Nurse"].map(ex => (
                            <button 
                                key={ex} 
                                onClick={() => setPrompt(ex)}
                                className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-full text-sm text-neutral-500 border border-neutral-200 transition-colors"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- WORKSPACE VIEW (Split Screen) ---
    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-sm z-20">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-lg">Resupilot Workspace</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={onExit}>Discard</Button>
                    <Button onClick={handleSaveAndExit} icon={<Save className="w-4 h-4" />}>Save to Dashboard</Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Chat Interface */}
                <div className="w-full md:w-[450px] bg-white border-r border-neutral-200 flex flex-col z-10 shadow-xl">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-neutral-900 text-white'}`}>
                                    {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm' : 'bg-neutral-900 text-white rounded-tr-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-4 bg-white border-t border-neutral-200">
                        <form onSubmit={handleChatSubmit} className="relative">
                            <input 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask for changes..."
                                className="w-full pl-4 pr-12 py-3 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors">
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Resume Preview */}
                <div className="flex-1 bg-neutral-200/50 overflow-auto custom-scrollbar p-8 flex justify-center">
                    {currentResume && (
                        <div className="pointer-events-none md:pointer-events-auto scale-[0.65] md:scale-90 origin-top transition-transform">
                            <ResumePreview data={currentResume} previewRef={previewRef} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
