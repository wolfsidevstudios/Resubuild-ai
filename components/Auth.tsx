
import React, { useState, useEffect, useRef } from 'react';
import { 
    auth, 
    googleProvider, 
    createUserProfile 
} from '../services/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup 
} from "firebase/auth";
import { Button } from './Button';
import { Input } from './InputField';
import { AlertCircle, CheckCircle2, Briefcase, User, Loader2 } from 'lucide-react';

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

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserProfile(result.user, role); // Create profile if not exists
            if (isMounted.current) onSuccess();
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            if (isMounted.current) setError(err.message || 'Failed to sign in with Google');
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

            {/* Google Sign-In Button */}
            <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-700 font-medium py-3 rounded-full hover:bg-neutral-50 transition-colors"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span>{view === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
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
