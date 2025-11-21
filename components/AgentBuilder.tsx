
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, X, Play, Database, User, MessageSquare, ArrowRight, LayoutGrid, Settings } from 'lucide-react';
import { AgentNode, CustomAgent } from '../types';
import { saveCustomAgent, getCustomAgents, deleteCustomAgent } from '../services/firebase';
import { runCustomAgent } from '../services/geminiService';
import { Button } from './Button';
import { Input, TextArea } from './InputField';

interface AgentBuilderProps {
    userId: string;
    onClose: () => void;
}

const NODE_TYPES = [
    { type: 'source', label: 'Data Source', icon: Database, color: 'bg-blue-100 text-blue-600' },
    { type: 'persona', label: 'Persona', icon: User, color: 'bg-purple-100 text-purple-600' },
    { type: 'task', label: 'Task Prompt', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
];

export const AgentBuilder: React.FC<AgentBuilderProps> = ({ userId, onClose }) => {
    const [agents, setAgents] = useState<CustomAgent[]>([]);
    const [currentAgent, setCurrentAgent] = useState<CustomAgent | null>(null);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    
    // Test Mode
    const [testInput, setTestInput] = useState('');
    const [testOutput, setTestOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        const data = await getCustomAgents(userId);
        setAgents(data);
    };

    const createNewAgent = () => {
        const newAgent: CustomAgent = {
            id: crypto.randomUUID(),
            user_id: userId,
            name: 'New Agent',
            description: 'A custom AI assistant',
            nodes: [
                { id: '1', type: 'source', title: 'Resume Data', config: { sourceType: 'resume' }, position: { x: 0, y: 0 } }
            ],
            created_at: Date.now()
        };
        setCurrentAgent(newAgent);
        setActiveNodeId(null);
    };

    const saveAgent = async () => {
        if (!currentAgent) return;
        await saveCustomAgent(currentAgent);
        await loadAgents();
        alert('Agent saved!');
    };

    const deleteAgent = async (id: string) => {
        if (!confirm("Delete this agent?")) return;
        await deleteCustomAgent(id);
        await loadAgents();
        if (currentAgent?.id === id) setCurrentAgent(null);
    };

    const addNode = (type: any) => {
        if (!currentAgent) return;
        const newNode: AgentNode = {
            id: crypto.randomUUID(),
            type: type,
            title: type === 'persona' ? 'New Persona' : 'New Task',
            config: {},
            position: { x: 0, y: 0 }
        };
        setCurrentAgent({ ...currentAgent, nodes: [...currentAgent.nodes, newNode] });
        setActiveNodeId(newNode.id);
    };

    const updateNodeConfig = (key: string, value: string) => {
        if (!currentAgent || !activeNodeId) return;
        const updatedNodes = currentAgent.nodes.map(n => 
            n.id === activeNodeId ? { ...n, config: { ...n.config, [key]: value } } : n
        );
        setCurrentAgent({ ...currentAgent, nodes: updatedNodes });
    };
    
    const updateNodeTitle = (title: string) => {
         if (!currentAgent || !activeNodeId) return;
         const updatedNodes = currentAgent.nodes.map(n => 
             n.id === activeNodeId ? { ...n, title } : n
         );
         setCurrentAgent({ ...currentAgent, nodes: updatedNodes });
    }

    const removeNode = (id: string) => {
         if (!currentAgent) return;
         setCurrentAgent({ ...currentAgent, nodes: currentAgent.nodes.filter(n => n.id !== id) });
         if (activeNodeId === id) setActiveNodeId(null);
    };

    const runTest = async () => {
        if (!currentAgent || !testInput) return;
        setIsRunning(true);
        setTestOutput('');
        try {
            const result = await runCustomAgent(currentAgent, testInput);
            setTestOutput(result);
        } catch (e) {
            setTestOutput("Error running agent.");
        } finally {
            setIsRunning(false);
        }
    };

    const activeNode = currentAgent?.nodes.find(n => n.id === activeNodeId);

    return (
        <div className="h-screen flex flex-col bg-neutral-50">
            {/* Header */}
            <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <LayoutGrid className="w-6 h-6 text-purple-600" />
                    <h1 className="font-bold text-xl">Agent Builder</h1>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: List */}
                <div className="w-64 bg-white border-r border-neutral-200 p-4 flex flex-col">
                    <Button onClick={createNewAgent} className="w-full mb-6" icon={<Plus className="w-4 h-4" />}>New Agent</Button>
                    <div className="space-y-2 overflow-y-auto flex-1">
                        {agents.map(agent => (
                            <div 
                                key={agent.id}
                                onClick={() => setCurrentAgent(agent)}
                                className={`p-3 rounded-xl cursor-pointer border transition-all group flex justify-between items-center ${currentAgent?.id === agent.id ? 'bg-purple-50 border-purple-200' : 'bg-white border-neutral-100 hover:border-neutral-300'}`}
                            >
                                <span className="font-medium truncate">{agent.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id); }} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Area */}
                {currentAgent ? (
                    <div className="flex-1 flex bg-neutral-100/50">
                        {/* Flow Canvas (Simplified) */}
                        <div className="flex-1 p-8 overflow-y-auto relative">
                            <div className="flex items-center justify-between mb-8">
                                <input 
                                    className="bg-transparent text-2xl font-bold outline-none w-full"
                                    value={currentAgent.name}
                                    onChange={e => setCurrentAgent({...currentAgent, name: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={saveAgent} icon={<Save className="w-4 h-4"/>}>Save</Button>
                                </div>
                            </div>
                            
                            {/* Add Node Bar */}
                            <div className="flex gap-4 mb-8 justify-center">
                                {NODE_TYPES.map(t => (
                                    <button 
                                        key={t.type} 
                                        onClick={() => addNode(t.type)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200 hover:-translate-y-1 transition-transform"
                                    >
                                        <div className={`p-1 rounded ${t.color}`}><t.icon className="w-3 h-3"/></div>
                                        <span className="text-sm font-bold">{t.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Nodes Visual Flow */}
                            <div className="flex flex-col items-center gap-8">
                                {currentAgent.nodes.map((node, index) => (
                                    <React.Fragment key={node.id}>
                                        <div 
                                            onClick={() => setActiveNodeId(node.id)}
                                            className={`w-[400px] bg-white rounded-2xl border-2 p-5 shadow-sm cursor-pointer transition-all relative ${activeNodeId === node.id ? 'border-purple-500 shadow-lg ring-4 ring-purple-50' : 'border-neutral-200 hover:border-purple-300'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${NODE_TYPES.find(t=>t.type===node.type)?.color}`}>
                                                    {node.type}
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="text-neutral-300 hover:text-red-500"><X className="w-4 h-4"/></button>
                                            </div>
                                            <h3 className="font-bold text-lg">{node.title}</h3>
                                            <p className="text-xs text-neutral-400 truncate mt-1">
                                                {node.type === 'source' && 'Connects to Resume'}
                                                {node.type === 'persona' && (node.config.personaRole || 'Undefined Role')}
                                                {node.type === 'task' && (node.config.prompt || 'No instructions')}
                                            </p>
                                        </div>
                                        {/* Connector Line */}
                                        {index < currentAgent.nodes.length - 1 && (
                                            <div className="w-0.5 h-8 bg-neutral-300"></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel: Config or Test */}
                        <div className="w-96 bg-white border-l border-neutral-200 p-6 flex flex-col shadow-xl">
                            {activeNode ? (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5"/> Configure Node</h3>
                                    
                                    <Input label="Node Title" value={activeNode.title} onChange={e => updateNodeTitle(e.target.value)} />

                                    {activeNode.type === 'source' && (
                                        <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                                            This node automatically pulls data from your uploaded resume or profile.
                                        </div>
                                    )}

                                    {activeNode.type === 'persona' && (
                                        <Input 
                                            label="Role / Persona" 
                                            value={activeNode.config.personaRole || ''} 
                                            onChange={e => updateNodeConfig('personaRole', e.target.value)} 
                                            placeholder="e.g. Senior Recruiter at Google"
                                        />
                                    )}

                                    {activeNode.type === 'task' && (
                                        <TextArea 
                                            label="Instructions / Prompt" 
                                            value={activeNode.config.prompt || ''} 
                                            onChange={e => updateNodeConfig('prompt', e.target.value)} 
                                            placeholder="e.g. Analyze the user input and provide feedback..."
                                            className="min-h-[200px]"
                                        />
                                    )}
                                    
                                    <div className="pt-6 mt-auto border-t">
                                        <button onClick={() => setActiveNodeId(null)} className="text-sm text-neutral-500 hover:text-neutral-900">Close Config</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Play className="w-5 h-5"/> Test Agent</h3>
                                    <div className="flex-1 flex flex-col gap-4">
                                        <TextArea 
                                            label="Input" 
                                            value={testInput} 
                                            onChange={e => setTestInput(e.target.value)} 
                                            placeholder="Simulate user input..."
                                        />
                                        <Button onClick={runTest} isLoading={isRunning} className="w-full">Run Test</Button>
                                        
                                        <div className="flex-1 bg-neutral-100 rounded-xl p-4 overflow-y-auto font-mono text-sm text-neutral-700">
                                            {testOutput || "Output will appear here..."}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-neutral-400 flex-col gap-4">
                        <LayoutGrid className="w-16 h-16 opacity-20" />
                        <p>Select or create an agent to start building.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
