
import React, { useState, useEffect } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { Onboarding } from './components/Onboarding';
import { Discover } from './components/Discover';
import { ResumeData, UserRole } from './types';
import { supabase, getUserProfile } from './services/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'onboarding' | 'builder' | 'discover';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to route user based on role
  const routeUser = async (currentSession: Session | null) => {
      if (!currentSession) {
          setView('landing');
          setUserRole(null);
          return;
      }

      const profile = await getUserProfile(currentSession.user.id);
      const role = profile?.role || 'candidate';
      setUserRole(role);

      if (role === 'employer') {
          setView('employer-dashboard');
      } else {
          setView('dashboard');
      }
  };

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
          await routeUser(session);
      }
      setLoading(false);
    });

    // Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      // If logging out
      if (!session) {
          setView('landing');
          setUserRole(null);
      } else if (_event === 'SIGNED_IN') {
          setLoading(true);
          await routeUser(session);
          setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreateNew = () => {
    setCurrentResume(undefined);
    setView('onboarding');
  };

  const handleEdit = (resume: ResumeData) => {
    setCurrentResume(resume);
    setView('builder');
  };
  
  const handleOnboardingComplete = (data: ResumeData) => {
      setCurrentResume(data);
      setView('builder');
  }

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
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
        />
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

      {/* EMPLOYER ROUTES */}
      {view === 'employer-dashboard' && session && userRole === 'employer' && (
          <EmployerDashboard 
              userId={session.user.id}
              onHome={() => setView('landing')}
          />
      )}
      
      {/* Fallback */}
      {view !== 'landing' && view !== 'discover' && !session && (
          <LandingPage 
            onStart={() => {}} 
            isAuthenticated={false} 
            onGoToDiscover={() => setView('discover')}
          />
      )}
    </>
  );
}

export default App;
