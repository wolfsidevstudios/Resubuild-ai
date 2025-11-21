
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData } from '../types';
import { generateInteractivePortfolio, generateColdEmail, generateSalaryScript, generateEmailTemplate, refineToolOutput } from '../services/geminiService';
import { MonitorPlay, FileText, Briefcase, DollarSign, Send, Download, ChevronRight, X, Loader2, Code2, Mail, Sparkles, MailOpen, Bot, ArrowUp, User, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './InputField';

interface BetaToolsProps {
    resumes: ResumeData[];
    onHome: () => void;
}

type ToolType = 'appify' | 'email' | 'negotiator' | 'template_gen' | null;

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

    // Template Gen State
    const [templateType, setTemplateType] = useState('Follow-up on Application');
    const [recipient, setRecipient] = useState('');
    const [extraContext, setExtraContext] = useState('');

    // Deep Agent State
    const [isDeepAgentOpen, setIsDeepAgentOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<{role: 'ai' | 'user', content: string}[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const selectedResume = resumes.find(r => r.id === selectedResumeId);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isDeepAgentOpen]);

    const handleRunTool = async () => {
        if (!selectedResume) return;
        setLoading(true);
        setResult('');
        setIsDeepAgentOpen(false); // Reset deep agent if re-running

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
            } else if (activeTool === 'template_gen') {
                output = await generateEmailTemplate(selectedResume, templateType, recipient, extraContext);
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
        setIsDeepAgentOpen(false);
        setSelectedResumeId('');
        setEmailCompany('');
        setEmailRole('');
        setOfferAmount('');
        setTargetAmount('');
        setTemplateType('Follow-up on Application');
        setRecipient('');
        setExtraContext('');
    };

    const openDeepAgent = () => {
        setIsDeepAgentOpen(true);
        setChatHistory([{ 
            role: 'ai', 
            content: `I've loaded your ${activeTool === 'appify' ? 'app code' : 'draft'}. What would you like to change? You can say things like "Make it more polite" or "Change the background to blue".` 
        }]);
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !result) return;

        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsRefining(true);

        try {
            const refinedOutput = await refineToolOutput(result, userMsg, activeTool || 'text');
            setResult(refinedOutput);
            setChatHistory(prev => [...prev, { role: 'ai', content: "I've updated the content based on your feedback." }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't update the content. Please try again." }]);
        } finally {
            setIsRefining(false);
        }
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
            <div className="h-full flex flex-col bg-neutral-50/50 relative overflow-hidden">
                
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-neutral-200 bg-white flex justify-between items-center z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={resetTool} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            {activeTool === 'appify' && <Code2 className="w-5 h-5 text-purple-600" />}
                            {activeTool === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                            {activeTool === 'negotiator' && <DollarSign className="w-5 h-5 text-green-600" />}
                            {activeTool === 'template_gen' && <MailOpen className="w-5 h-5 text-pink-600" />}
                            {activeTool === 'appify' ? 'Resume to App' : 
                             activeTool === 'email' ? 'Cold Email Generator' : 
                             activeTool === 'negotiator' ? 'Salary Negotiator' : 'Smart Email Templates'}
                        </h2>
                    </div>
                    
                    {result && !isDeepAgentOpen && (
                        <Button onClick={openDeepAgent} variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200" icon={<Sparkles className="w-4 h-4" />}>
                            Open in Deep Agent
                        </Button>
                    )}
                </div>

                {/* DEEP AGENT VIEW (Split Screen) */}
                {isDeepAgentOpen ? (
                    <div className="flex-1 flex overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Chat Sidebar */}
                        <div className="w-full md:w-[400px] bg-white border-r border-neutral-200 flex flex-col z-10 shadow-xl">
                            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                                <div className="font-bold text-sm flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-purple-600" /> Deep Agent Chat
                                </div>
                                <button onClick={() => setIsDeepAgentOpen(false)} className="text-xs text-neutral-500 hover:underline">Close Agent</button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-neutral-900 text-white'}`}>
                                            {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-tl-none' : 'bg-neutral-900 text-white rounded-tr-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isRefining && (
                                     <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm text-neutral-500">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Refining content...
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            
                            <div className="p-4 border-t border-neutral-100 bg-white">
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <input 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask for changes..."
                                        className="w-full pl-4 pr-12 py-3 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                                        disabled={isRefining}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!chatInput.trim() || isRefining}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 bg-neutral-100 relative flex flex-col overflow-hidden">
                            <div className="flex-1 p-8 overflow-auto">
                                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-200 h-full flex flex-col">
                                    {/* Toolbar inside preview */}
                                    <div className="bg-neutral-50 border-b border-neutral-200 p-2 flex justify-end gap-2">
                                        <Button onClick={() => navigator.clipboard.writeText(result)} variant="ghost" className="text-xs h-8">Copy</Button>
                                        {activeTool === 'appify' && <Button onClick={downloadApp} variant="secondary" className="text-xs h-8" icon={<Download className="w-3 h-3"/>}>Download</Button>}
                                    </div>
                                    
                                    {activeTool === 'appify' ? (
                                        <iframe srcDoc={result} className="flex-1 w-full border-none" title="App Preview" />
                                    ) : (
                                        <textarea 
                                            className="flex-1 w-full p-8 resize-none outline-none font-mono text-sm text-neutral-800" 
                                            value={result}
                                            readOnly
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // STANDARD VIEW
                    <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden p-8">
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

                                {activeTool === 'template_gen' && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Email Type</label>
                                            <select 
                                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                                                value={templateType}
                                                onChange={e => setTemplateType(e.target.value)}
                                            >
                                                <option value="Follow-up on Application">Follow-up on Application</option>
                                                <option value="Post-Interview Thank You">Post-Interview Thank You</option>
                                                <option value="Accepting Job Offer">Accepting Job Offer</option>
                                                <option value="Declining Job Offer">Declining Job Offer</option>
                                                <option value="Resignation Letter">Resignation Letter</option>
                                                <option value="Request for Recommendation">Request for Recommendation</option>
                                                <option value="Networking Reachout">Networking Reachout</option>
                                            </select>
                                        </div>
                                        <Input label="Recipient Name/Role" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. Hiring Manager" />
                                        <TextArea label="Key Details (Optional)" value={extraContext} onChange={e => setExtraContext(e.target.value)} placeholder="e.g. Interviewed last Tuesday, really liked the team..." className="min-h-[100px]" />
                                    </>
                                )}

                                <Button 
                                    onClick={handleRunTool} 
                                    disabled={
                                        !selectedResumeId || 
                                        loading || 
                                        (activeTool === 'email' && (!emailCompany || !emailRole)) || 
                                        (activeTool === 'negotiator' && (!offerAmount || !targetAmount)) ||
                                        (activeTool === 'template_gen' && !recipient)
                                    }
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
                                        <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap text-neutral-800 leading-relaxed font-sans relative">
                                            {result}
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(result)}
                                                className="absolute top-4 right-4 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-bold shadow-sm hover:bg-neutral-50"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                                    {activeTool === 'appify' && <Code2 className="w-16 h-16 mb-4 opacity-20" />}
                                    {activeTool === 'email' && <Mail className="w-16 h-16 mb-4 opacity-20" />}
                                    {activeTool === 'negotiator' && <DollarSign className="w-16 h-16 mb-4 opacity-20" />}
                                    {activeTool === 'template_gen' && <MailOpen className="w-16 h-16 mb-4 opacity-20" />}
                                    <p>Output will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Beta Tools</h2>
                <p className="text-neutral-500">Experimental AI features to supercharge your job search.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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

                {/* Email Templates */}
                <button onClick={() => setActiveTool('template_gen')} className="group text-left bg-white p-8 rounded-3xl border border-neutral-200 hover:border-purple-600 hover:shadow-xl transition-all flex flex-col h-full relative overflow-hidden">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <MailOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Smart Email Templates</h3>
                    <p className="text-neutral-500 mb-4 flex-1">Generate follow-ups, thank you notes, resignations, and more tailored to your situation.</p>
                    <div className="flex items-center text-sm font-bold text-purple-600">Try it <ChevronRight className="w-4 h-4 ml-1" /></div>
                </button>
            </div>
        </div>
    );
};
