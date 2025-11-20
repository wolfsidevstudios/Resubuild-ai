
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputField';
import { AlertCircle, CheckCircle2, Briefcase, User } from 'lucide-react';

interface AuthProps {
    onSuccess: () => void;
    defaultView?: 'signin' | 'signup';
}

// Add type definition for Google Identity Services
declare global {
    interface Window {
        google: any;
    }
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

    // Initialize Google Sign-In
    useEffect(() => {
        const handleGoogleCredentialResponse = async (response: any) => {
            setLoading(true);
            setError(null);
            try {
                const { error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: response.credential,
                });
                if (error) throw error;
                onSuccess();
            } catch (err: any) {
                console.error("Google Auth Error:", err);
                setError(err.message || 'Failed to sign in with Google');
            } finally {
                setLoading(false);
            }
        };

        const initializeGoogleBtn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: '127898517822-9kedtn413hjan7t2t3gc8lbqdvu38al4.apps.googleusercontent.com',
                    callback: handleGoogleCredentialResponse
                });
                
                const btnDiv = document.getElementById('google-btn');
                if (btnDiv) {
                    window.google.accounts.id.renderButton(
                        btnDiv,
                        { theme: "outline", size: "large", width: "100%", text: view === 'signin' ? "signin_with" : "signup_with" }
                    );
                }
            }
        };

        // Retry until script loads
        const timer = setInterval(() => {
            if (window.google) {
                initializeGoogleBtn();
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [view, onSuccess]);

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

            {/* Google Sign-In Button Container */}
            <div id="google-btn" className="w-full flex justify-center"></div>

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
