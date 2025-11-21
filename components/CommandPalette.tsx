
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Calculator, Megaphone, Languages, BrainCircuit, Target, PenTool, Mic, Linkedin, Compass, Code2, X, Command, UserCheck } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (actionId: string) => void;
}

interface Tool {
    id: string;
    label: string;
    desc: string;
    icon: React.ElementType;
    color: string;
}

const TOOLS: Tool[] = [
    { id: 'humanizer', label: 'AI Humanizer', desc: 'Make text natural & see human score', icon: UserCheck, color: 'text-indigo-600' },
    { id: 'metric_booster', label: 'Metric Booster', desc: 'Add numbers to your bullets', icon: Calculator, color: 'text-emerald-600' },
    { id: 'tone_polish', label: 'Tone Polish', desc: 'Rewrite in executive or creative voice', icon: Megaphone, color: 'text-pink-600' },
    { id: 'translate', label: 'Translator', desc: 'Convert resume to another language', icon: Languages, color: 'text-cyan-600' },
    { id: 'audit', label: 'Deep Audit', desc: 'Get a detailed score & feedback', icon: BrainCircuit, color: 'text-purple-600' },
    { id: 'job_match', label: 'Job Match', desc: 'Compare resume against JD', icon: Target, color: 'text-red-600' },
    { id: 'cover_letter', label: 'Cover Letter Gen', desc: 'Write a tailored letter', icon: PenTool, color: 'text-blue-600' },
    { id: 'interview_prep', label: 'Interview Prep', desc: 'Generate custom questions', icon: Mic, color: 'text-green-600' },
    { id: 'linkedin', label: 'LinkedIn Optimizer', desc: 'Create posts & headlines', icon: Linkedin, color: 'text-blue-700' },
    { id: 'career_path', label: 'Career Path', desc: 'Explore future roles', icon: Compass, color: 'text-orange-600' },
    { id: 'appify', label: 'Resume to App', desc: 'Build a portfolio website', icon: Code2, color: 'text-neutral-900' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onAction }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredTools = TOOLS.filter(tool => 
        tool.label.toLowerCase().includes(query.toLowerCase()) || 
        tool.desc.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle Keyboard Navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredTools.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTools[selectedIndex]) {
                onAction(filteredTools[selectedIndex].id);
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-neutral-900/20 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                    <Search className="w-5 h-5 text-neutral-400" />
                    <input 
                        ref={inputRef}
                        className="flex-1 bg-transparent outline-none text-lg text-neutral-900 placeholder-neutral-400"
                        placeholder="What would you like to do?"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-500">ESC</div>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredTools.length === 0 ? (
                        <div className="p-8 text-center text-neutral-400">
                            No tools found for "{query}"
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredTools.map((tool, idx) => (
                                <button
                                    key={tool.id}
                                    onClick={() => { onAction(tool.id); onClose(); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-4 transition-colors ${idx === selectedIndex ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm ${tool.color}`}>
                                        <tool.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900">{tool.label}</div>
                                        <div className="text-xs text-neutral-500">{tool.desc}</div>
                                    </div>
                                    {idx === selectedIndex && <div className="ml-auto"><Command className="w-4 h-4 text-neutral-400" /></div>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-400 flex justify-between px-6">
                    <span><span className="font-bold">↑↓</span> to navigate</span>
                    <span><span className="font-bold">↵</span> to select</span>
                </div>
            </div>
        </div>
    );
};
