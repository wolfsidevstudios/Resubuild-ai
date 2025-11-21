
import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, Trash2, Edit2, ArrowRight, Settings, Key, X, LogOut, Bell, MessageSquare, Sparkles, PenTool, Layout, Grid, AlignLeft, Palette, Zap, BrainCircuit } from 'lucide-react';
import { ResumeData } from '../types';
import { getResumes, deleteResume, getStoredAPIKey, saveAPIKey, removeAPIKey } from '../services/storageService';
import { signOut } from '../services/firebase';
import { Button } from './Button';
import { Input } from './InputField';
import { Messaging } from './Messaging';
import { Notifications } from './Notifications';
import { Resupilot } from './Resupilot';

interface DashboardProps {
  onCreate: (mode: 'ai' | 'manual', templateId?: string) => void;
  onEdit: (resume: ResumeData) => void;
  onHome: () => void;
  onSettings: () => void;
  userId: string;
}

const TEMPLATES = [
    { id: 'modern', name: 'Modern', icon: Layout, desc: 'Clean, balanced, perfect for most roles.' },
    { id: 'professional', name: 'Professional', icon: FileText, desc: 'Traditional serif layout for corporate roles.' },
    { id: 'creative', name: 'Creative', icon: Palette, desc: 'Bold sidebar with accent colors for designers.' },
    { id: 'minimal', name: 'Minimal', icon: AlignLeft, desc: 'Simple, centered, whitespace-heavy.' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onCreate, onEdit, onHome, onSettings, userId }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResupilot, setShowResupilot] = useState(false);
  
  // Creation Flow State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'method' | 'templates'>('method');
  
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load resumes for this specific user
    setResumes(getResumes(userId).sort((a, b) => b.lastUpdated - a.lastUpdated));
    setApiKey(getStoredAPIKey() || '');
  }, [userId]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id, userId);
      setResumes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSignOut = async () => {
      await signOut();
      onHome();
  };
  
  const openCreateModal = () => {
      setCreateStep('method');
      setShowCreateModal(true);
  }
  
  const handleResupilotSave = (newResume: ResumeData) => {
      setShowResupilot(false);
      setResumes(getResumes(userId).sort((a, b) => b.lastUpdated - a.lastUpdated));
      onEdit(newResume);
  };

  if (showResupilot) {
      return <Resupilot userId={userId} onExit={() => setShowResupilot(false)} onSave={handleResupilotSave} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans relative">
      {/* Header */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
                <img 
                    src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                    alt="Resubuild Logo" 
                    className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="font-bold text-xl tracking-tight">Resubuild</span>
              </div>
              
              {/* Resupilot Button */}
              <button 
                onClick={() => setShowResupilot(true)}
                className="hidden md:flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2 rounded-full text-sm font-bold transition-all"
              >
                  <Sparkles className="w-4 h-4 text-blue-600" /> Resupilot AI
              </button>
          </div>

          <div className="flex items-center gap-2">
             <Button variant="ghost" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                 <Bell className="w-4 h-4" />
                 {/* Dot for unread could go here */}
             </Button>
             <Button variant="ghost" onClick={() => setShowMessages(true)}>
                 <MessageSquare className="w-4 h-4" />
             </Button>
             <div className="h-6 w-px bg-neutral-200 mx-2"></div>
             <Button variant="ghost" onClick={onSettings} icon={<Settings className="w-4 h-4" />}>
                Settings
             </Button>
             <Button variant="ghost" onClick={handleSignOut} icon={<LogOut className="w-4 h-4" />}>
                Sign Out
             </Button>
          </div>
        </div>
      </nav>

      {/* Notification Dropdown */}
      {showNotifications && <Notifications userId={userId} onClose={() => setShowNotifications(false)} />}

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-neutral-500">Manage and edit your saved resumes.</p>
          </div>
          <Button onClick={openCreateModal} icon={<Plus className="w-5 h-5" />}>
            Create New
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Start building your professional resume today with our AI-powered tools.
            </p>
            <div className="flex justify-center gap-3">
                <Button onClick={openCreateModal} variant="primary">
                Create Your First Resume
                </Button>
                <Button onClick={() => setShowResupilot(true)} variant="secondary" icon={<Sparkles className="w-4 h-4 text-blue-600" />}>
                    Try Resupilot
                </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <div 
              onClick={openCreateModal}
              className="group flex flex-col items-center justify-center h-[280px] bg-white border-2 border-dashed border-neutral-200 rounded-3xl hover:border-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-neutral-900" />
              </div>
              <span className="font-bold text-neutral-900">Create New Resume</span>
            </div>

            {/* Resume Cards */}
            {resumes.map(resume => (
              <div 
                key={resume.id}
                onClick={() => onEdit(resume)}
                className="group relative flex flex-col h-[280px] bg-white border border-neutral-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                {/* Card Preview Header */}
                <div className="h-32 bg-neutral-100 p-6 relative overflow-hidden">
                  <div className="absolute top-4 left-6 right-6 space-y-2 opacity-40 group-hover:opacity-60 transition-opacity">
                    <div className="h-2 bg-neutral-900 w-1/3 rounded-full"></div>
                    <div className="h-1.5 bg-neutral-400 w-1/2 rounded-full"></div>
                    <div className="space-y-1 pt-2">
                         <div className="h-1 bg-neutral-300 w-full rounded-full"></div>
                         <div className="h-1 bg-neutral-300 w-5/6 rounded-full"></div>
                    </div>
                  </div>
                  {/* Template Badge */}
                  <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded shadow-sm border border-neutral-100 text-neutral-500">
                          {resume.templateId || 'Modern'}
                      </span>
                  </div>
                  <div className="absolute top-3 right-3">
                      <button 
                        onClick={(e) => handleDelete(e, resume.id)}
                        className="p-2 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{resume.name || 'Untitled Resume'}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-1">{resume.personalInfo.jobTitle || 'No Job Title'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
                     <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(resume.lastUpdated).toLocaleDateString()}
                     </div>
                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Mode Selection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 md:p-8 border-b border-neutral-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      {createStep === 'templates' && (
                          <button onClick={() => setCreateStep('method')} className="text-neutral-400 hover:text-neutral-900 mr-2">
                              <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                      )}
                      <h2 className="text-2xl font-bold">
                          {createStep === 'method' ? 'How would you like to start?' : 'Choose a template'}
                      </h2>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
               </div>

               {createStep === 'method' ? (
                   <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
                       {/* AI Option */}
                       <button 
                          onClick={() => onCreate('ai')}
                          className="group flex flex-col text-left p-6 rounded-2xl border-2 border-neutral-100 hover:border-neutral-900 hover:bg-neutral-50 transition-all"
                       >
                          <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                              <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">AI Assistant</h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">
                              Guided experience. Our AI will help you write a professional summary, enhance your descriptions, and suggest skills.
                          </p>
                       </button>
    
                       {/* Manual Option */}
                       <button 
                          onClick={() => setCreateStep('templates')}
                          className="group flex flex-col text-left p-6 rounded-2xl border-2 border-neutral-100 hover:border-neutral-900 hover:bg-neutral-50 transition-all"
                       >
                          <div className="w-12 h-12 bg-white text-neutral-900 border-2 border-neutral-200 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                              <Grid className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">Pick a Template</h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">
                              Choose from our gallery of professional layouts and start building your resume from scratch.
                          </p>
                       </button>
                   </div>
               ) : (
                   <div className="p-6 md:p-8 grid grid-cols-2 gap-4">
                       {TEMPLATES.map(t => (
                           <button
                                key={t.id}
                                onClick={() => onCreate('manual', t.id)}
                                className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all text-left group"
                           >
                               <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                   <t.icon className="w-6 h-6" />
                               </div>
                               <div>
                                   <h3 className="font-bold text-neutral-900">{t.name}</h3>
                                   <p className="text-xs text-neutral-500 mt-1 leading-tight">{t.desc}</p>
                               </div>
                           </button>
                       ))}
                   </div>
               )}
           </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessages && (
          <Messaging 
            userId={userId} 
            onClose={() => setShowMessages(false)} 
          />
      )}
    </div>
  );
};
