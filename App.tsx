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
import { auth, getUserProfile } from './services/firebase';
import { createEmptyResume, getResumeById } from './services/storageService';
import { onAuthStateChanged, User } from 'firebase/auth';
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
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Guest Mode State
  const [guestPrompt, setGuestPrompt] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- ROUTING HELPERS ---

  const navigate = (newView: View, replace: boolean = false, params: Record<string, string> = {}) => {
    let path = Object.keys(ROUTES).find(key => ROUTES[key] === newView) || '/';
    
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
      
      let matchedView: View = 'not-found';
      if (ROUTES[path]) {
          matchedView = ROUTES[path];
      } else if (path === '/login' || path === '/signup') {
          matchedView = 'landing'; 
      } else {
          if (path === '/') matchedView = 'landing';
      }

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

      const protectedRoutes: View[] = ['dashboard', 'employer-dashboard', 'onboarding', 'builder'];
      if (protectedRoutes.includes(matchedView) && !currentUser) {
          navigate('landing', true);
          return;
      }

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
          if (view !== 'guest-resupilot' && view !== 'app-assets' && view !== 'discover') {
             navigate('landing');
          }
          setUserRole(null);
          return;
      }

      try {
        const profile = await getUserProfile(currentUser.uid);
        const role = profile?.role || 'candidate';
        setUserRole(role);

        if (targetView) {
             navigate(targetView);
             return;
        }

        const currentPathView = ROUTES[window.location.pathname];
        if (currentPathView === 'builder' || currentPathView === 'onboarding') {
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

    const onPopState = () => {
        const path = window.location.pathname;
        const mappedView = ROUTES[path] || 'not-found';
        setView(mappedView);
    };
    window.addEventListener('popstate', onPopState);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return;
        
        setUser(firebaseUser);
        
        if (firebaseUser) {
            try {
                const profile = await getUserProfile(firebaseUser.uid);
                const role = profile?.role || 'candidate';
                setUserRole(role);
            } catch (e) {
                console.warn("Profile load failed, defaulting to candidate");
                setUserRole('candidate');
            }
        } else {
            setUserRole(null);
        }

        if (loading) {
            // Initial load
            await syncViewFromUrl(firebaseUser);
            setLoading(false);
        } else if (!firebaseUser) {
             // Logout
             const publicViews: View[] = ['landing', 'guest-resupilot', 'app-assets', 'discover'];
             if (!publicViews.includes(view)) {
                navigate('landing');
             }
        }
        
        setShowAuthModal(false);
    });

    return () => {
        isMounted = false;
        window.removeEventListener('popstate', onPopState);
        unsubscribe();
    };
  }, [loading, view, userRole]); 

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
        />
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
      
      {view === 'dashboard' && user && userRole === 'candidate' && (
        <Dashboard 
            onCreate={handleCreateNew} 
            onEdit={handleEdit}
            onHome={() => navigate('landing')}
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

      {view === 'guest-resupilot' && !user && (
          <Resupilot 
            userId="guest" 
            isGuest={true}
            initialPrompt={guestPrompt}
            onExit={() => navigate('landing')} 
            onSave={handleGuestSaveAttempt} 
          />
      )}

      {view === 'employer-dashboard' && user && userRole === 'employer' && (
          <EmployerDashboard 
              userId={user.uid}
              onHome={() => navigate('landing')}
          />
      )}

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