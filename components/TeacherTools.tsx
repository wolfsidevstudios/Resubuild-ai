
import React, { useState } from 'react';
import { BookOpen, ClipboardList, CheckSquare, FileText, ChevronRight, Sparkles, Printer } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { generateLessonPlan, generateQuiz, generateRubric } from '../services/geminiService';

export const TeacherTools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [inputs, setInputs] = useState({
        subject: '',
        grade: '',
        topic: '',
        quizTopic: '',
        quizCount: '5',
        assignmentType: ''
    });

    const handleInputChange = (key: string, value: string) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const reset = () => {
        setResult(null);
        setLoading(false);
    };

    const runAI = async (action: 'lesson' | 'quiz' | 'rubric') => {
        setLoading(true);
        setResult(null);
        try {
            if (action === 'lesson') {
                const plan = await generateLessonPlan(inputs.subject, inputs.grade, inputs.topic);
                setResult(plan);
            } else if (action === 'quiz') {
                const quiz = await generateQuiz(inputs.quizTopic, inputs.grade, parseInt(inputs.quizCount));
                setResult(quiz);
            } else if (action === 'rubric') {
                const rubric = await generateRubric(inputs.assignmentType, inputs.grade);
                setResult(rubric);
            }
        } catch (e) {
            console.error(e);
            alert("AI request failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-neutral-50">
            {!activeTool ? (
                <div className="p-8 overflow-y-auto">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Teacher Studio</h2>
                        <p className="text-neutral-500">Save hours of prep time with AI-generated classroom materials.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <button onClick={() => setActiveTool('lesson')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Lesson Planner</h3>
                            <p className="text-sm text-neutral-500">Create structured lesson plans in seconds.</p>
                        </button>

                        <button onClick={() => setActiveTool('quiz')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-green-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CheckSquare className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Quiz Generator</h3>
                            <p className="text-sm text-neutral-500">Generate multiple choice quizzes with keys.</p>
                        </button>

                        <button onClick={() => setActiveTool('rubric')} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-purple-500 hover:shadow-lg transition-all text-left group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Rubric Maker</h3>
                            <p className="text-sm text-neutral-500">Build grading rubrics for any assignment.</p>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full">
                    <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-4">
                        <button onClick={() => { setActiveTool(null); reset(); }} className="p-2 hover:bg-neutral-100 rounded-full">
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="font-bold text-xl capitalize">{activeTool.replace(/([A-Z])/g, ' $1').trim()}</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 min-h-[400px]">
                            
                            {/* LESSON PLANNER */}
                            {activeTool === 'lesson' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-6">
                                                <Input label="Subject" value={inputs.subject} onChange={e => handleInputChange('subject', e.target.value)} placeholder="e.g. History" />
                                                <Input label="Grade Level" value={inputs.grade} onChange={e => handleInputChange('grade', e.target.value)} placeholder="e.g. 8th Grade" />
                                            </div>
                                            <Input label="Topic / Unit" value={inputs.topic} onChange={e => handleInputChange('topic', e.target.value)} placeholder="e.g. The Industrial Revolution" />
                                            <Button onClick={() => runAI('lesson')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Generate Plan</Button>
                                        </>
                                    ) : (
                                        <div className="prose prose-neutral max-w-none whitespace-pre-wrap">{result}</div>
                                    )}
                                </div>
                            )}

                            {/* QUIZ GENERATOR */}
                            {activeTool === 'quiz' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <Input label="Quiz Topic" value={inputs.quizTopic} onChange={e => handleInputChange('quizTopic', e.target.value)} placeholder="e.g. Photosynthesis" />
                                            <div className="grid grid-cols-2 gap-6">
                                                <Input label="Grade Level" value={inputs.grade} onChange={e => handleInputChange('grade', e.target.value)} placeholder="e.g. 5th Grade" />
                                                <Input label="Number of Questions" type="number" value={inputs.quizCount} onChange={e => handleInputChange('quizCount', e.target.value)} />
                                            </div>
                                            <Button onClick={() => runAI('quiz')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Create Quiz</Button>
                                        </>
                                    ) : (
                                        <div className="space-y-6">
                                            {Array.isArray(result) && result.map((q: any, i: number) => (
                                                <div key={i} className="p-6 border border-neutral-100 rounded-xl bg-neutral-50">
                                                    <div className="font-bold text-lg mb-3">{i + 1}. {q.question}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {q.options.map((opt: string, idx: number) => (
                                                            <div key={idx} className={`px-4 py-2 rounded-lg text-sm ${opt === q.answer ? 'bg-green-100 text-green-800 font-bold' : 'bg-white border border-neutral-200'}`}>
                                                                {String.fromCharCode(65 + idx)}. {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RUBRIC MAKER */}
                            {activeTool === 'rubric' && (
                                <div className="space-y-6">
                                    {!result ? (
                                        <>
                                            <Input label="Assignment Type" value={inputs.assignmentType} onChange={e => handleInputChange('assignmentType', e.target.value)} placeholder="e.g. Persuasive Essay, Science Project" />
                                            <Input label="Grade Level" value={inputs.grade} onChange={e => handleInputChange('grade', e.target.value)} placeholder="e.g. High School" />
                                            <Button onClick={() => runAI('rubric')} isLoading={loading} className="w-full py-4" icon={<Sparkles className="w-4 h-4" />}>Generate Rubric</Button>
                                        </>
                                    ) : (
                                        <div className="prose prose-neutral max-w-none whitespace-pre-wrap overflow-x-auto">
                                            {result}
                                        </div>
                                    )}
                                </div>
                            )}

                            {result && (
                                <div className="mt-8 pt-8 border-t border-neutral-100 flex justify-between">
                                    <Button variant="secondary" onClick={() => setResult(null)}>Start Over</Button>
                                    <Button variant="primary" icon={<Printer className="w-4 h-4"/>} onClick={() => window.print()}>Print</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
