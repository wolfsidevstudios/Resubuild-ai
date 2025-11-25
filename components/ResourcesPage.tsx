
import React from 'react';
import { ArrowLeft, BookOpen, FileText, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { AdUnit } from './AdUnit';

export const ResourcesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <nav className="border-b border-neutral-200 px-6 py-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-neutral-600">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <span className="font-bold text-lg">Kyndra Resources</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Career Guides & Insights</h1>
                    <p className="text-xl text-neutral-500">Expert advice on building resumes, passing interviews, and navigating the modern job market.</p>
                </div>

                {/* Ad Banner to show valuable inventory placement */}
                <div className="mb-12">
                    <AdUnit slot="1234567890" style={{ minHeight: '100px' }} />
                </div>

                <div className="space-y-16">
                    {/* Article 1: ATS Systems */}
                    <article className="prose prose-neutral max-w-none">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-4">
                            <Target className="w-4 h-4" /> Technical Guide
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-6">How to Beat the ATS: The Ultimate Guide to Applicant Tracking Systems</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                            75% of resumes are never seen by a human eye. Instead, they are filtered out by Applicant Tracking Systems (ATS). To land an interview in 2025, you need to write for robots first, and humans second.
                        </p>
                        
                        <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">1. Keep Formatting Simple</h3>
                        <p className="text-neutral-600 mb-4">
                            While creative resumes look great, ATS parsers struggle with columns, graphics, and tables. 
                            Kyndra Workspace uses a single-column layout in "ATS Mode" to ensure 100% readability. 
                            Avoid using headers or footers for critical contact info, as some older systems ignore them.
                        </p>

                        <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">2. Keywords are King</h3>
                        <p className="text-neutral-600 mb-4">
                            ATS algorithms scan for specific keywords found in the job description. If a job asks for "React.js" and "TypeScript", 
                            and your resume only says "Frontend Development", you might be scored lower. Use our <strong>Job Matcher</strong> tool 
                            to compare your resume against the JD and identify missing keywords.
                        </p>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8">
                            <h4 className="font-bold text-blue-900 mb-2">Pro Tip:</h4>
                            <p className="text-sm text-blue-800">
                                Don't "keyword stuff" by hiding white text on a white background. Modern parsers detect this and will flag your application as spam. Instead, weave keywords naturally into your bullet points.
                            </p>
                        </div>
                    </article>

                    <hr className="border-neutral-100" />

                    {/* Article 2: Bullet Points */}
                    <article className="prose prose-neutral max-w-none">
                        <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-wider mb-4">
                            <FileText className="w-4 h-4" /> Writing Tips
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-6">The X-Y-Z Formula for Winning Bullet Points</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                            Google Recruiters often recommend the "X-Y-Z formula" for resume bullet points: "Accomplished [X] as measured by [Y], by doing [Z]."
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-8">
                            <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                                <div className="font-bold text-red-800 mb-2">❌ Weak Example</div>
                                <p className="text-sm text-red-700">"Responsible for growing the email list and sending newsletters."</p>
                            </div>
                            <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                                <div className="font-bold text-green-800 mb-2">✅ Strong Example</div>
                                <p className="text-sm text-green-700">"Grew email subscriber list by <strong>40% (from 10k to 14k)</strong> in Q3 by implementing a new A/B testing strategy for landing pages."</p>
                            </div>
                        </div>

                        <p className="text-neutral-600 mb-4">
                            Focus on <strong>impact</strong>, not just responsibilities. Use Kyndra's <strong>Metric Booster</strong> tool to automatically suggest ways to quantify your experience if you are struggling to find the numbers.
                        </p>
                    </article>

                    <hr className="border-neutral-100" />

                    {/* Article 3: Career Change */}
                    <article className="prose prose-neutral max-w-none">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider mb-4">
                            <TrendingUp className="w-4 h-4" /> Career Strategy
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-6">Pivoting Careers? Highlight Transferable Skills</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                            Changing industries is daunting, but you likely have more relevant experience than you think. The key is reframing your past experience to match your future role.
                        </p>
                        
                        <ul className="space-y-4 my-6">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-neutral-600"><strong>Teachers to Tech:</strong> Highlight presentation skills as "Stakeholder Communication" and lesson planning as "Curriculum Development" or "Project Management".</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-neutral-600"><strong>Retail to Sales:</strong> Customer service becomes "Client Relationship Management" and upselling becomes "Revenue Growth".</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-neutral-600"><strong>Use the Hybrid Resume Format:</strong> Consider adding a "Relevant Skills" section above your work history to draw attention to your capabilities before your timeline.</span>
                            </li>
                        </ul>
                    </article>
                </div>

                <div className="mt-16 p-8 bg-neutral-900 rounded-3xl text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Ready to apply these tips?</h3>
                    <p className="text-neutral-400 mb-8 max-w-lg mx-auto">Join thousands of professionals using Kyndra Workspace to automate the boring parts of job hunting.</p>
                    <Button onClick={onBack} className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 text-lg h-auto rounded-full">
                        Build My Resume Now
                    </Button>
                </div>
            </main>
        </div>
    );
};
