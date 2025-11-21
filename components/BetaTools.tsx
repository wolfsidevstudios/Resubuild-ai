
import React, { useState } from 'react';
import { ResumeData } from '../types';
import { generateInteractivePortfolio, generateColdEmail, generateSalaryScript } from '../services/geminiService';
import { MonitorPlay, FileText, Briefcase, DollarSign, Send, Download, ChevronRight, X, Loader2, Code2, Mail, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Input } from './InputField';

interface BetaToolsProps {
    resumes: ResumeData[];
    onHome: () => void;
}

type ToolType = 'appify' | 'email' | 'negotiator' | null;

export const BetaTools: React.FC<BetaToolsProps> = ({ resumes, onHome }) => {
    const [activeTool, setActiveTool] = useState<ToolType>(null);
    const [selectedResumeId, setSelectedResumeId] = useState<string>('');
    
    // Tool State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    
    // Email State
    const [emailCompany, setEmailCompany] = useState('');
    const [emailRole, setEmailRole] = useState('');

    // Negotiator State
    const [offerAmount, setOfferAmount] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    const selectedResume = resumes.find(r => r.id === selectedResumeId);

    const handleRunTool = async () => {
        if (!selectedResume) return;
        setLoading(true);
        setResult('');

        try {
            let output = '';
            if (activeTool === 'appify') {
                output = await generateInteractivePortfolio(selectedResume);
            } else if (activeTool === 'email') {
                if (!emailCompany || !emailRole) return;
                output = await generateColdEmail(selectedResume, emailCompany, emailRole);
            } else if (activeTool === 'negotiator') {
                if (!offerAmount || !targetAmount) return;
                output = await generateSalaryScript(selectedResume, offerAmount, targetAmount);
            }
            setResult(output);
        } catch (e) {
            console.error(e);
            alert("Tool failed to run. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetTool = () => {
        setActiveTool(null);
        setResult('');
        setSelectedResumeId('');
        setEmailCompany('');
        setEmailRole('');
        setOfferAmount('');
        setTargetAmount('');
    };

    const downloadApp = () => {
        if (!result) return;
        const blob = new Blob([result], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedResume?.name.replace(/\s+/g, '_') || 'portfolio'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (activeTool) {
        return (
            <div className="p-8 h-full flex flex-col bg-neutral-50/50">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={resetTool} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="text-2xl font-bold text-neutral-900">
                            {activeTool === 'appify' && 'Resume to App'}
                            {activeTool === 'email' && 'Cold Email Generator'}
                            {activeTool === 'negotiator' && 'Salary Negotiator'}
                        </h2>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
                    {/* Configuration Panel */}
                    <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl border border-neutral-200 h-fit shadow-sm">
                        <div className="space-y-6">
                            {/* Resume Selector */}
                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Select Resume Context</label>
                                {resumes.length === 0 ? (
                                    <div className="text-sm text-red-500">No resumes found. Create one first.</div>
                                ) : (
                                    <div className="grid gap-2">
                                        {resumes.map(r => (
                                            <button 
                                                key={r.id}
                                                onClick={() => setSelectedResumeId(r.id)}
                                                className={`p-3 rounded-xl border text-left transition-all ${selectedResumeId === r.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-300'}`}
                                            >
                                                <div className="font-bold text-sm text-neutral-900 truncate">{r.name}</div>
                                                <div className="text-xs text-neutral-500 truncate">{r.personalInfo.jobTitle || 'No Title'}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tool Specific Inputs */}
                            {activeTool === 'email' && (
                                <>
                                    <Input label="Target Company" value={emailCompany} onChange={e => setEmailCompany(e.target.value)} placeholder="e.g. Apple" />
                                    <Input label="Role Name" value={emailRole} onChange={e => setEmailRole(e.target.value)} placeholder="e.g. Senior Designer" />
                                </>
                            )}

                            {activeTool === 'negotiator' && (
                                <>
                                    <Input label="Current Offer ($)" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="120,000" />
                                    <Input label="Target Amount ($)" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="140,000" />
                                </>
                            )}

                            <Button 
                                onClick={handleRunTool} 
                                disabled={!selectedResumeId || loading || (activeTool === 'email' && (!emailCompany || !emailRole)) || (activeTool === 'negotiator' && (!offerAmount || !targetAmount))}
                                className="w-full"
                                isLoading={loading}
                                icon={<Sparkles className="w-4 h-4" />}
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Output Panel */}
                    <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col relative">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-neutral-900 mb-4" />
                                <p className="text-neutral-500 animate-pulse">AI is working...</p>
                            </div>
                        ) : result ? (
                            <>
                                {activeTool === 'appify' ? (
                                    <div className="flex-1 flex flex-col">
                                        <div className="p-3 border-b bg-neutral-50 flex justify-end">
                                            <Button onClick={downloadApp} icon={<Download className="w-4 h-4"/>} variant="primary">Download HTML</Button>
                                        </div>
                                        <iframe srcDoc={result} className="flex-1 w-full border-none" title="App Preview" />
                                    </div>
                                ) : (
                                    <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap text-neutral-800 leading-relaxed font-sans">
                                        {result}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                                {activeTool === 'appify' && <Code2 className="w-16 h-16 mb-4 opacity-20" />}
                                {activeTool === 'email' && <Mail className="w-16 h-16 mb-4 opacity-20" />}
                                {activeTool === 'negotiator' && <DollarSign className="w-16 h-16 mb-4 opacity-20" />}
                                <p>Output will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Beta Tools</h2>
                <p className="text-neutral-500">Experimental AI features to supercharge your job search.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Appify */}
                <button onClick={() => setActiveTool('appify')} className="group text-left bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-900 hover:shadow-xl transition-all flex flex-col h-full">
                    <div className="w-14 h-14 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <MonitorPlay className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Resume to App</h3>
                    <p className="text-neutral-500 mb-4 flex-1">Convert any resume into a stunning, interactive personal website code instantly.</p>
                    <div className="flex items-center text-sm font-bold text-neutral-900">Try it <ChevronRight className="w-4 h-4 ml-1" /></div>
                </button>

                {/* Cold Email */}
                <button onClick={() => setActiveTool('email')} className="group text-left bg-white p-8 rounded-3xl border border-neutral-200 hover:border-blue-600 hover:shadow-xl transition-all flex flex-col h-full relative overflow-hidden">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Send className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Cold Email Writer</h3>
                    <p className="text-neutral-500 mb-4 flex-1">Generate tailored outreach emails to recruiters that actually get responses.</p>
                    <div className="flex items-center text-sm font-bold text-blue-600">Try it <ChevronRight className="w-4 h-4 ml-1" /></div>
                </button>

                {/* Negotiator */}
                <button onClick={() => setActiveTool('negotiator')} className="group text-left bg-white p-8 rounded-3xl border border-neutral-200 hover:border-green-600 hover:shadow-xl transition-all flex flex-col h-full relative overflow-hidden">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Salary Negotiator</h3>
                    <p className="text-neutral-500 mb-4 flex-1">Get a custom script to negotiate your offer based on your experience leverage.</p>
                    <div className="flex items-center text-sm font-bold text-green-600">Try it <ChevronRight className="w-4 h-4 ml-1" /></div>
                </button>
            </div>
        </div>
    );
};
