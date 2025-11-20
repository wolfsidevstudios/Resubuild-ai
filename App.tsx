import React, { useState } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { ResumeData } from './types';
import { createEmptyResume } from './services/storageService';

type View = 'landing' | 'dashboard' | 'onboarding' | 'builder';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<ResumeData | undefined>(undefined);

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

  return (
    <>
      {view === 'landing' && (
        <LandingPage onStart={() => setView('dashboard')} />
      )}
      
      {view === 'dashboard' && (
        <Dashboard 
            onCreate={handleCreateNew} 
            onEdit={handleEdit}
            onHome={() => setView('landing')}
        />
      )}

      {view === 'onboarding' && (
         <Onboarding 
            onComplete={handleOnboardingComplete}
            onCancel={() => setView('dashboard')}
         />
      )}

      {view === 'builder' && (
        <ResumeBuilder 
            initialData={currentResume} 
            onGoHome={() => setView('dashboard')} 
        />
      )}
    </>
  );
}

export default App;
