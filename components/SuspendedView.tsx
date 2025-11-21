
import React, { useState } from 'react';
import { AlertTriangle, Download, Trash2, CheckCircle2, Lock } from 'lucide-react';
import { acceptTermsOfService, deleteUserAccount, downloadUserData, signOut } from '../services/firebase';
import { Button } from './Button';

interface SuspendedViewProps {
    userId: string;
    onReactivate: () => void;
}

export const SuspendedView: React.FC<SuspendedViewProps> = ({ userId, onReactivate }) => {
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await acceptTermsOfService(userId);
            onReactivate();
        } catch (error) {
            alert("Error reactivating account.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadUserData(userId);
        } catch (error) {
            alert("Error downloading data.");
        } finally {
            setDownloading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("PERMANENT ACTION: This will delete your account and all data forever. This cannot be undone. Are you sure?")) {
            setLoading(true);
            try {
                await deleteUserAccount();
                window.location.href = "/"; // Force redirect to landing
            } catch (error) {
                alert("Error deleting account. Please sign in again to verify identity.");
                await signOut();
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-red-100">
                <div className="bg-red-600 p-8 text-center">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Account Suspended</h1>
                    <p className="text-red-100">Action Required: Terms of Service Declined</p>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-red-800 text-sm leading-relaxed">
                            You have declined our mandatory Terms of Service. As a result, your access to Resubuild is disabled. 
                            <br/><br/>
                            <strong>Warning:</strong> If you take no action, your account data will be automatically scheduled for deletion in 30 days.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button 
                            onClick={handleAccept}
                            isLoading={loading} 
                            className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                            icon={<CheckCircle2 className="w-5 h-5" />}
                        >
                            Accept Terms & Reactivate
                        </Button>

                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-neutral-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold">Or manage your data</span>
                            <div className="flex-grow border-t border-neutral-200"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={handleDownload}
                                disabled={downloading || loading}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors group"
                            >
                                <Download className="w-6 h-6 text-neutral-600 group-hover:text-neutral-900 mb-2" />
                                <span className="text-sm font-bold text-neutral-700">Download My Data</span>
                            </button>
                            
                            <button 
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors group"
                            >
                                <Trash2 className="w-6 h-6 text-red-500 group-hover:text-red-600 mb-2" />
                                <span className="text-sm font-bold text-red-600">Delete Forever</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button onClick={() => signOut()} className="text-neutral-400 text-sm hover:text-neutral-600 font-medium underline">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};