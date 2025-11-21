import React, { useState, useEffect, useRef } from 'react';
import { auth, createUserProfile } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
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
    
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
             if (view === 'signup') {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: fullName });
                
                // Create Profile in Firestore
                await createUserProfile(userCredential.user.uid, {
                    id: userCredential.user.uid,
                    full_name: fullName,
                    role: role,
                    avatar_url: userCredential.user.photoURL || ''
                });
                
                onSuccess();
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                onSuccess();
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // Check/Create profile could be handled here if needed, or lazily
            // For simplicity, assume if they sign in they are a candidate by default if no profile exists
            await createUserProfile(result.user.uid, {
                id: result.user.uid,
                full_name: result.user.displayName || 'User',
                role: 'candidate', // Default for Google Sign In
                avatar_url: result.user.photoURL || ''
            });
            onSuccess();
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            setError(err.message);
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
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
                        <span>{error}</span>
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

            <Button 
                variant="outline" 
                onClick={handleGoogleSignIn}
                isLoading={loading}
                className="w-full"
            >
                Google
            </Button>

            <div className="mt-8 text-center">
                <p className="text-sm text-neutral-600">
                    {view === 'signin' ? "New to Resubuild? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setView(view === 'signin' ? 'signup' : 'signin');
                            setError(null);
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