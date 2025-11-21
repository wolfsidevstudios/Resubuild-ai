
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
import { AboutPage } from './components/AboutPage';
import { TermsModal } from './components/TermsModal';
import { SuspendedView } from './components/SuspendedView';
import { CookieBanner } from './components/CookieBanner';
import { AgeGateModal } from './components/AgeGateModal';
import { FormViewer } from './components/FormViewer';
import { ResumeData, UserRole, UserProfile } from './types';
import { auth, getOrCreateUserProfile } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createEmptyResume, getResumeById } from './services/storageService';
import { Loader2, X } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover' | 'guest-resupilot' | 'not-found' | 'app-assets' | 'settings' | 'design-pilot' | 'terms' | 'privacy' | 'suspended' | 'about' | 'form-viewer';

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
  '/about': 'about',
  '/suspended': 'suspended'
};

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewParams, setViewParams] = useState<any>({});
  
  // Guest Mode State
  const [guestPrompt, setGuestPrompt] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Data Consent & Privacy State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);

  const navigate = (newView: View, replace: boolean = false, params: Record<string, string> = {}) => {
    let path = Object.keys(ROUTES).find(key => ROUTES[key] === newView) || '/';
    
    // Append params
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

      // Special Route: Form Viewer (/forms/:id)
      if (path.startsWith('/forms/')) {
          const formId = path.split('/forms/')[1];
          if (formId) {
              setViewParams({ formId });
              setView('form-viewer');
              return;
          }
      }

      // Standard Route Matching
      let matchedView: View = 'not-found';
      if (ROUTES[path]) {
          matchedView = ROUTES[path];
      } else if (path === '/login' || path === '/signup') {
          matchedView = 'landing'; 
      } else {
          if (path === '/') matchedView = 'landing';
      }

      // Builder Deep Link
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

  const routeUser = async (currentUser: User | null, targetView?: View) => {
      if (!currentUser) {
          if (['landing', 'guest-resupilot', 'app-assets', 'discover', 'design-pilot', 'terms', 'privacy', 'about', 'form-viewer'].includes(view)) {
             // stay on public page
          } else {
             navigate('landing');
          }
          setUserRole(null);
          setUserProfile(null);
          return;
      }

      try {
        const profile = await getOrCreateUserProfile(currentUser);
        setUserProfile(profile);
        const role = profile?.role || 'candidate';
        setUserRole(role);
        
        if (profile?.account_status === 'suspended') {
            navigate('suspended', true);
            return;
        }

        if (profile && profile.training_consent === undefined) {
            setShowConsentModal(true);
        }

        if (targetView) {
             navigate(targetView);
             return;
        }

        const currentPathView = ROUTES[window.location.pathname];
        if (['builder', 'onboarding', 'settings', 'design-pilot', 'form-viewer'].includes(view)) {
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

    const ageCollected = localStorage.getItem('resubuild_user_age');
    if (!ageCollected) {
        setTimeout(() => setShowAgeGate(true), 1500);
    }

    const onPopState = () => {
        const path = window.location.pathname;
        if (path.startsWith('/forms/')) {
            const formId = path.split('/forms/')[1];
            setViewParams({ formId });
            setView('form-viewer');
        } else {
            const mappedView = ROUTES[path] || 'not-found';
            setView(mappedView);
        }
    };
    window.addEventListener('popstate', onPopState);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted) return;
        setUser(user);
        if (user) {
             try {
                 const profile = await getOrCreateUserProfile(user);
                 setUserProfile(profile);
                 const role = profile?.role || 'candidate';
                 setUserRole(role);
                 if (profile?.account_status === 'suspended') {
                     navigate('suspended', true);
                 } else if (profile && profile.training_consent === undefined) {
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
             const publicViews: View[] = ['landing', 'guest-resupilot', 'app-assets', 'discover', 'design-pilot', 'terms', 'privacy', 'about', 'form-viewer'];
             if (!publicViews.includes(view)) {
                // Only redirect if we aren't on a public page (like form viewer)
                if (!window.location.pathname.startsWith('/forms/')) {
                    navigate('landing');
                } else {
                    await syncViewFromUrl(null, null);
                }
             } else {
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
              <p className="text-neutral-500 text-sm animate-pulse">Loading Kyndra Workspace...</p>
          </div>
      );
  }

  return (
    <>
      {view === 'form-viewer' && (
          <FormViewer formId={viewParams.formId} />
      )}

      {view === 'landing' && (
        <LandingPage 
            onStart={() => routeUser(user)} 
            isAuthenticated={!!user}
            onGoToDiscover={() => navigate('discover')}
            onGuestTry={handleGuestEntry}
            onGoToAssets={() => navigate('app-assets')}
            onViewTerms={() => navigate('terms')}
            onViewPrivacy={() => navigate('privacy')}
            onViewAbout={() => navigate('about')}
        />
      )}
      
      {view === 'about' && (
          <AboutPage onBack={() => user ? routeUser(user) : navigate('landing')} />
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

      {/* Auth Modal */}
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
                      <p className="text-neutral-500">Create a free account to save your progress.</p>
                  </div>
                  <Auth onSuccess={handleAuthSuccess} defaultView="signup" />
              </div>
          </div>
      )}

      {/* Terms Modal */}
      {user && userProfile && !userProfile.terms_accepted && view !== 'suspended' && view !== 'terms' && view !== 'privacy' && view !== 'about' && (
          <TermsModal 
              userId={user.uid} 
              onAccept={() => {
                  setUserProfile(prev => prev ? { ...prev, terms_accepted: true } : null);
              }} 
          />
      )}

      {/* Data Consent Modal */}
      {showConsentModal && user && userProfile?.terms_accepted && (
          <DataConsentModal userId={user.uid} onClose={() => setShowConsentModal(false)} />
      )}

      {/* Age Gate Modal */}
      {showAgeGate && (
          <AgeGateModal onComplete={() => setShowAgeGate(false)} />
      )}

      {/* Cookie Banner */}
      <CookieBanner />
    </>
  );
}

export default App;
