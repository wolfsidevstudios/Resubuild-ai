
import React from 'react';
import { ArrowLeft, Users, Mail, Shield, Globe, Award } from 'lucide-react';
import { Button } from './Button';

export const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 md:p-12">
                <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-neutral-600">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">About Resubuild</h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                        We are on a mission to democratize career success by putting powerful, AI-driven tools into the hands of every job seeker, completely free.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">For Everyone</h3>
                        <p className="text-sm text-neutral-600">Whether you are a CEO or a student, our tools adapt to your level.</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Privacy First</h3>
                        <p className="text-sm text-neutral-600">We believe your data belongs to you. We do not sell user data to third parties.</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Industry Standard</h3>
                        <p className="text-sm text-neutral-600">Our templates are tested against top ATS systems to ensure deliverability.</p>
                    </div>
                </div>

                <div className="prose prose-neutral max-w-none space-y-8 text-neutral-800 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                        <p>
                            Resubuild started with a simple observation: the job market is changing faster than candidates can adapt. 
                            Traditional resume builders are static, expensive, and outdated. We built Resubuild to bridge the gap between 
                            human creativity and artificial intelligence. By leveraging Google's Gemini models, we allow users to "chat" 
                            with their resume, refining it in real-time just like they would with a professional career coach.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
                        <p>
                            We utilize state-of-the-art Large Language Models (LLMs) to analyze job descriptions and optimize candidate profiles. 
                            Our platform is built on a secure, scalable infrastructure ensuring zero downtime and maximum data protection. 
                            Features like our "Design Pilot" allow for experimental, AI-generated UI/UX that pushes the boundaries of what a resume can look like.
                        </p>
                    </section>

                    <section className="bg-neutral-900 text-white p-8 rounded-2xl mt-12">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Mail className="w-6 h-6" /> Contact Us
                        </h2>
                        <p className="text-neutral-300 mb-6">
                            Have questions about our tools, partnerships, or just want to say hi? We'd love to hear from you.
                        </p>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div>
                                <div className="text-xs font-bold text-neutral-500 uppercase mb-1">General Inquiries</div>
                                <a href="mailto:hello@resubuild.com" className="text-lg font-medium hover:underline">hello@resubuild.com</a>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Support & Inquiries</div>
                                <a href="mailto:emartinezra2121@gmail.com" className="text-lg font-medium hover:underline">emartinezra2121@gmail.com</a>
                                <p className="text-xs text-neutral-400 mt-1">
                                    (Official Support Channel. Also available for business inquiries.)
                                </p>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Location</div>
                                <div className="text-lg font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> San Francisco, CA
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
