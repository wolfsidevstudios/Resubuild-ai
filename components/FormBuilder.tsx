
import React, { useState } from 'react';
import { Plus, Trash2, Save, Globe, Sparkles, Settings, X, GripVertical, FileText, Copy } from 'lucide-react';
import { FormProject, FormField } from '../types';
import { createForm } from '../services/firebase';
import { generateFormSchema } from '../services/geminiService';
import { Button } from './Button';
import { Input, TextArea } from './InputField';

interface FormBuilderProps {
    userId: string;
    onClose: () => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ userId, onClose }) => {
    const [form, setForm] = useState<FormProject>({
        id: crypto.randomUUID(),
        userId,
        title: 'Untitled Form',
        description: '',
        fields: [],
        themeColor: '#3b82f6',
        published: false,
        views: 0,
        submissions: 0,
        createdAt: new Date().toISOString()
    });
    
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const generated = await generateFormSchema(prompt);
            setForm(prev => ({
                ...prev,
                title: generated.title,
                description: generated.description,
                themeColor: generated.themeColor,
                fields: generated.fields
            }));
        } catch (e) {
            alert("Failed to generate form.");
        } finally {
            setIsGenerating(false);
        }
    };

    const addField = (type: FormField['type']) => {
        const newField: FormField = {
            id: crypto.randomUUID(),
            type,
            label: 'New Question',
            required: false,
            options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
        };
        setForm(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    };

    const updateField = (id: string, key: keyof FormField, value: any) => {
        setForm(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === id ? { ...f, [key]: value } : f)
        }));
    };

    const removeField = (id: string) => {
        setForm(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }));
    };

    const handlePublish = async () => {
        setIsSaving(true);
        try {
            const finalForm = { ...form, published: true };
            await createForm(finalForm);
            setForm(finalForm);
            
            // Determine the base URL (e.g., current domain)
            const baseUrl = window.location.origin;
            setPublishedUrl(`${baseUrl}/forms/${form.id}`);
        } catch (e) {
            console.error(e);
            alert("Failed to publish form.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col animate-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <input 
                            className="font-bold text-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handlePublish} isLoading={isSaving}>
                        {form.published ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Tools */}
                <div className="w-80 bg-white border-r border-neutral-200 p-6 flex flex-col overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI Generator
                        </h3>
                        <div className="space-y-3">
                            <TextArea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder="e.g. Registration form for a hackathon..."
                                className="text-sm min-h-[80px]"
                            />
                            <Button onClick={handleGenerate} isLoading={isGenerating} className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white">
                                Generate Form
                            </Button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4">Add Fields</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['text', 'email', 'number', 'textarea', 'select', 'checkbox'].map((type) => (
                                <button 
                                    key={type}
                                    onClick={() => addField(type as any)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <span className="capitalize text-xs font-medium text-neutral-700">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4">Settings</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full border border-neutral-200" style={{ backgroundColor: form.themeColor }}></div>
                            <input 
                                type="color" 
                                value={form.themeColor} 
                                onChange={e => setForm({...form, themeColor: e.target.value})}
                                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                            />
                            <span className="text-xs text-neutral-500">Theme Color</span>
                        </div>
                    </div>
                </div>

                {/* Main Canvas: Preview/Editor */}
                <div className="flex-1 bg-neutral-100/50 p-8 overflow-y-auto flex justify-center">
                    <div className="w-full max-w-2xl bg-white rounded-t-xl border-t-8 shadow-sm border-x border-b border-neutral-200 pb-8" style={{ borderTopColor: form.themeColor }}>
                        {/* Form Header */}
                        <div className="p-8 border-b border-neutral-100">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{form.title}</h1>
                            <Input 
                                label="" 
                                value={form.description} 
                                onChange={e => setForm({...form, description: e.target.value})}
                                placeholder="Form description..."
                                className="border-none bg-transparent p-0 text-neutral-500 focus:ring-0"
                            />
                        </div>

                        {/* Fields List */}
                        <div className="p-8 space-y-6">
                            {form.fields.map((field, idx) => (
                                <div key={field.id} className="group relative p-6 bg-neutral-50 rounded-xl border border-neutral-200 hover:shadow-md transition-all">
                                    {/* Field Controls */}
                                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => removeField(field.id)} className="p-1.5 bg-white text-red-500 rounded shadow-sm border border-neutral-200 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <input 
                                            className="font-bold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-blue-500 focus:outline-none w-full py-1"
                                            value={field.label}
                                            onChange={e => updateField(field.id, 'label', e.target.value)}
                                        />
                                    </div>

                                    {field.type === 'select' && (
                                        <div className="mb-4 space-y-2">
                                            <p className="text-xs font-bold uppercase text-neutral-400">Options (comma separated)</p>
                                            <Input 
                                                label="" 
                                                value={field.options?.join(', ')} 
                                                onChange={e => updateField(field.id, 'options', e.target.value.split(',').map(s => s.trim()))}
                                            />
                                        </div>
                                    )}

                                    {/* Visual Preview of Input */}
                                    <div className="pointer-events-none opacity-50">
                                        {field.type === 'textarea' ? (
                                            <textarea className="w-full p-3 border rounded-lg bg-white" placeholder="Long answer text" disabled />
                                        ) : field.type === 'select' ? (
                                            <select className="w-full p-3 border rounded-lg bg-white" disabled><option>Select option</option></select>
                                        ) : (
                                            <input className="w-full p-3 border rounded-lg bg-white" placeholder="Short answer text" disabled />
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            checked={field.required} 
                                            onChange={e => updateField(field.id, 'required', e.target.checked)}
                                            id={`req-${field.id}`}
                                        />
                                        <label htmlFor={`req-${field.id}`} className="text-xs text-neutral-500 cursor-pointer">Required</label>
                                    </div>
                                </div>
                            ))}

                            {form.fields.length === 0 && (
                                <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-200 rounded-xl">
                                    No fields yet. Add one from the sidebar or use AI.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Published Modal */}
            {publishedUrl && (
                <div className="absolute inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <Globe className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Form Published!</h2>
                        <p className="text-neutral-500 mb-6">Your form is live and ready to share.</p>
                        
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center gap-2 mb-6">
                            <input readOnly value={publishedUrl} className="flex-1 bg-transparent text-sm outline-none text-neutral-600" />
                            <button onClick={() => navigator.clipboard.writeText(publishedUrl)} className="p-2 hover:bg-white rounded-lg transition-colors">
                                <Copy className="w-4 h-4 text-neutral-400" />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={() => setPublishedUrl('')} className="flex-1">Close</Button>
                            <a href={publishedUrl} target="_blank" rel="noreferrer" className="flex-1">
                                <Button className="w-full">View Live</Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
