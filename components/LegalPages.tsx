
import React from 'react';
import { ArrowLeft, FileText, Shield, Lock } from 'lucide-react';
import { Button } from './Button';

export const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 md:p-12">
                <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-neutral-600">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <h1 className="text-4xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                    <FileText className="w-8 h-8" /> Terms of Service
                </h1>
                <p className="text-neutral-500 mb-8">Last Updated: February 2025</p>

                <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using Resubuild ("the Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">2. Use of Service</h2>
                        <p>Resubuild provides AI-powered resume building and career tools. You agree to use these tools for lawful purposes only. You are responsible for maintaining the confidentiality of your account and password.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">3. Content & Conduct</h2>
                        <p>You retain rights to the resumes you create. However, by using our AI features, you grant us a non-exclusive license to process your data to provide the service. You agree not to upload illegal, offensive, or malicious content.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">4. AI Training Data</h2>
                        <p>We may use anonymized data to improve our AI models. You can opt-out of this in your account settings (see Privacy Policy).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">5. Termination</h2>
                        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">6. Limitation of Liability</h2>
                        <p>In no event shall Resubuild, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 md:p-12">
                <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-neutral-600">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <h1 className="text-4xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                    <Shield className="w-8 h-8" /> Privacy Policy
                </h1>
                <p className="text-neutral-500 mb-8">Last Updated: February 2025</p>

                <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, build a resume, or communicate with us. This includes personal contact information, work history, education, and skills.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to generate AI-powered content for your resume, and to communicate with you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">3. Data Security</h2>
                        <p>Your data is stored securely using Google Cloud Firestore and industry-standard encryption. We do not sell your personal data to third parties.</p>
                    </section>

                    <section>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-6">
                            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2"><Lock className="w-4 h-4"/> AI Training Consent</h3>
                            <p className="text-blue-800 text-sm">
                                We may ask for your permission to use anonymized resume structures to train our AI models. This data stays internal and helps us build better formatting tools. You have full control to toggle this permission in your Settings &gt; Privacy &amp; Data tab.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">4. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal data. You can download all your data from your account settings or the account suspension page.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-neutral-900 mb-3">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@resubuild.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
