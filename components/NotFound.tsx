
import React from 'react';
import { FileQuestion, ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from './Button';

interface NotFoundProps {
  onHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onHome }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neutral-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg w-full animate-in fade-in zoom-in-95 duration-500">
        
        {/* 404 Graphic */}
        <div className="relative mb-12 select-none">
            {/* The big 404 text behind */}
            <div className="text-[180px] md:text-[220px] font-bold leading-none text-white drop-shadow-xl text-shadow-lg tracking-tighter">
                404
            </div>
            
            {/* Floating Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative animate-float">
                    <div className="w-24 h-32 bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col items-center justify-center rotate-12">
                        <FileQuestion className="w-10 h-10 text-neutral-300" />
                        <div className="mt-4 w-12 h-1 bg-neutral-100 rounded-full"></div>
                        <div className="mt-2 w-8 h-1 bg-neutral-100 rounded-full"></div>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-4 -right-4 w-4 h-4 bg-neutral-900 rounded-full opacity-20 animate-bounce delay-100"></div>
                    <div className="absolute bottom-2 -left-6 w-2 h-2 bg-neutral-400 rounded-full opacity-40 animate-ping"></div>
                </div>
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
                    Page not found
                </h1>
                <p className="text-neutral-500 text-lg leading-relaxed">
                    Sorry, the resume or page you're looking for doesn't exist, has been removed, or is temporarily unavailable.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto px-8 py-3 rounded-full border border-neutral-200 text-neutral-600 font-medium hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <Button 
                    onClick={onHome}
                    className="w-full sm:w-auto px-8 py-3 h-auto rounded-full shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20"
                    icon={<Home className="w-4 h-4" />}
                >
                    Back to Home
                </Button>
            </div>
        </div>

      </div>

      {/* Footer Note */}
      <div className="absolute bottom-8 text-neutral-400 text-xs font-medium">
          Error Code: 404_RESUME_NOT_FOUND
      </div>
    </div>
  );
};
