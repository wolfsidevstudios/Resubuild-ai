
import React, { useState, useEffect, useRef } from 'react';
import { 
    auth, 
    githubProvider, 
    yahooProvider,
    createUserProfile 
} from '../services/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup 
} from "firebase/auth";
import { Button } from './Button';
import { Input } from './InputField';
import { AlertCircle, CheckCircle2, Briefcase, User, Github } from 'lucide-react';

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
    
    const isMounted = useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const handleProviderSignIn = async (provider: any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, provider);
            await createUserProfile(result.user, role); // Create profile if not exists
            if (isMounted.current) onSuccess();
        } catch (err: any) {
            console.error("Provider Auth Error:", err);
            if (isMounted.current) setError(err.message || 'Failed to sign in');
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);
        setMsg(null);

        try {
            if (view === 'signup') {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Create user profile in Firestore
                await createUserProfile(userCredential.user, role, fullName);
                
                if (isMounted.current) onSuccess();
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                if (isMounted.current) onSuccess();
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            if (isMounted.current) {
                let errorMessage = err.message || 'An error occurred';
                if (err.code === 'auth/invalid-credential') {
                    errorMessage = 'Invalid email or password.';
                } else if (err.code === 'auth/email-already-in-use') {
                    errorMessage = 'Email already in use.';
                }
                setError(errorMessage);
            }
        } finally {
            if (isMounted.current) setLoading(false);
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
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
                        <span>{error}</span>
                    </div>
                )}
                
                {msg && (
                    <div className="p-4 rounded-xl bg-green-50 text-green-600 text-sm flex items-center gap-2 border border-green-100 animate-in slide-in-from-top-2">
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

            {/* Provider Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    type="button"
                    onClick={() => handleProviderSignIn(githubProvider)}
                    className="flex items-center justify-center gap-2 bg-[#24292e] text-white font-medium py-3 rounded-xl hover:bg-[#24292e]/90 transition-colors"
                >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                </button>
                <button 
                    type="button"
                    onClick={() => handleProviderSignIn(yahooProvider)}
                    className="flex items-center justify-center gap-2 bg-[#6001d2] text-white font-medium py-3 rounded-xl hover:bg-[#6001d2]/90 transition-colors"
                >
                    <span className="font-bold text-lg leading-none font-serif">Y!</span>
                    <span>Yahoo</span>
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
