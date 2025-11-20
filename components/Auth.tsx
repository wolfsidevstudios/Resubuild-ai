import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputField';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthProps {
    onSuccess: () => void;
    defaultView?: 'signin' | 'signup';
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, defaultView = 'signin' }) => {
    const [view, setView] = useState<'signin' | 'signup'>(defaultView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMsg(null);

        try {
            if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMsg('Account created! Please check your email to verify your account.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            let errorMessage = err.message || 'An error occurred';
            
            // Helper for the specific "Database error" which confuses many users
            if (errorMessage.includes('Database error saving new user')) {
                errorMessage = 'System Error: The Supabase database trigger failed. Please ensure your database table "public.profiles" exists.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    {view === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-neutral-500 text-sm">
                    {view === 'signin' 
                        ? 'Enter your details to access your resumes.' 
                        : 'Start building your professional resume for free.'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <Input 
                    label="Email Address" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required
                />
                <Input 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required
                    minLength={6}
                />

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
                        <span>{error}</span>
                    </div>
                )}
                
                {msg && (
                    <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {msg}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full" 
                    isLoading={loading}
                    variant="primary"
                >
                    {view === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                    {view === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setView(view === 'signin' ? 'signup' : 'signin');
                            setError(null);
                            setMsg(null);
                        }}
                        className="font-semibold text-neutral-900 hover:underline focus:outline-none"
                    >
                        {view === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};