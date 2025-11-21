
import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { setTrainingConsent } from '../services/firebase';

interface DataConsentModalProps {
    userId: string;
    onClose: () => void;
}

export const DataConsentModal: React.FC<DataConsentModalProps> = ({ userId, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDecision = async (consent: boolean) => {
        setIsSubmitting(true);
        try {
            await setTrainingConsent(userId, consent);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                
                <div className="bg-neutral-50 p-6 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-neutral-900">
                        <Shield className="w-5 h-5 text-blue-600" /> Data Privacy & AI Training
                    </h2>
                </div>

                <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-neutral-800 font-medium">Help us build smarter career tools.</p>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                We are asking for your permission to include your anonymized resume designs and data in our internal training sets for future AI models.
                            </p>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-4 mb-8 space-y-3 border border-neutral-100">
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Your data will <strong>never be sold</strong> to third parties.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Data remains securely in our <strong>internal databases</strong>.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>You have the <strong>right to report</strong> misuse at any time.</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => handleDecision(true)} 
                            isLoading={isSubmitting}
                            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white"
                        >
                            Allow Training Access
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={() => handleDecision(false)} 
                            disabled={isSubmitting}
                            className="w-full py-3"
                        >
                            No, keep my data private
                        </Button>
                    </div>
                    
                    <p className="text-[10px] text-center text-neutral-400 mt-4">
                        You can change this setting at any time in your account profile.
                    </p>
                </div>
            </div>
        </div>
    );
};
