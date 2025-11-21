
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
import { SettingsPage } from './components/SettingsPage';
import { DesignPilot } from './components/DesignPilot'; // Import new component
import { DataConsentModal } from './components/DataConsentModal'; // Import new component
import { ResumeData, UserRole } from './types';
import { auth, getUserProfile } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createEmptyResume, getResumeById } from './services/storageService';
import { Loader2, X } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover' | 'guest-resupilot' | 'not-found' | 'app-assets' | 'settings' | 'design-pilot';

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
  '/settings': 'settings',
  '/design-pilot': 'design-pilot',
};

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Guest Mode State
  const [guestPrompt, setGuestPrompt] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Data Consent State
  const [showConsentModal, setShowConsentModal] = useState(false);

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

  const syncViewFromUrl = async (currentUser: User | null) => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Find view matching current path (simple matching)
      let matchedView: View = 'not-found';
      if (ROUTES[path]) {
          matchedView = ROUTES[path];
      } else if (path === '/login' || path === '/signup') {
          matchedView = 'landing'; // Handle specific auth routes as landing for now
      } else {
          // Check if it's an exact match or if we should show not found
          // For now, default to landing if root, else not-found
          if (path === '/') matchedView = 'landing';
      }

      // Deep linking logic
      if (matchedView === 'builder') {
          const resumeId = searchParams.get('id');
          if (resumeId) {
             // Attempt to load resume
             const resume = getResumeById(resumeId, currentUser?.uid);
             if (resume) {
                 setCurrentResume(resume);
             } else {
                 // Resume not found or no access
                 navigate(currentUser ? 'dashboard' : 'landing', true);
                 return;
             }
          } else if (!currentUser) {
               navigate('landing', true);
               return;
          }
      }

      // Auth Guard
      const protectedRoutes: View[] = ['dashboard', 'employer-dashboard', 'onboarding', 'builder', 'settings'];
      if (protectedRoutes.includes(matchedView) && !currentUser) {
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
  const routeUser = async (currentUser: User | null, targetView?: View) => {
      if (!currentUser) {
          if (view !== 'guest-resupilot' && view !== 'app-assets' && view !== 'discover' && view !== 'design-pilot') {
             navigate('landing');
          }
          setUserRole(null);
          return;
      }

      try {
        const profile = await getUserProfile(currentUser.uid);
        const role = profile?.role || 'candidate';
        setUserRole(role);
        
        // Check for consent logic
        if (profile && profile.training_consent === undefined) {
            setShowConsentModal(true);
        }

        // If a specific target is requested (e.g. from URL), try to go there
        if (targetView) {
             navigate(targetView);
             return;
        }

        // Otherwise default routing based on role, BUT respect current URL if it's valid
        const currentPathView = ROUTES[window.location.pathname];
        if (currentPathView === 'builder' || currentPathView === 'onboarding' || currentPathView === 'settings' || currentPathView === 'design-pilot') {
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
        const path = window.location.pathname;
        const mappedView = ROUTES[path] || 'not-found';
        setView(mappedView);
    };
    window.addEventListener('popstate', onPopState);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted) return;
        
        setUser(user);
        
        if (user) {
             try {
                 const profile = await getUserProfile(user.uid);
                 const role = profile?.role || 'candidate';
                 setUserRole(role);
                 // Check consent on initial load
                 if (profile && profile.training_consent === undefined) {
                     setShowConsentModal(true);
                 }
             } catch (e) {
                 console.warn("Profile load failed, defaulting to candidate");
                 setUserRole('candidate');
             }
        } else {
             setUserRole(null);
             setShowConsentModal(false);
             // Don't redirect if we are on public pages
             const publicViews: View[] = ['landing', 'guest-resupilot', 'app-assets', 'discover', 'design-pilot'];
             if (!publicViews.includes(view)) {
                navigate('landing');
             }
        }
        
        // Once we know auth state, sync view (only on initial load mostly)
        if (loading) {
             await syncViewFromUrl(user);
             setLoading(false);
        }
    });

    return () => {
        isMounted = false;
        window.removeEventListener('popstate', onPopState);
        unsubscribe();
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
  
  const handleAuthSuccess = () => {
      setShowAuthModal(false);
      if (user) routeUser(user);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white">
              <Loader2 className="w-10 h-10 animate-spin text-neutral-900 mb-4" />
              <p className="text-neutral-500 text-sm animate-pulse">Loading Resubuild...</p>
              {/* Fallback button if it takes unusually long visually */}
              <button 
                className="mt-8 text-xs text-neutral-400 underline hover:text-neutral-600"
                onClick={() => setLoading(false)}
              >
                Stuck? Click here to skip
              </button>
          </div>
      );
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage 
            onStart={() => routeUser(user)} 
            isAuthenticated={!!user}
            onGoToDiscover={() => navigate('discover')}
            onGuestTry={handleGuestEntry}
            onGoToAssets={() => navigate('app-assets')}
        />
      )}
      
      {view === 'design-pilot' && (
          <DesignPilot />
      )}
      
      {view === 'not-found' && (
          <NotFound onHome={() => user ? routeUser(user) : navigate('landing')} />
      )}
      
      {view === 'app-assets' && (
          <AppAssets onHome={() => navigate('landing')} />
      )}
      
      {view === 'discover' && (
          <Discover onHome={() => user ? routeUser(user) : navigate('landing')} />
      )}
      
      {/* CANDIDATE ROUTES */}
      {view === 'dashboard' && user && userRole === 'candidate' && (
        <Dashboard 
            onCreate={handleCreateNew} 
            onEdit={handleEdit}
            onHome={() => navigate('landing')}
            onSettings={() => navigate('settings')}
            userId={user.uid}
        />
      )}

      {view === 'onboarding' && user && (
         <Onboarding 
            onComplete={handleOnboardingComplete}
            onCancel={() => navigate('dashboard')}
            userId={user.uid}
         />
      )}

      {view === 'builder' && user && (
        <ResumeBuilder 
            initialData={currentResume} 
            onGoHome={() => navigate('dashboard')} 
            userId={user.uid}
        />
      )}
      
      {view === 'settings' && user && (
          <SettingsPage 
              user={user}
              userRole={userRole}
              onBack={() => {
                  // Force navigate back to dashboard based on role, skipping the "stay on current route" check
                  const target = userRole === 'employer' ? 'employer-dashboard' : 'dashboard';
                  navigate(target);
              }}
          />
      )}

      {/* GUEST MODE */}
      {view === 'guest-resupilot' && !user && (
          <Resupilot 
            userId="guest" 
            isGuest={true}
            initialPrompt={guestPrompt}
            onExit={() => navigate('landing')} 
            onSave={handleGuestSaveAttempt} 
          />
      )}

      {/* EMPLOYER ROUTES */}
      {view === 'employer-dashboard' && user && userRole === 'employer' && (
          <EmployerDashboard 
              userId={user.uid}
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
                  <Auth onSuccess={handleAuthSuccess} defaultView="signup" />
              </div>
          </div>
      )}

      {/* Data Consent Modal (Global) */}
      {showConsentModal && user && (
          <DataConsentModal userId={user.uid} onClose={() => setShowConsentModal(false)} />
      )}
    </>
  );
}

export default App;
