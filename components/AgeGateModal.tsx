
import React, { useState } from 'react';
import { User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { Input } from './InputField';

interface AgeGateModalProps {
    onComplete: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ onComplete }) => {
    const [age, setAge] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ageNum = parseInt(age);
        
        if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
            setError("Please enter a valid age.");
            return;
        }

        // Store age
        localStorage.setItem('resubuild_user_age', age);

        // Logic for Ad Personalization
        // If under 18 (or regional equivalent), we prefer non-personalized ads
        if (ageNum < 18) {
            localStorage.setItem('resubuild_npa', '1');
        } else {
            localStorage.removeItem('resubuild_npa');
        }

        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[250] bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-neutral-200">
                
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm">
                        <User className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-neutral-900 mb-3">One quick question</h2>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                        To provide the best experience and show you relevant ads that keep Resubuild free, please tell us your age.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-left">
                            <Input 
                                label="Your Age" 
                                type="number" 
                                placeholder="e.g. 24" 
                                value={age}
                                onChange={(e) => {
                                    setAge(e.target.value);
                                    setError('');
                                }}
                                min={1}
                                max={120}
                                autoFocus
                                className="text-center text-lg font-bold tracking-widest"
                            />
                            {error && <p className="text-red-500 text-xs mt-2 font-medium text-center">{error}</p>}
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-xs text-neutral-400 text-left flex gap-3">
                            <ShieldCheck className="w-8 h-8 shrink-0 text-neutral-300" />
                            <p>
                                We use this information to ensure compliance with digital privacy laws and to tailor advertising settings. Your exact age is stored locally on your device.
                            </p>
                        </div>

                        <Button type="submit" className="w-full py-4 text-lg shadow-xl" disabled={!age}>
                            Continue <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
