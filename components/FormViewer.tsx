
import React, { useState, useEffect } from 'react';
import { getForm, submitForm, incrementFormView } from '../services/firebase';
import { FormProject } from '../types';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormViewerProps {
    formId: string;
}

export const FormViewer: React.FC<FormViewerProps> = ({ formId }) => {
    const [form, setForm] = useState<FormProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getForm(formId);
                if (data) {
                    setForm(data);
                    incrementFormView(formId); // Track view
                } else {
                    setError("Form not found.");
                }
            } catch (e) {
                setError("Error loading form.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [formId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        // Validation
        for (const field of form.fields) {
            if (field.required && !answers[field.id]) {
                alert(`Please fill out "${field.label}"`);
                return;
            }
        }

        setSubmitting(true);
        try {
            await submitForm(formId, answers);
            setSubmitted(true);
        } catch (e) {
            alert("Failed to submit.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-neutral-400"/></div>;
    if (error || !form) return <div className="min-h-screen flex items-center justify-center text-neutral-500">{error}</div>;

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-neutral-500">Your response has been recorded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-t-xl border-t-8 border-x border-b border-neutral-200 p-8 mb-6 shadow-sm" style={{ borderTopColor: form.themeColor }}>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">{form.title}</h1>
                    {form.description && <p className="text-neutral-600 whitespace-pre-wrap">{form.description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {form.fields.map(field => (
                        <div key={field.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                            <label className="block font-medium text-neutral-900 mb-2">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {field.type === 'textarea' ? (
                                <textarea 
                                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
                                    placeholder={field.placeholder}
                                    value={answers[field.id] || ''}
                                    onChange={e => setAnswers({...answers, [field.id]: e.target.value})}
                                />
                            ) : field.type === 'select' ? (
                                <select 
                                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={answers[field.id] || ''}
                                    onChange={e => setAnswers({...answers, [field.id]: e.target.value})}
                                >
                                    <option value="">Select an option</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                        checked={answers[field.id] === 'true'}
                                        onChange={e => setAnswers({...answers, [field.id]: e.target.checked ? 'true' : 'false'})}
                                    />
                                    <span className="text-sm text-neutral-600">Yes</span>
                                </div>
                            ) : (
                                <input 
                                    type={field.type}
                                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder={field.placeholder}
                                    value={answers[field.id] || ''}
                                    onChange={e => setAnswers({...answers, [field.id]: e.target.value})}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                        <Button 
                            type="submit" 
                            isLoading={submitting}
                            className="px-8 py-3 text-lg shadow-lg"
                            style={{ backgroundColor: form.themeColor }}
                        >
                            Submit
                        </Button>
                        <div className="text-xs text-neutral-400">Powered by Kyndra Forms</div>
                    </div>
                </form>
            </div>
        </div>
    );
};
