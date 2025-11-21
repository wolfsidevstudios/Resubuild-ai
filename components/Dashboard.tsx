
import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, Trash2, ArrowRight, Settings, LogOut, Bell, MessageSquare, Sparkles, Layout, Palette, AlignLeft, Grid, Search, Linkedin, FlaskConical, LayoutGrid, X, Briefcase, Feather, Terminal } from 'lucide-react';
import { ResumeData } from '../types';
import { getResumes, deleteResume } from '../services/storageService';
import { signOut } from '../services/firebase';
import { Button } from './Button';
import { Messaging } from './Messaging';
import { Notifications } from './Notifications';
import { Resupilot } from './Resupilot';
import { LinkedInAgent } from './LinkedInAgent';
import { BetaTools } from './BetaTools';
import { AgentBuilder } from './AgentBuilder';
import { JobSearch } from './JobSearch';
import { TemplateThumbnail } from './TemplateThumbnail';

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
    { id: 'elegant', name: 'Elegant', icon: Feather, desc: 'Sophisticated serif typography.' },
    { id: 'tech', name: 'Tech', icon: Terminal, desc: 'Monospaced layout for developers.' },
];

// Sidebar Icon Helper
const SidebarItem = ({ icon: Icon, label, active, onClick, className = '', alert }: any) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative flex-shrink-0
      ${active ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900'}
      ${className}
    `}
  >
    <Icon className="w-5 h-5" />
    {alert && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
    
    {/* Tooltip */}
    <div className="absolute left-14 bg-neutral-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl translate-x-2 group-hover:translate-x-0">
      {label}
      {/* Arrow */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-neutral-900 rotate-45"></div>
    </div>
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ onCreate, onEdit, onHome, onSettings, userId }) => {
  const [view, setView] = useState<'dashboard' | 'linkedin' | 'beta-tools' | 'agent-builder' | 'jobs'>('dashboard');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResupilot, setShowResupilot] = useState(false);
  
  // Creation Flow State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'method' | 'templates'>('method');
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load resumes for this specific user
    setResumes(getResumes(userId).sort((a, b) => b.lastUpdated - a.lastUpdated));
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
  
  const handleLinkedInSave = (newResume: ResumeData) => {
      setView('dashboard');
      setResumes(getResumes(userId).sort((a, b) => b.lastUpdated - a.lastUpdated));
      onEdit(newResume);
  };

  const filteredResumes = resumes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.personalInfo.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));

  if (showResupilot) {
      return <Resupilot userId={userId} onExit={() => setShowResupilot(false)} onSave={handleResupilotSave} />;
  }
  
  if (view === 'agent-builder') {
      return <AgentBuilder userId={userId} onClose={() => setView('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden selection:bg-neutral-900 selection:text-white">
      
      {/* 1. THIN LEFT SIDEBAR */}
      <aside className="w-20 bg-white flex flex-col items-center py-8 gap-6 z-30 shrink-0">
          {/* Logo */}
          <div className="mb-2 cursor-pointer" onClick={onHome}>
              <img 
                  src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                  alt="Logo" 
                  className="w-10 h-10 rounded-xl object-cover hover:scale-105 transition-transform shadow-sm"
              />
          </div>

          {/* Nav Icons */}
          <div className="flex flex-col gap-4 w-full items-center">
               <SidebarItem 
                  icon={Grid} 
                  label="Dashboard" 
                  active={view === 'dashboard'}
                  onClick={() => setView('dashboard')}
               />
               <SidebarItem 
                  icon={Plus} 
                  label="Create New" 
                  onClick={openCreateModal}
                  className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
               />
               <SidebarItem 
                  icon={Briefcase} 
                  label="Find Jobs" 
                  active={view === 'jobs'}
                  onClick={() => setView('jobs')}
                  className="text-emerald-600 hover:text-emerald-700"
               />
               <SidebarItem 
                  icon={Sparkles} 
                  label="Resupilot AI" 
                  onClick={() => setShowResupilot(true)}
                  className="text-purple-600 hover:text-purple-700"
               />
               <SidebarItem 
                  icon={Linkedin} 
                  label="LinkedIn Agent" 
                  active={view === 'linkedin'}
                  onClick={() => setView('linkedin')}
                  className="text-[#0077b5] hover:text-[#0077b5]"
               />
               <SidebarItem 
                  icon={LayoutGrid} 
                  label="Agent Builder" 
                  active={view === 'agent-builder'}
                  onClick={() => setView('agent-builder')}
                  className="text-indigo-600 hover:text-indigo-700"
               />
               <SidebarItem 
                  icon={FlaskConical} 
                  label="Beta Tools" 
                  active={view === 'beta-tools'}
                  onClick={() => setView('beta-tools')}
                  className="text-orange-600 hover:text-orange-700"
               />
               <SidebarItem 
                  icon={MessageSquare} 
                  label="Messages" 
                  onClick={() => setShowMessages(true)}
               />
          </div>

          <div className="flex-1"></div>

          {/* Bottom Icons */}
          <div className="flex flex-col gap-4 pb-2">
              <SidebarItem 
                  icon={Settings} 
                  label="Settings" 
                  onClick={onSettings}
               />
              <SidebarItem 
                  icon={LogOut} 
                  label="Sign Out" 
                  onClick={handleSignOut}
                  className="hover:text-red-500 hover:bg-red-50"
               />
          </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 h-full p-4 relative">
          
          {/* FLOATING CONTENT BOX */}
          <div className="w-full h-full bg-neutral-50/50 border border-neutral-200 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-sm">
              
              {/* Show Header only in Dashboard View */}
              {view === 'dashboard' && (
                  <header className="px-8 py-6 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-neutral-100/50">
                      <div>
                          <h1 className="text-2xl font-bold text-neutral-900">My Resumes</h1>
                          <p className="text-sm text-neutral-400 font-medium">Manage and edit your documents</p>
                      </div>

                      <div className="flex items-center gap-4">
                          {/* Search Bar */}
                          <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full border border-neutral-200 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all shadow-sm">
                              <Search className="w-4 h-4 text-neutral-400 mr-2" />
                              <input 
                                  placeholder="Search..." 
                                  className="bg-transparent outline-none text-sm w-40 placeholder-neutral-400"
                                  value={searchTerm}
                                  onChange={e => setSearchTerm(e.target.value)}
                              />
                          </div>

                          <div className="h-8 w-px bg-neutral-200 mx-2"></div>

                          {/* Notifications Bell */}
                          <div className="relative">
                              <Button variant="ghost" onClick={() => setShowNotifications(!showNotifications)} className="bg-white shadow-sm hover:bg-neutral-100">
                                  <Bell className="w-4 h-4" />
                              </Button>
                              {showNotifications && (
                                  <div className="absolute right-0 mt-2 z-50">
                                      <Notifications userId={userId} onClose={() => setShowNotifications(false)} />
                                  </div>
                              )}
                          </div>
                      </div>
                  </header>
              )}

              {/* Scrollable Content Area */}
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                
                {/* VIEW: JOB SEARCH */}
                {view === 'jobs' && (
                    <JobSearch />
                )}

                {/* VIEW: LINKEDIN AGENT */}
                {view === 'linkedin' && (
                    <LinkedInAgent onSave={handleLinkedInSave} />
                )}
                
                {/* VIEW: BETA TOOLS */}
                {view === 'beta-tools' && (
                    <BetaTools resumes={resumes} onHome={() => setView('dashboard')} />
                )}

                {/* VIEW: DASHBOARD */}
                {view === 'dashboard' && (
                    <div className="p-8">
                        {resumes.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
                              <FileText className="w-8 h-8 text-neutral-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-neutral-900">No resumes yet</h3>
                            <p className="text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
                              Start building your professional identity today. Use AI to craft the perfect resume in minutes.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button onClick={openCreateModal} variant="primary" className="shadow-lg shadow-neutral-900/20">
                                  Create Resume
                                </Button>
                                <Button onClick={() => setShowResupilot(true)} variant="secondary" icon={<Sparkles className="w-4 h-4 text-purple-600" />}>
                                    AI Builder
                                </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Create New Card */}
                            <div 
                              onClick={openCreateModal}
                              className="group flex flex-col items-center justify-center h-[320px] bg-white border border-dashed border-neutral-300 rounded-[2rem] hover:border-neutral-900 hover:bg-white transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1"
                            >
                              <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                                <Plus className="w-6 h-6 text-neutral-400 group-hover:text-white" />
                              </div>
                              <span className="font-bold text-neutral-900">Create New</span>
                              <span className="text-xs text-neutral-400 mt-1 font-medium">Start from scratch</span>
                            </div>

                            {/* Resume Cards */}
                            {filteredResumes.map(resume => (
                              <div 
                                key={resume.id}
                                onClick={() => onEdit(resume)}
                                className="group relative flex flex-col h-[320px] bg-white border border-neutral-200/60 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-neutral-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                              >
                                {/* Card Preview Header */}
                                <div className="h-40 bg-neutral-100/50 p-6 relative overflow-hidden flex flex-col justify-center">
                                  
                                  {/* Template Thumbnail Preview (Simplified for Card) */}
                                  <div className="absolute inset-4 opacity-50 group-hover:opacity-80 transition-opacity duration-500 transform group-hover:scale-105 origin-top">
                                      <div className="w-full h-full border border-neutral-200 bg-white shadow-sm rounded-lg p-2">
                                          <div className="w-1/3 h-2 bg-neutral-800 rounded-full mb-2"></div>
                                          <div className="w-full h-1 bg-neutral-100 rounded-full mb-1"></div>
                                          <div className="w-full h-1 bg-neutral-100 rounded-full mb-1"></div>
                                          <div className="w-2/3 h-1 bg-neutral-100 rounded-full"></div>
                                      </div>
                                  </div>

                                  {/* Template Badge */}
                                  <div className="absolute top-4 left-4 z-10">
                                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-neutral-100 text-neutral-500">
                                          {resume.templateId || 'Modern'}
                                      </span>
                                  </div>
                                  
                                  {/* Delete Action */}
                                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-200">
                                      <button 
                                        onClick={(e) => handleDelete(e, resume.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                  </div>
                                </div>

                                {/* Card Body */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg mb-1 line-clamp-1 text-neutral-900 group-hover:text-blue-600 transition-colors">{resume.name || 'Untitled Resume'}</h3>
                                    <p className="text-sm text-neutral-500 line-clamp-1 font-medium">{resume.personalInfo.jobTitle || 'No Job Title'}</p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50 mt-2">
                                     <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {new Date(resume.lastUpdated).toLocaleDateString()}
                                     </div>
                                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                                     </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                )}
              </main>
          </div>
      </div>

      {/* Create Mode Selection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200 scale-100 max-h-[90vh] flex flex-col">
               <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                  <div className="flex items-center gap-3">
                      {createStep === 'templates' && (
                          <button onClick={() => setCreateStep('method')} className="p-2 bg-white border border-neutral-200 rounded-full hover:bg-neutral-100 transition-colors">
                              <ArrowRight className="w-4 h-4 rotate-180" />
                          </button>
                      )}
                      <h2 className="text-2xl font-bold tracking-tight">
                          {createStep === 'method' ? 'How would you like to start?' : 'Choose a starting point'}
                      </h2>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
               </div>

               {createStep === 'method' ? (
                   <div className="p-8 grid md:grid-cols-2 gap-6 overflow-y-auto">
                       {/* AI Option */}
                       <button 
                          onClick={() => onCreate('ai')}
                          className="group flex flex-col text-left p-8 rounded-3xl border-2 border-neutral-100 hover:border-blue-600 hover:bg-blue-50/30 transition-all relative overflow-hidden"
                       >
                          <div className="absolute top-0 right-0 p-3">
                              <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Recommended</div>
                          </div>
                          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Sparkles className="w-7 h-7" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-neutral-900">AI Assistant</h3>
                          <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                              Guided experience. We'll interview you to extract your best skills and write your summary automatically.
                          </p>
                       </button>
    
                       {/* Manual Option */}
                       <button 
                          onClick={() => setCreateStep('templates')}
                          className="group flex flex-col text-left p-8 rounded-3xl border-2 border-neutral-100 hover:border-neutral-900 hover:bg-neutral-50 transition-all"
                       >
                          <div className="w-14 h-14 bg-white text-neutral-900 border border-neutral-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                              <Grid className="w-7 h-7" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-neutral-900">Pick a Template</h3>
                          <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                              Choose from our gallery of professional layouts and start building your resume from scratch manually.
                          </p>
                       </button>
                   </div>
               ) : (
                   <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar bg-neutral-50/50">
                       {TEMPLATES.map(t => (
                           <div key={t.id} className="flex flex-col gap-3">
                               <TemplateThumbnail 
                                   templateId={t.id}
                                   selected={false}
                                   onClick={() => onCreate('manual', t.id)}
                               />
                               <div className="text-center">
                                   <div className="font-bold text-neutral-900 text-sm">{t.name}</div>
                                   <div className="text-xs text-neutral-500">{t.desc}</div>
                               </div>
                           </div>
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
