import React, { useState } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { LandingPage } from './components/LandingPage';

function App() {
  const [view, setView] = useState<'landing' | 'builder'>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('builder')} />
      ) : (
        <ResumeBuilder onGoHome={() => setView('landing')} />
      )}
    </>
  );
}

export default App;
