
import React, { useState, useEffect } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { Onboarding } from './components/Onboarding';
import { Discover } from './components/Discover';
import { Resupilot } from './components/Resupilot';
import { Auth } from './components/Auth';
import { NotFound } from './components/NotFound';
import { AppAssets } from './components/AppAssets';
import { ResumeData, UserRole } from './types';
import { supabase, getUserProfile } from './services/supabase';
import { createEmptyResume } from './services/storageService';
import { Session } from '@supabase/supabase-js';
import { Loader2, X } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover' | 'guest-resupilot' | 'not-found' | 'app-assets';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Guest Mode State
  const [guestPrompt, setGuestPrompt] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Helper to route user based on role
  const routeUser = async (currentSession: Session | null) => {
      if (!currentSession) {
          // If we were in guest mode or assets page, don't force landing page immediately if intention is specific
          if (view !== 'guest-resupilot' && view !== 'app-assets') {
             setView('landing');
          }
          setUserRole(null);
          return;
      }

      try {
        const profile = await getUserProfile(currentSession.user.id);
        // Default to candidate if profile fetch fails (network/permissions)
        const role = profile?.role || 'candidate';
        setUserRole(role);

        if (role === 'employer') {
            setView('employer-dashboard');
        } else {
            setView('dashboard');
        }
      } catch (error) {
        console.error("Error routing user:", error);
        setView('dashboard'); // Fallback
      }
  };

  useEffect(() => {
    let isMounted = true;

    // Safety Timeout: Force loading to false after 6 seconds to prevent infinite stuck screens
    const safetyTimer = setTimeout(() => {
        if (isMounted && loading) {
            console.warn("Loading timed out, forcing render.");
            setLoading(false);
        }
    }, 6000);

    const initializeApp = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (isMounted) {
                setSession(session);
                if (session) {
                    await routeUser(session);
                }
            }
        } catch (error) {
            console.error("Initialization error:", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    initializeApp();

    // Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      setSession(session);
      // If logging out
      if (!session) {
          // Keep on assets page if that's where we are
          if (view !== 'app-assets') {
            setView('landing');
          }
          setUserRole(null);
      } else if (_event === 'SIGNED_IN') {
          // Only trigger loading if we aren't already on a dashboard
          if (view === 'landing' || view === 'onboarding') {
             setLoading(true);
          }
          await routeUser(session);
          setLoading(false);
          setShowAuthModal(false); // Close modal if open
      }
    });

    return () => {
        isMounted = false;
        clearTimeout(safetyTimer);
        subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleCreateNew = (mode: 'ai' | 'manual', templateId: string = 'modern') => {
    if (mode === 'ai') {
        setCurrentResume(undefined);
        setView('onboarding');
    } else {
        // For manual, we use the selected template
        const newResume = createEmptyResume(templateId);
        setCurrentResume(newResume);
        setView('builder');
    }
  };

  const handleEdit = (resume: ResumeData) => {
    setCurrentResume(resume);
    setView('builder');
  };
  
  const handleOnboardingComplete = (data: ResumeData) => {
      setCurrentResume(data);
      setView('builder');
  }

  const handleGuestEntry = (prompt: string) => {
      setGuestPrompt(prompt);
      setView('guest-resupilot');
  };

  const handleGuestSaveAttempt = (resume: ResumeData) => {
      setCurrentResume(resume);
      setShowAuthModal(true);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white">
              <Loader2 className="w-10 h-10 animate-spin text-neutral-900 mb-4" />
              <p className="text-neutral-500 text-sm animate-pulse">Loading Resubuild...</p>
          </div>
      );
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage 
            onStart={() => routeUser(session)} 
            isAuthenticated={!!session}
            onGoToDiscover={() => setView('discover')}
            onGuestTry={handleGuestEntry}
            onGoToAssets={() => setView('app-assets')}
        />
      )}
      
      {view === 'not-found' && (
          <NotFound onHome={() => session ? routeUser(session) : setView('landing')} />
      )}
      
      {view === 'app-assets' && (
          <AppAssets onHome={() => setView('landing')} />
      )}
      
      {view === 'discover' && (
          <Discover onHome={() => routeUser(session)} />
      )}
      
      {/* CANDIDATE ROUTES */}
      {view === 'dashboard' && session && userRole === 'candidate' && (
        <Dashboard 
            onCreate={handleCreateNew} 
            onEdit={handleEdit}
            onHome={() => setView('landing')}
            userId={session.user.id}
        />
      )}

      {view === 'onboarding' && session && (
         <Onboarding 
            onComplete={handleOnboardingComplete}
            onCancel={() => setView('dashboard')}
            userId={session.user.id}
         />
      )}

      {view === 'builder' && session && (
        <ResumeBuilder 
            initialData={currentResume} 
            onGoHome={() => setView('dashboard')} 
            userId={session.user.id}
        />
      )}

      {/* GUEST MODE */}
      {view === 'guest-resupilot' && !session && (
          <Resupilot 
            userId="guest" 
            isGuest={true}
            initialPrompt={guestPrompt}
            onExit={() => setView('landing')} 
            onSave={handleGuestSaveAttempt} 
          />
      )}

      {/* EMPLOYER ROUTES */}
      {view === 'employer-dashboard' && session && userRole === 'employer' && (
          <EmployerDashboard 
              userId={session.user.id}
              onHome={() => setView('landing')}
          />
      )}

      {/* Auth Modal for Guest Save or General Login */}
      {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-in zoom-in-95">
                  <button 
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full"
                  >
                      <X className="w-5 h-5 text-neutral-500" />
                  </button>
                  <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold mb-2">Save your Resume</h2>
                      <p className="text-neutral-500">Create a free account to save your progress and download the PDF.</p>
                  </div>
                  <Auth onSuccess={() => setShowAuthModal(false)} defaultView="signup" />
              </div>
          </div>
      )}
    </>
  );
}

export default App;
