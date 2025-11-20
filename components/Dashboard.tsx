
import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, Trash2, Edit2, ArrowRight, Settings, Key, X, LogOut } from 'lucide-react';
import { ResumeData } from '../types';
import { getResumes, deleteResume, getStoredAPIKey, saveAPIKey, removeAPIKey } from '../services/storageService';
import { supabase } from '../services/supabase';
import { Button } from './Button';
import { Input } from './InputField';

interface DashboardProps {
  onCreate: () => void;
  onEdit: (resume: ResumeData) => void;
  onHome: () => void;
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreate, onEdit, onHome, userId }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
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

  const handleSaveSettings = () => {
    if (apiKey.trim()) {
      saveAPIKey(apiKey.trim());
    } else {
      removeAPIKey();
    }
    setShowSettings(false);
  };

  const handleSignOut = async () => {
      await supabase.auth.signOut();
      onHome();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Resubuild</span>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => setShowSettings(true)} icon={<Settings className="w-4 h-4" />}>
                Settings
             </Button>
             <Button variant="ghost" onClick={handleSignOut} icon={<LogOut className="w-4 h-4" />}>
                Sign Out
             </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-neutral-500">Manage and edit your saved resumes.</p>
          </div>
          <Button onClick={onCreate} icon={<Plus className="w-5 h-5" />}>
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
            <Button onClick={onCreate} variant="primary">
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <div 
              onClick={onCreate}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/20 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Settings
                    </h3>
                    <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <Key className="w-4 h-4" /> Gemini API Key
                        </label>
                        <Input 
                            label="" 
                            type="password"
                            placeholder="Paste your API Key here"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-neutral-500">
                            Your API key is stored locally in your browser. 
                            Leave empty to remove the key.
                        </p>
                    </div>
                </div>
                <div className="p-5 border-t border-neutral-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowSettings(false)}>Cancel</Button>
                    <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
