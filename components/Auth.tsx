
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

    const handleSpotifyLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'spotify',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
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

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleSpotifyLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-full text-neutral-700 font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Spotify-Logo--Streamline-Logos-Block" height="20" width="20">
                    <desc>Spotify Logo Streamline Icon: https://streamlinehq.com</desc>
                    <path fill="#000000" fillRule="evenodd" d="M5 1a4 4 0 0 0 -4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4 -4V5a4 4 0 0 0 -4 -4H5Zm14.5 11a7.5 7.5 0 1 1 -15 0 7.5 7.5 0 0 1 15 0Zm-7.798 -2.331c-1.564 -0.048 -2.987 0.178 -3.797 0.394a0.682 0.682 0 1 1 -0.351 -1.318c0.932 -0.248 2.487 -0.492 4.19 -0.439 1.698 0.053 3.61 0.401 5.201 1.4a0.682 0.682 0 1 1 -0.724 1.155c-1.308 -0.82 -2.95 -1.143 -4.52 -1.192ZM8.29 12.734c0.626 -0.19 1.76 -0.391 3.047 -0.346 1.286 0.046 2.673 0.337 3.851 1.084a0.682 0.682 0 1 0 0.73 -1.152c-1.446 -0.916 -3.093 -1.243 -4.532 -1.294 -1.44 -0.051 -2.723 0.17 -3.49 0.403a0.682 0.682 0 0 0 0.394 1.305Zm3.058 2.192a10.48 10.48 0 0 0 -2.854 0.259 0.682 0.682 0 1 1 -0.331 -1.323c0.744 -0.186 1.96 -0.36 3.251 -0.298 1.28 0.062 2.726 0.361 3.844 1.21a0.682 0.682 0 0 1 -0.825 1.086c-0.803 -0.61 -1.93 -0.878 -3.085 -0.934Z" clipRule="evenodd" strokeWidth="1"></path>
                </svg>
                Spotify
            </button>

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
