
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
import { DesignPilot } from './components/DesignPilot'; 
import { DataConsentModal } from './components/DataConsentModal';
import { TermsPage, PrivacyPage } from './components/LegalPages';
import { TermsModal } from './components/TermsModal';
import { SuspendedView } from './components/SuspendedView';
import { CookieBanner } from './components/CookieBanner'; // Import Cookie Banner
import { ResumeData, UserRole, UserProfile } from './types';
import { auth, getOrCreateUserProfile } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createEmptyResume, getResumeById } from './services/storageService';
import { Loader2, X } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover' | 'guest-resupilot' | 'not-found' | 'app-assets' | 'settings' | 'design-pilot' | 'terms' | 'privacy' | 'suspended';

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
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/suspended': 'suspended'
};

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

  const syncViewFromUrl = async (currentUser: User | null, profile?: UserProfile | null) => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Handle Suspended Logic Immediately
      if (currentUser && profile?.account_status === 'suspended') {
          navigate('suspended', true);
          return;
      }

      // Find view matching current path
      let matchedView: View = 'not-found';
      if (ROUTES[path]) {
          matchedView = ROUTES[path];
      } else if (path === '/login' || path === '/signup') {
          matchedView = 'landing'; 
      } else {
          if (path === '/') matchedView = 'landing';
      }

      // Deep linking logic
      if (matchedView === 'builder') {
          const resumeId = searchParams.get('id');
          if (resumeId) {
             const resume = getResumeById(resumeId, currentUser?.uid);
             if (resume) {
                 setCurrentResume(resume);
             } else {
                 navigate(currentUser ? 'dashboard' : 'landing', true);
                 return;
             }
          } else if (!currentUser) {
               navigate('landing', true);
               return;
          }
      }

      // Auth Guard
      const protectedRoutes: View[] = ['dashboard', 'employer-dashboard', 'onboarding', 'builder', 'settings', 'suspended'];
      if (protectedRoutes.includes(matchedView) && !currentUser) {
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
          if (['landing', 'guest-resupilot', 'app-assets', 'discover', 'design-pilot', 'terms', 'privacy'].includes(view)) {
             // stay on public page
          } else {
             navigate('landing');
          }
          setUserRole(null);
          setUserProfile(null);
          return;
      }

      try {
        // Use getOrCreateUserProfile to ensure profile exists, otherwise TermsModal won't show for new/legacy users
        const profile = await getOrCreateUserProfile(currentUser);
        setUserProfile(profile);
        const role = profile?.role || 'candidate';
        setUserRole(role);
        
        // CHECK SUSPENSION
        if (profile?.account_status === 'suspended') {
            navigate('suspended', true);
            return;
        }

        // Check for consent logic (only if active)
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
        if (['builder', 'onboarding', 'settings', 'design-pilot'].includes(currentPathView)) {
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
                 // Use getOrCreateUserProfile to ensure we have a profile doc for the Terms check
                 const profile = await getOrCreateUserProfile(user);
                 setUserProfile(profile);
                 const role = profile?.role || 'candidate';
                 setUserRole(role);
                 
                 if (profile?.account_status === 'suspended') {
                     navigate('suspended', true);
                 } else if (profile && profile.training_consent === undefined) {
                     // Only show training consent if not suspended
                     setShowConsentModal(true);
                 }
                 await syncViewFromUrl(user, profile);
             } catch (e) {
                 console.warn("Profile load failed", e);
                 setUserRole('candidate');
                 await syncViewFromUrl(user, null);
             }
        } else {
             setUserRole(null);
             setUserProfile(null);
             setShowConsentModal(false);
             
             const publicViews: View[] = ['landing', 'guest-resupilot', 'app-assets', 'discover', 'design-pilot', 'terms', 'privacy'];
             if (!publicViews.includes(view)) {
                navigate('landing');
             } else {
                 // Just ensure view matches URL
                 await syncViewFromUrl(null, null);
             }
        }
        setLoading(false);
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
            onViewTerms={() => navigate('terms')}
            onViewPrivacy={() => navigate('privacy')}
        />
      )}
      
      {view === 'terms' && (
          <TermsPage onBack={() => user ? routeUser(user) : navigate('landing')} />
      )}

      {view === 'privacy' && (
          <PrivacyPage onBack={() => user ? routeUser(user) : navigate('landing')} />
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
      
      {view === 'suspended' && user && (
          <SuspendedView userId={user.uid} onReactivate={() => window.location.href = '/dashboard'} />
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

      {/* Terms Acceptance Modal - Mandatory. Ensure userProfile is loaded first */}
      {user && userProfile && !userProfile.terms_accepted && view !== 'suspended' && view !== 'terms' && view !== 'privacy' && (
          <TermsModal 
              userId={user.uid} 
              onAccept={() => {
                  // Optimistically update local state so it closes without refresh
                  setUserProfile(prev => prev ? { ...prev, terms_accepted: true } : null);
              }} 
          />
      )}

      {/* Data Consent Modal (Global) - Only if terms accepted and consent not set */}
      {showConsentModal && user && userProfile?.terms_accepted && (
          <DataConsentModal userId={user.uid} onClose={() => setShowConsentModal(false)} />
      )}

      {/* AdSense Mandatory Cookie Banner */}
      <CookieBanner />
    </>
  );
}

export default App;
