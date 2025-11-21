
import React from 'react';

interface TemplateThumbnailProps {
  templateId: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ templateId, selected, onClick, color = '#000000' }) => {
  const baseClass = `relative w-full aspect-[210/297] bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-300 group hover:shadow-lg ${selected ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-neutral-200 hover:border-neutral-300'}`;

  const renderPreview = () => {
    switch (templateId) {
      case 'creative':
        return (
          <div className="flex h-full w-full">
            <div className="w-[35%] h-full p-2 flex flex-col gap-2" style={{ backgroundColor: color }}>
              <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2"></div>
              <div className="h-1 bg-white/20 w-3/4 mx-auto rounded-full"></div>
              <div className="h-1 bg-white/20 w-1/2 mx-auto rounded-full"></div>
              <div className="mt-4 space-y-1">
                <div className="h-1 bg-white/20 w-full rounded-full"></div>
                <div className="h-1 bg-white/20 w-full rounded-full"></div>
                <div className="h-1 bg-white/20 w-full rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-2">
              <div className="h-3 bg-neutral-100 w-3/4 rounded-full mb-2"></div>
              <div className="space-y-1 mb-3">
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
              </div>
              <div className="h-2 bg-neutral-100 w-1/2 rounded-full mb-1"></div>
              <div className="space-y-1">
                <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'professional':
        return (
          <div className="h-full w-full p-3 flex flex-col">
            <div className="border-b-2 border-neutral-200 pb-2 mb-3">
              <div className="h-3 bg-neutral-800 w-1/2 rounded-full mb-2"></div>
              <div className="h-1 bg-neutral-200 w-full rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="h-2 bg-neutral-300 w-1/4 rounded-full mb-1"></div>
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
              </div>
              <div>
                <div className="h-2 bg-neutral-300 w-1/4 rounded-full mb-1"></div>
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="h-full w-full p-4 flex flex-col items-center text-center">
            <div className="h-3 bg-neutral-800 w-1/2 rounded-full mb-2"></div>
            <div className="h-1 bg-neutral-200 w-2/3 rounded-full mb-6"></div>
            
            <div className="w-full space-y-4 text-left">
              <div className="space-y-1">
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-100 w-5/6 rounded-full"></div>
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-neutral-100 w-full rounded-full"></div>
                <div className="h-1 bg-neutral-100 w-4/5 rounded-full"></div>
              </div>
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="h-full w-full p-3 flex flex-col">
            <div className="text-center border-b border-neutral-100 pb-3 mb-3">
               <div className="h-3 bg-neutral-800 w-2/3 mx-auto rounded-full mb-1"></div>
               <div className="h-1 bg-neutral-200 w-1/3 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-3">
               <div className="flex gap-2">
                   <div className="w-1/3">
                       <div className="h-1.5 bg-neutral-200 w-full rounded-full mb-1"></div>
                       <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
                   </div>
                   <div className="flex-1">
                       <div className="h-1.5 bg-neutral-200 w-full rounded-full mb-1"></div>
                       <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
                       <div className="h-1 bg-neutral-50 w-5/6 rounded-full"></div>
                   </div>
               </div>
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="h-full w-full p-3 flex flex-col bg-neutral-50 font-mono">
             <div className="h-3 bg-neutral-900 w-1/2 rounded-none mb-1"></div>
             <div className="h-1 bg-neutral-400 w-3/4 rounded-none mb-4"></div>
             <div className="space-y-2">
                 <div className="flex gap-1">
                     <div className="w-1 h-full bg-neutral-300"></div>
                     <div className="flex-1 space-y-1">
                         <div className="h-1.5 bg-neutral-300 w-1/3"></div>
                         <div className="h-1 bg-neutral-200 w-full"></div>
                     </div>
                 </div>
             </div>
          </div>
        );

      default: // Modern
        return (
          <div className="h-full w-full p-3 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1 w-2/3">
                <div className="h-3 bg-neutral-800 w-3/4 rounded-full"></div>
                <div className="h-1 bg-neutral-200 w-1/2 rounded-full"></div>
              </div>
              <div className="w-6 h-6 rounded bg-neutral-100"></div>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 bg-neutral-100 w-1/4 rounded-full"></div>
              <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
              <div className="h-1 bg-neutral-50 w-full rounded-full"></div>
              <div className="h-1 bg-neutral-50 w-3/4 rounded-full"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div onClick={onClick} className={baseClass}>
      {renderPreview()}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur-sm border-t border-neutral-100 text-center">
        <span className={`text-xs font-bold uppercase tracking-wider ${selected ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
        </span>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-md">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};
