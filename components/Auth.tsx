
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputField';
import { AlertCircle, CheckCircle2, Briefcase, User } from 'lucide-react';

interface AuthProps {
    onSuccess: () => void;
    defaultView?: 'signin' | 'signup';
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, defaultView = 'signin' }) => {
    const [view, setView] = useState<'signin' | 'signup'>(defaultView);
    const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
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
                // Sign Up with Metadata
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role // 'candidate' or 'employer'
                        }
                    }
                });
                if (error) throw error;

                if (data.session) {
                    onSuccess();
                } else {
                    setMsg('Account created! Please check your email to verify your account.');
                }
            } else {
                // Sign In
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            let errorMessage = err.message || 'An error occurred';
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
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                    {view === 'signin' ? 'Welcome back' : 'Join Resubuild'}
                </h2>
                <p className="text-neutral-500">
                    {view === 'signin' 
                        ? 'Access your dashboard.' 
                        : 'Create your professional identity.'}
                </p>
            </div>

            {view === 'signup' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                        type="button"
                        onClick={() => setRole('candidate')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${role === 'candidate' ? 'border-neutral-900 bg-neutral-50 text-neutral-900' : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'}`}
                    >
                        <User className="w-6 h-6 mb-2" />
                        <span className="font-bold text-sm">Job Seeker</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('employer')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${role === 'employer' ? 'border-neutral-900 bg-neutral-50 text-neutral-900' : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'}`}
                    >
                        <Briefcase className="w-6 h-6 mb-2" />
                        <span className="font-bold text-sm">Employer</span>
                    </button>
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
                {view === 'signup' && (
                     <Input 
                        label={role === 'employer' ? "Company Name" : "Full Name"}
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        placeholder={role === 'employer' ? "Acme Inc." : "John Doe"}
                        required
                        className="bg-white"
                    />
                )}
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
                    {view === 'signin' ? 'Sign In' : `Sign Up as ${role === 'employer' ? 'Brand' : 'Employee'}`}
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

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-full text-neutral-700 font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 disabled:opacity-50"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

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
            </div>

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
