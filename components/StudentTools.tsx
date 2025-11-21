
import React, { useState } from 'react';
import { GraduationCap, Calculator, BookOpen, PenTool, Copy, Loader2, Calendar, BrainCircuit, Sparkles, FileText, ChevronRight, Save, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { generateStudyPlan, generateEssayOutline, generateFlashcards, explainConcept } from '../services/geminiService';
import { saveGenericDocument } from '../services/firebase';

export const StudentTools: React.FC<{ userId?: string }> = ({ userId }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Inputs for various tools
    const [inputs, setInputs] = useState({
        subject: '',
        examDate: '',
        hoursPerDay: '2',
        essayTopic: '',
        flashcardTopic: '',
        concept: '',
        conceptLevel: 'High School'
    });

    // GPA Calculator State
    const [courses, setCourses] = useState([{ name: '', credits: '', grade: '' }]);
    const [gpa, setGpa] = useState<string | null>(null);

    const handleInputChange = (key: string, value: string) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const reset = () => {
        setResult(null);
        setLoading(false);
        setSaveSuccess(false);
    };

    // --- GPA Logic ---
    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;
        const gradeMap: Record<string, number> = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };

        courses.forEach(c => {
            const credits = parseFloat(c.credits);
            const grade = c.grade.toUpperCase().trim();
            if (!isNaN(credits) && gradeMap[grade] !== undefined) {
                totalPoints += gradeMap[grade] * credits;
                totalCredits += credits;
            }
        });

        if (totalCredits > 0) {
            setGpa((totalPoints / totalCredits).toFixed(2));
        } else {
            setGpa(null);
        }
    };

    const addCourse = () => setCourses([...courses, { name: '', credits: '', grade: '' }]);

    // --- AI Actions ---
    const runAI = async (action: 'plan' | 'essay' | 'flashcards' | 'explain') => {
        setLoading(true);
        setResult(null);
        try {
            if (action === 'plan') {
                const plan = await generateStudyPlan(inputs.subject, inputs.examDate, inputs.hoursPerDay);
                setResult(plan);
            } else if (action === 'essay') {
                const outline = await generateEssayOutline(inputs.essayTopic);
                setResult(outline);
            } else if (action === 'flashcards') {
                const cards = await generateFlashcards(inputs.flashcardTopic);
                setResult(cards); 
            } else if (action === 'explain') {
                const explanation = await explainConcept(inputs.concept, inputs.conceptLevel);
                setResult(explanation);
            }
        } catch (e) {
            console.error(e);
            alert("AI request failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId || !result) return;
        setIsSaving(true);
        
        let type: any = 'generic';
        let title = 'Saved Result';
        
        if (activeTool === 'study') { type = 'study-guide'; title = `Study Plan: ${inputs.subject}`; }
        if (activeTool === 'essay') { type = 'essay-outline'; title = `Outline: ${inputs.essayTopic}`; }
        if (activeTool === 'flashcards') { type = 'flashcards'; title = `Flashcards: ${inputs.flashcardTopic}`; }
        if (activeTool === 'homework') { type = 'generic'; title = `Explanation: ${inputs.concept}`; }

        try {
            await saveGenericDocument({
                id: crypto.randomUUID(),
                userId,
                type,
                title,
                content: result,
                createdAt: new Date().toISOString()
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (e) {
            alert("Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-neutral-50">
            {!activeTool ? (
                <div className="p-8 overflow-y-auto">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Student Toolkit</h2>
                        <p className="text-neutral-500">AI-powered tools to help you study smarter, not harder.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <button onClick={() => setActiveTool('gpa')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-green-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">GPA Calculator</h3>
                            <p className="text-sm text-neutral-500">Calculate your weighted GPA instantly.</p>
                        </button>

                        <button onClick={() => setActiveTool('study')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">AI Study Planner</h3>
                            <p className="text-sm text-neutral-500">Get a custom schedule for your exams.</p>
                        </button>

                        <button onClick={() => setActiveTool('essay')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-purple-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <PenTool className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Essay Outliner</h3>
                            <p className="text-sm text-neutral-500">Generate structured outlines for any topic.</p>
                        </button>

                        <button onClick={() => setActiveTool('flashcards')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-orange-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Copy className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Flashcard Gen</h3>
                            <p className="text-sm text-neutral-500">Create study decks from key concepts.</p>
                        </button>

                        <button onClick={() => setActiveTool('homework')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Homework Helper</h3>
                            <p className="text-sm text-neutral-500">Get clear explanations for complex topics.</p>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full">
                    {/* Header */}
                    <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => { setActiveTool(null); reset(); }} className="p-2 hover:bg-neutral-100 rounded-full">
                                <ChevronRight className="w-5 h-5 rotate-180" />
                            </button>
                            <h2 className="font-bold text-xl capitalize">{activeTool === 'gpa' ? 'GPA Calculator' : activeTool === 'homework' ? 'Homework Helper' : `${activeTool} Tool`}</h2>
                        </div>
                        {result && userId && (
                            <Button 
                                onClick={handleSave} 
                                isLoading={isSaving}
                                variant={saveSuccess ? "success" : "secondary"}
                                icon={saveSuccess ? <CheckCircle2 className="w-4 h-4"/> : <Save className="w-4 h-4"/>}
                            >
                                {saveSuccess ? 'Saved!' : 'Save to Files'}
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 min-h-[400px]">
                            
                            {/* GPA CALCULATOR */}
                            {activeTool === 'gpa' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {courses.map((course, idx) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <Input label={idx === 0 ? "Course Name" : ""} placeholder="Math 101" value={course.name} onChange={e => {
                                                        const newCourses = [...courses];
                                                        newCourses[idx].name = e.target.value;
                                                        setCourses(newCourses);
                                                    }} />
                                                </div>
                                                <div className="w-24">
                                                    <Input label={idx === 0 ? "Credits" : ""} placeholder="3" type="number" value={course.credits} onChange={e => {
                                                        const newCourses = [...courses];
                                                        newCourses[idx].credits = e.target.value;
                                                        setCourses(newCourses);
                                                    }} />
                                                </div>
                                                <div className="w-24">
                                                    <Input label={idx === 0 ? "Grade" : ""} placeholder="A" maxLength={2} value={course.grade} onChange={e => {
                                                        const newCourses = [...courses];
                                                        newCourses[idx].grade = e.target.value;
                                                        setCourses(newCourses);
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="secondary" onClick={addCourse}>Add Course</Button>
                                        <Button onClick={calculateGPA}>Calculate GPA</Button>
                                    </div>
                                    {gpa && (
                                        <div className="mt-8 text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                                            <div className="text-sm font-bold text-green-700 uppercase mb-2">Your GPA</div>
                                            <div className="text-6xl font-bold text-neutral-900">{gpa}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STUDY PLANNER */}
                            {activeTool === 'study' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <Input label="Subject / Exam" value={inputs.subject} onChange={e => handleInputChange('subject', e.target.value)} placeholder="e.g. Calculus Midterm" />
                                            <div className="grid grid-cols-2 gap-6">
                                                <Input label="Exam Date" type="date" value={inputs.examDate} onChange={e => handleInputChange('examDate', e.target.value)} />
                                                <Input label="Study Hours / Day" type="number" value={inputs.hoursPerDay} onChange={e => handleInputChange('hoursPerDay', e.target.value)} />
                                            </div>
                                            <Button onClick={() => runAI('plan')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Generate Plan</Button>
                                        </>
                                    ) : (
                                        <div className="prose prose-neutral max-w-none whitespace-pre-wrap">{result}</div>
                                    )}
                                </div>
                            )}

                            {/* ESSAY OUTLINER */}
                            {activeTool === 'essay' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <TextArea label="Essay Topic / Prompt" value={inputs.essayTopic} onChange={e => handleInputChange('essayTopic', e.target.value)} placeholder="e.g. The impact of AI on creative industries..." className="min-h-[150px]" />
                                            <Button onClick={() => runAI('essay')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Create Outline</Button>
                                        </>
                                    ) : (
                                        <div className="prose prose-neutral max-w-none whitespace-pre-wrap">{result}</div>
                                    )}
                                </div>
                            )}

                            {/* FLASHCARDS */}
                            {activeTool === 'flashcards' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <Input label="Topic" value={inputs.flashcardTopic} onChange={e => handleInputChange('flashcardTopic', e.target.value)} placeholder="e.g. Photosynthesis steps" />
                                            <Button onClick={() => runAI('flashcards')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Generate Cards</Button>
                                        </>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {Array.isArray(result) && result.map((card: any, i: number) => (
                                                <div key={i} className="bg-white border-2 border-neutral-100 rounded-xl p-6 shadow-sm hover:border-neutral-300 transition-all group perspective-1000 cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center">
                                                    <div className="font-bold text-lg mb-4 text-neutral-900">Q: {card.front}</div>
                                                    <div className="text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity border-t border-neutral-100 pt-4 w-full">
                                                        <span className="font-bold text-xs text-neutral-400 uppercase block mb-1">Answer</span>
                                                        {card.back}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* HOMEWORK HELPER */}
                            {activeTool === 'homework' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <Input label="Concept / Question" value={inputs.concept} onChange={e => handleInputChange('concept', e.target.value)} placeholder="e.g. How does a black hole work?" />
                                            <div>
                                                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Explanation Level</label>
                                                <select 
                                                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:ring-2 focus:ring-neutral-900 outline-none"
                                                    value={inputs.conceptLevel}
                                                    onChange={e => handleInputChange('conceptLevel', e.target.value)}
                                                >
                                                    <option>5 Year Old</option>
                                                    <option>Middle School</option>
                                                    <option>High School</option>
                                                    <option>College</option>
                                                    <option>Expert</option>
                                                </select>
                                            </div>
                                            <Button onClick={() => runAI('explain')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Explain It</Button>
                                        </>
                                    ) : (
                                        <div className="bg-indigo-50 p-8 rounded-2xl text-indigo-900 leading-relaxed whitespace-pre-wrap border border-indigo-100">
                                            <div className="flex items-center gap-2 mb-4 font-bold text-indigo-700 uppercase text-xs tracking-wider">
                                                <Sparkles className="w-4 h-4" /> AI Explanation
                                            </div>
                                            {result}
                                        </div>
                                    )}
                                </div>
                            )}

                            {result && (
                                <div className="mt-8 pt-8 border-t border-neutral-100 flex justify-center">
                                    <Button variant="secondary" onClick={() => setResult(null)}>Start Over</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
