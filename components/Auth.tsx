
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputField';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // If email confirmation is disabled in Supabase settings, 
                // we get a session immediately. Log them in.
                if (data.session) {
                    onSuccess();
                } else {
                    // Otherwise, prompt for verification
                    setMsg('Account created! Please check your email to verify your account.');
                }
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
        <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                    {view === 'signin' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-neutral-500">
                    {view === 'signin' 
                        ? 'Enter your details to access your workspace.' 
                        : 'Start building your professional resume for free.'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
                <Input 
                    label="Email Address" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="name@company.com" 
                    required
                    className="bg-white"
                />
                <Input 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required
                    minLength={6}
                    className="bg-white"
                />

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
                        <span>{error}</span>
                    </div>
                )}
                
                {msg && (
                    <div className="p-4 rounded-xl bg-green-50 text-green-600 text-sm flex items-center gap-2 border border-green-100">
                        <CheckCircle2 className="w-4 h-4" /> {msg}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full py-3 text-base" 
                    isLoading={loading}
                    variant="primary"
                >
                    {view === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-neutral-600">
                    {view === 'signin' ? "New to Resubuild? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setView(view === 'signin' ? 'signup' : 'signin');
                            setError(null);
                            setMsg(null);
                        }}
                        className="font-bold text-neutral-900 hover:underline focus:outline-none ml-1"
                    >
                        {view === 'signin' ? 'Create an account' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};
