
import React, { useState } from 'react';
import { FileText, Shield, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { acceptTermsOfService, declineTermsOfService } from '../services/firebase';
import { Button } from './Button';

interface TermsModalProps {
    userId: string;
    onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ userId, onAccept }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            await acceptTermsOfService(userId);
            onAccept();
        } catch (error) {
            console.error(error);
            alert("Failed to accept terms. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecline = async () => {
        if (confirm("If you decline, your account will be immediately suspended and you will lose access to the app. Are you sure?")) {
            setIsLoading(true);
            try {
                await declineTermsOfService(userId);
                window.location.reload(); // Force reload to trigger suspended view
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-neutral-200">
                <div className="p-8 border-b border-neutral-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Update to our Terms</h2>
                    <p className="text-neutral-500">
                        To continue using Resubuild, please review and accept our updated Terms of Service and Privacy Policy.
                    </p>
                </div>

                <div className="p-8 space-y-6 bg-neutral-50/50">
                    <div className="flex gap-4">
                        <Shield className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" />
                        <div className="text-sm text-neutral-600">
                            <strong>Data Privacy:</strong> We are committed to protecting your data. We do not sell your personal information.
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" />
                        <div className="text-sm text-neutral-600">
                            <strong>Account Suspension:</strong> Acceptance is mandatory. Declining will result in immediate account suspension and limited access.
                        </div>
                    </div>
                    
                    <div className="text-xs text-center text-neutral-400 mt-4">
                        By clicking Accept, you agree to the <a href="/terms" target="_blank" className="underline hover:text-neutral-900">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline hover:text-neutral-900">Privacy Policy</a>.
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button 
                            onClick={handleAccept} 
                            isLoading={isLoading}
                            className="w-full py-4 text-lg bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl"
                        >
                            Accept & Continue <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <button 
                            onClick={handleDecline}
                            disabled={isLoading}
                            className="w-full py-3 text-sm font-bold text-neutral-400 hover:text-red-600 transition-colors"
                        >
                            Decline and Suspend Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};