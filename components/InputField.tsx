import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <input
      className={`w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors ${className}`}
      {...props}
    />
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <textarea
      className={`w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors min-h-[100px] resize-y ${className}`}
      {...props}
    />
  </div>
);