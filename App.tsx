
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
import { createEmptyResume, getResumeById } from './services/storageService';
import { Session } from '@supabase/supabase-js';
import { Loader2, X } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover' | 'guest-resupilot' | 'not-found' | 'app-assets';

// Map views to URL paths
const ROUTES: Record<string, View> = {
  '/': 'landing',
  '/dashboard': 'dashboard',
  '/employer': 'employer-dashboard',
  '/onboarding': 'onboarding',
  '/builder': 'builder',
  '/discover': 'discover',
  '/create': 'guest-resupilot',
  '/media-kit': 'app-assets',
};

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Guest Mode State
  const [guestPrompt, setGuestPrompt] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- ROUTING HELPERS ---

  const navigate = (newView: View, replace: boolean = false, params: Record<string, string> = {}) => {
    // Find path for view
    let path = Object.keys(ROUTES).find(key => ROUTES[key] === newView) || '/';
    
    // Append params (e.g. builder?id=123)
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
        path += `?${queryString}`;
    }

    if (replace) {
        window.history.replaceState({}, '', path);
    } else {
        window.history.pushState({}, '', path);
    }
    
    setView(newView);
    window.scrollTo(0, 0);
  };

  const syncViewFromUrl = async (currentSession: Session | null) => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Find view matching current path (simple matching)
      let matchedView: View = 'not-found';
      if (ROUTES[path]) {
          matchedView = ROUTES[path];
      } else if (path === '/login' || path === '/signup') {
          matchedView = 'landing'; // Handle specific auth routes as landing for now
      }

      // Deep linking logic
      if (matchedView === 'builder') {
          const resumeId = searchParams.get('id');
          if (resumeId) {
             // Attempt to load resume
             const resume = getResumeById(resumeId, currentSession?.user.id);
             if (resume) {
                 setCurrentResume(resume);
             } else {
                 // Resume not found or no access
                 navigate(currentSession ? 'dashboard' : 'landing', true);
                 return;
             }
          } else if (!currentSession) {
               navigate('landing', true);
               return;
          }
      }

      // Auth Guard
      const protectedRoutes: View[] = ['dashboard', 'employer-dashboard', 'onboarding', 'builder'];
      if (protectedRoutes.includes(matchedView) && !currentSession) {
          // Redirect to landing if trying to access protected route without session
          navigate('landing', true);
          return;
      }

      // Role Guard
      if (matchedView === 'dashboard' && userRole === 'employer') {
           navigate('employer-dashboard', true);
           return;
      }
      if (matchedView === 'employer-dashboard' && userRole === 'candidate') {
           navigate('dashboard', true);
           return;
      }

      setView(matchedView);
  };

  // Helper to route user based on role (called on login)
  const routeUser = async (currentSession: Session | null, targetView?: View) => {
      if (!currentSession) {
          if (view !== 'guest-resupilot' && view !== 'app-assets' && view !== 'discover') {
             navigate('landing');
          }
          setUserRole(null);
          return;
      }

      try {
        const profile = await getUserProfile(currentSession.user.id);
        const role = profile?.role || 'candidate';
        setUserRole(role);

        // If a specific target is requested (e.g. from URL), try to go there
        if (targetView) {
             navigate(targetView);
             return;
        }

        // Otherwise default routing based on role, BUT respect current URL if it's valid
        const currentPathView = ROUTES[window.location.pathname];
        if (currentPathView === 'builder' || currentPathView === 'onboarding') {
            // Stay on current view
            return;
        }
        
        if (role === 'employer') {
            navigate('employer-dashboard');
        } else {
            navigate('dashboard');
        }
      } catch (error) {
        console.error("Error routing user:", error);
        navigate('dashboard');
      }
  };

  useEffect(() => {
    let isMounted = true;

    // Handle Browser Back/Forward
    const onPopState = () => {
        // We re-run sync logic. Note: We need current session state here.
        // Since event listener is added once, we rely on state being up to date or refetching.
        // For simplicity in this structure, we just reload the appropriate view mapping.
        const path = window.location.pathname;
        const mappedView = ROUTES[path] || 'not-found';
        
        // Simple view switch for history navigation, complex guards are handled by effects
        setView(mappedView);
    };
    window.addEventListener('popstate', onPopState);

    const initializeApp = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (isMounted) {
                setSession(session);
                // Determine role first if session exists
                if (session) {
                    const profile = await getUserProfile(session.user.id);
                    const role = profile?.role || 'candidate';
                    setUserRole(role);
                }
                
                // Then sync view from URL
                await syncViewFromUrl(session);
            }
        } catch (error) {
            console.error("Initialization error:", error);
            navigate('landing', true);
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
      
      if (!session) {
          // Logged out
          if (view !== 'app-assets' && view !== 'discover' && view !== 'guest-resupilot') {
             navigate('landing');
          }
          setUserRole(null);
      } else if (_event === 'SIGNED_IN') {
          // Just logged in
          // If we are on landing (default), route to dashboard. 
          // If we are on a deep link (e.g. refreshed builder), syncViewFromUrl handles it on mount.
          if (window.location.pathname === '/' || window.location.pathname === '/login') {
             await routeUser(session); 
          } else {
             // Ensure role is set for the current session even if we stay on page
             const profile = await getUserProfile(session.user.id);
             setUserRole(profile?.role || 'candidate');
          }
          
          setShowAuthModal(false);
      }
    });

    return () => {
        isMounted = false;
        window.removeEventListener('popstate', onPopState);
        subscription.unsubscribe();
    };
  }, []); 

  const handleCreateNew = (mode: 'ai' | 'manual', templateId: string = 'modern') => {
    if (mode === 'ai') {
        setCurrentResume(undefined);
        navigate('onboarding');
    } else {
        const newResume = createEmptyResume(templateId);
        setCurrentResume(newResume);
        // For manual create, we're basically in builder mode with a fresh object.
        // Ideally we save it first to generate an ID for the URL, but for memory-only start:
        navigate('builder');
    }
  };

  const handleEdit = (resume: ResumeData) => {
    setCurrentResume(resume);
    navigate('builder', false, { id: resume.id });
  };
  
  const handleOnboardingComplete = (data: ResumeData) => {
      setCurrentResume(data);
      navigate('builder', false, { id: data.id });
  }

  const handleGuestEntry = (prompt: string) => {
      setGuestPrompt(prompt);
      navigate('guest-resupilot');
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
            onGoToDiscover={() => navigate('discover')}
            onGuestTry={handleGuestEntry}
            onGoToAssets={() => navigate('app-assets')}
        />
      )}
      
      {view === 'not-found' && (
          <NotFound onHome={() => session ? routeUser(session) : navigate('landing')} />
      )}
      
      {view === 'app-assets' && (
          <AppAssets onHome={() => navigate('landing')} />
      )}
      
      {view === 'discover' && (
          <Discover onHome={() => session ? routeUser(session) : navigate('landing')} />
      )}
      
      {/* CANDIDATE ROUTES */}
      {view === 'dashboard' && session && userRole === 'candidate' && (
        <Dashboard 
            onCreate={handleCreateNew} 
            onEdit={handleEdit}
            onHome={() => navigate('landing')}
            userId={session.user.id}
        />
      )}

      {view === 'onboarding' && session && (
         <Onboarding 
            onComplete={handleOnboardingComplete}
            onCancel={() => navigate('dashboard')}
            userId={session.user.id}
         />
      )}

      {view === 'builder' && session && (
        <ResumeBuilder 
            initialData={currentResume} 
            onGoHome={() => navigate('dashboard')} 
            userId={session.user.id}
        />
      )}

      {/* GUEST MODE */}
      {view === 'guest-resupilot' && !session && (
          <Resupilot 
            userId="guest" 
            isGuest={true}
            initialPrompt={guestPrompt}
            onExit={() => navigate('landing')} 
            onSave={handleGuestSaveAttempt} 
          />
      )}

      {/* EMPLOYER ROUTES */}
      {view === 'employer-dashboard' && session && userRole === 'employer' && (
          <EmployerDashboard 
              userId={session.user.id}
              onHome={() => navigate('landing')}
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
