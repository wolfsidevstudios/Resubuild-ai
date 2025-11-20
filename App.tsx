
import React, { useState, useEffect } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Discover } from './components/Discover';
import { ResumeData } from './types';
import { supabase } from './services/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type View = 'landing' | 'dashboard' | 'onboarding' | 'builder' | 'discover';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If logged out, go to landing unless viewing public page like discover
      if (!session && view !== 'discover') {
          setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [view]);

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
            onStart={() => setView('dashboard')} 
            isAuthenticated={!!session}
            onGoToDiscover={() => setView('discover')}
        />
      )}
      
      {view === 'discover' && (
          <Discover onHome={() => setView(session ? 'dashboard' : 'landing')} />
      )}
      
      {view === 'dashboard' && session && (
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
      
      {/* Fallback if user tries to access protected view without session */}
      {view !== 'landing' && view !== 'discover' && !session && (
          <LandingPage 
            onStart={() => setView('dashboard')} 
            isAuthenticated={false} 
            onGoToDiscover={() => setView('discover')}
          />
      )}
    </>
  );
}

export default App;
