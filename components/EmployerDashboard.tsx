
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, MessageSquare, LogOut, Sparkles, User, ChevronRight, Send } from 'lucide-react';
import { supabase, fetchPublishedResumes, PublishedResume, getUserProfile } from '../services/supabase';
import { findBestCandidates } from '../services/geminiService';
import { Button } from './Button';
import { Messaging } from './Messaging';
import { Input, TextArea } from './InputField';
import { ResumePreview } from './ResumePreview';

interface EmployerDashboardProps {
    userId: string;
    onHome: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ userId, onHome }) => {
    const [view, setView] = useState<'discover' | 'ai-chat'>('ai-chat');
    const [candidates, setCandidates] = useState<PublishedResume[]>([]);
    const [companyName, setCompanyName] = useState('Brand');
    
    // AI Chat State
    const [chatHistory, setChatHistory] = useState<{role: 'ai' | 'user', content: string, matches?: any[]}[]>([
        { role: 'ai', content: "Hello! I'm your AI Recruiter. Tell me what kind of role you are hiring for today? (e.g., 'I need a React developer with 3 years experience')" }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Messaging State
    const [showMessages, setShowMessages] = useState(false);
    const [directMessageTarget, setDirectMessageTarget] = useState<string | undefined>(undefined);
    
    // Resume Preview
    const [selectedResume, setSelectedResume] = useState<PublishedResume | null>(null);
    const previewRef = React.useRef(null);

    useEffect(() => {
        // Load profile name
        getUserProfile(userId).then(p => { if(p) setCompanyName(p.full_name); });
        // Load candidates pool
        fetchPublishedResumes().then(setCandidates);
    }, [userId]);

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMsg.trim()) return;

        const userMsg = inputMsg;
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputMsg('');
        setIsThinking(true);

        try {
            // 1. Find matches using Gemini
            const matches = await findBestCandidates(userMsg, candidates);
            
            // 2. Construct response
            let aiResponse = "";
            let foundCandidates: any[] = [];

            if (matches.length > 0) {
                aiResponse = `I found ${matches.length} great candidates for you based on your requirements.`;
                foundCandidates = matches.map(m => {
                    const c = candidates.find(cand => cand.user_id === m.candidateId);
                    return { ...c, reason: m.reason, score: m.score };
                }).filter(Boolean);
            } else {
                aiResponse = "I couldn't find any perfect matches in our current database, but I'll keep looking as new candidates join.";
            }

            setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse, matches: foundCandidates }]);

        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error analyzing the candidates." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const openMessage = (candidateId: string) => {
        setDirectMessageTarget(candidateId);
        setShowMessages(true);
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col z-10">
                <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Resubuild</h1>
                        <span className="text-xs text-neutral-500 font-medium">For Employers</span>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setView('ai-chat')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${view === 'ai-chat' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                    >
                        <Sparkles className="w-4 h-4" /> AI Recruiter
                    </button>
                     <button 
                        onClick={() => setView('discover')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${view === 'discover' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                    >
                        <Search className="w-4 h-4" /> Browse Talent
                    </button>
                    <button 
                        onClick={() => { setShowMessages(true); setDirectMessageTarget(undefined); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors font-medium text-sm"
                    >
                        <MessageSquare className="w-4 h-4" /> Messages
                    </button>
                </nav>

                <div className="p-4 border-t border-neutral-100">
                     <div className="flex items-center gap-3 mb-4 px-2">
                         <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-xs">
                             {companyName.charAt(0)}
                         </div>
                         <div className="text-sm font-bold truncate flex-1">{companyName}</div>
                     </div>
                     <button onClick={async () => { await supabase.auth.signOut(); onHome(); }} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-red-600 px-2">
                         <LogOut className="w-4 h-4" /> Sign Out
                     </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* View: AI Recruiter Chat */}
                {view === 'ai-chat' && (
                    <div className="flex flex-col h-full">
                         <header className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" /> AI Talent Matcher
                            </h2>
                            <p className="text-sm text-neutral-500">Tell the AI what you need, and it will scan our database for the best candidates.</p>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50 scroll-smooth">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-neutral-900 text-white rounded-2xl rounded-tr-none px-5 py-3' : ''}`}>
                                        {msg.role === 'ai' && (
                                            <div className="flex gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div className="mt-1.5 text-sm font-medium text-neutral-500">AI Recruiter</div>
                                            </div>
                                        )}
                                        
                                        {msg.content && <div className={`text-sm leading-relaxed ${msg.role === 'ai' ? 'text-neutral-800 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm' : ''}`}>{msg.content}</div>}
                                        
                                        {/* Render Candidate Cards if matches found */}
                                        {msg.matches && msg.matches.length > 0 && (
                                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                                {msg.matches.map((cand: any) => (
                                                    <div key={cand.id} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-neutral-900">{cand.full_name}</h4>
                                                                <p className="text-xs text-neutral-500">{cand.job_title}</p>
                                                            </div>
                                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                                                {cand.score}% Match
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-neutral-600 mb-3 italic border-l-2 border-neutral-200 pl-2 my-2">
                                                            "{cand.reason}"
                                                        </p>
                                                        <div className="flex gap-2 mt-3">
                                                            <Button 
                                                                variant="secondary" 
                                                                className="text-xs h-8 px-3" 
                                                                onClick={() => setSelectedResume(cand)}
                                                            >
                                                                View Resume
                                                            </Button>
                                                            <Button 
                                                                variant="primary" 
                                                                className="text-xs h-8 px-3"
                                                                onClick={() => openMessage(cand.user_id)}
                                                            >
                                                                Message
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                     <div className="bg-white px-4 py-3 rounded-2xl border border-neutral-200 flex items-center gap-2 text-sm text-neutral-500">
                                         <Sparkles className="w-4 h-4 animate-pulse" /> Analyzing candidates...
                                     </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-neutral-200">
                            <form onSubmit={handleAiSubmit} className="relative max-w-3xl mx-auto">
                                <input 
                                    className="w-full pl-5 pr-12 py-3 bg-neutral-100 rounded-full border-none focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                                    placeholder="Type your requirements (e.g. 'Marketing Manager in New York')..."
                                    value={inputMsg}
                                    onChange={e => setInputMsg(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputMsg.trim() || isThinking}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neutral-900 text-white rounded-full disabled:opacity-50 hover:bg-neutral-800 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View: Discover (Reuse list view logic but simplifed for employer) */}
                {view === 'discover' && (
                     <div className="flex-1 overflow-y-auto p-8">
                        <h2 className="text-2xl font-bold mb-6">Browse All Talent</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidates.map(cand => (
                                <div key={cand.id} className="bg-white p-5 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-lg">
                                            {cand.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{cand.full_name}</h3>
                                            <p className="text-xs text-neutral-500">{cand.job_title}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {cand.skills?.slice(0,3).map((s,i) => (
                                            <span key={i} className="text-[10px] bg-neutral-50 px-2 py-1 rounded border border-neutral-100">{s}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" className="w-full text-xs" onClick={() => setSelectedResume(cand)}>View</Button>
                                        <Button variant="primary" className="w-full text-xs" onClick={() => openMessage(cand.user_id)}>Message</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}

            </main>
            
            {/* Resume Preview Modal */}
            {selectedResume && (
                 <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
                     <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
                         <div className="p-4 border-b flex justify-between items-center">
                             <h3 className="font-bold">{selectedResume.full_name}'s Resume</h3>
                             <button onClick={() => setSelectedResume(null)} className="p-2 hover:bg-neutral-100 rounded-full"><LogOut className="w-5 h-5 rotate-180" /></button>
                         </div>
                         <div className="flex-1 overflow-auto bg-neutral-100 p-8 custom-scrollbar">
                             <ResumePreview data={selectedResume.resume_data} previewRef={previewRef} />
                         </div>
                     </div>
                 </div>
            )}

            {/* Messages Modal */}
            {showMessages && (
                <Messaging 
                    userId={userId} 
                    recipientId={directMessageTarget} 
                    onClose={() => setShowMessages(false)} 
                />
            )}

        </div>
    );
};
