
import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Palette, Heart, Upload, ChevronLeft, Zap, Layers, Award } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { ResumeData, ContestEntry } from '../types';
import { generateDesignTheme } from '../services/geminiService';
import { createEmptyResume } from '../services/storageService';
import { ResumePreview } from './ResumePreview';
import { submitContestEntry, getContestEntries, voteForDesign, auth } from '../services/firebase';

const MOCK_RESUME_DATA = createEmptyResume('modern');
MOCK_RESUME_DATA.personalInfo.fullName = "Jordan Lee";
MOCK_RESUME_DATA.personalInfo.jobTitle = "Creative Director";
MOCK_RESUME_DATA.personalInfo.summary = "Visionary designer with a passion for futuristic interfaces and neon aesthetics.";
MOCK_RESUME_DATA.skills = ["UI Design", "Cyberpunk Aesthetics", "WebGL", "React"];

export const DesignPilot: React.FC = () => {
    const [view, setView] = useState<'create' | 'vote'>('create');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewData, setPreviewData] = useState<ResumeData>(MOCK_RESUME_DATA);
    const [customTheme, setCustomTheme] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState('');
    
    // Contest Data
    const [entries, setEntries] = useState<ContestEntry[]>([]);
    const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Countdown Logic (7 Days from now fixed for demo or dynamic)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 7 days from mount
        
        const interval = setInterval(() => {
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft("Contest Ended");
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft(`${days}d ${hours}h remaining`);
            }
        }, 60000);
        
        // Initial Load of entries
        loadEntries();

        return () => clearInterval(interval);
    }, []);

    const loadEntries = async () => {
        const data = await getContestEntries();
        setEntries(data);
        // Check user votes locally for UI state (simplified)
        const user = auth.currentUser;
        if (user) {
            const votedMap: Record<string, boolean> = {};
            data.forEach(e => {
                if (e.votes.includes(user.uid)) votedMap[e.id] = true;
            });
            setHasVoted(votedMap);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const design = await generateDesignTheme(prompt);
            setCustomTheme(design.customStyle);
            setPreviewData(prev => ({
                ...prev,
                themeColor: design.themeColor,
                customStyle: design.customStyle
            }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to join the contest.");
            return;
        }
        if (!customTheme) return;

        if (confirm("Submit your design to the contest? It will be public.")) {
            try {
                await submitContestEntry({
                    user_id: user.uid,
                    author_name: user.displayName || "Anonymous",
                    design_name: prompt.slice(0, 30) + "...",
                    custom_style: customTheme,
                    theme_color: previewData.themeColor,
                    votes: [],
                    created_at: new Date().toISOString()
                });
                alert("Submitted! Good luck.");
                setView('vote');
                loadEntries();
            } catch (e) {
                console.error(e);
                alert("Submission failed.");
            }
        }
    };

    const handleVote = async (entryId: string) => {
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to vote.");
            return;
        }
        if (hasVoted[entryId]) return;

        try {
            await voteForDesign(entryId, user.uid);
            setHasVoted(prev => ({ ...prev, [entryId]: true }));
            // Optimistic update
            setEntries(prev => prev.map(e => e.id === entryId ? { ...e, votes: [...e.votes, user.uid] } : e));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Header */}
            <nav className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
                            <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight">Design Pilot</h1>
                            <div className="text-xs text-purple-400 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" /> {timeLeft}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setView('create')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'create' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Create
                        </button>
                        <button 
                            onClick={() => setView('vote')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'vote' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Vote
                        </button>
                        <a href="/" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-bold transition-all ml-4">
                            Exit Pilot
                        </a>
                    </div>
                </div>
            </nav>

            {view === 'create' && (
                <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                    {/* Editor Panel */}
                    <div className="w-full md:w-1/3 border-r border-white/10 bg-neutral-900 p-8 flex flex-col z-10 relative">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-3xl"></div>
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Design with Words</h2>
                                <p className="text-neutral-400">
                                    Describe a visual style, era, or feeling. Our AI will generate a unique CSS theme for your resume.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <TextArea 
                                    label="Design Prompt"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    placeholder="e.g. Cyberpunk 2077 neon blue and pink, dark mode, sharp borders..."
                                    className="bg-white/5 border-white/10 text-white placeholder-neutral-600 focus:border-purple-500 min-h-[120px]"
                                />
                                <Button 
                                    onClick={handleGenerate} 
                                    isLoading={isGenerating}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50 border-none"
                                    icon={<Sparkles className="w-4 h-4" />}
                                >
                                    Generate Theme
                                </Button>
                            </div>

                            {customTheme && (
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="font-bold text-sm text-purple-400 mb-2 uppercase tracking-wider">Theme Generated</h3>
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: previewData.themeColor }}></div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: customTheme.backgroundColor }}></div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ borderColor: customTheme.borderColor || 'transparent', borderWidth: '2px' }}></div>
                                    </div>
                                    <Button onClick={handleSubmit} className="w-full bg-white text-neutral-900 hover:bg-neutral-200">
                                        Publish to Contest <Upload className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex-1 bg-neutral-800 relative flex items-center justify-center p-8 overflow-hidden">
                        {/* Pattern Background */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        <div className="transform scale-[0.7] origin-center shadow-2xl ring-1 ring-white/10">
                            <ResumePreview 
                                data={previewData} 
                                previewRef={React.createRef()} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {view === 'vote' && (
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">Community Showcase</h2>
                        <p className="text-xl text-neutral-400">Vote for the best designs. The winner gets added to the app.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {entries.map(entry => (
                            <div key={entry.id} className="bg-neutral-800 rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all group relative">
                                {/* Live Preview Thumbnail */}
                                <div className="h-64 bg-white relative overflow-hidden cursor-default">
                                    <div className="transform scale-[0.3] origin-top-left w-[300%] h-[300%] pointer-events-none select-none">
                                        <ResumePreview 
                                            data={{...MOCK_RESUME_DATA, customStyle: entry.custom_style, themeColor: entry.theme_color}}
                                            previewRef={React.createRef()}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <div className="text-white font-bold">{entry.design_name}</div>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex justify-between items-center">
                                    <div>
                                        <div className="text-sm font-bold text-white">{entry.author_name}</div>
                                        <div className="text-xs text-neutral-500">{entry.votes.length} Votes</div>
                                    </div>
                                    <button 
                                        onClick={() => handleVote(entry.id)}
                                        disabled={hasVoted[entry.id]}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${hasVoted[entry.id] ? 'bg-purple-600 text-white' : 'bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${hasVoted[entry.id] ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
