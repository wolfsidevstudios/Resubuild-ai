
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from './Button';

export const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('resubuild_cookie_consent');
        if (!consent) {
            // Short delay to not annoy immediately on load
            const t = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(t);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('resubuild_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[200] p-4 md:p-6 animate-in slide-in-from-bottom-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600 hidden md:block">
                        <Cookie className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900 mb-1">We use cookies</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
                            We also share information about your use of our site with our advertising and analytics partners.
                            <a href="/privacy" className="text-neutral-900 underline ml-1 hover:text-blue-600">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button onClick={handleAccept} className="w-full md:w-auto whitespace-nowrap px-8">
                        Accept All
                    </Button>
                    <button 
                        onClick={() => setIsVisible(false)} 
                        className="p-2 hover:bg-neutral-100 rounded-full md:hidden"
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};
