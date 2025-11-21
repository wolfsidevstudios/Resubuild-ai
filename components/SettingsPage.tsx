
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { updateUser, signOut } from '../services/firebase';
import { getStoredAPIKey, saveAPIKey, removeAPIKey, getPreferredModel, savePreferredModel } from '../services/storageService';
import { Button } from './Button';
import { Input } from './InputField';
import { 
    User as UserIcon, 
    Key, 
    Shield, 
    LogOut, 
    ChevronLeft, 
    Mail, 
    CreditCard, 
    Bell,
    CheckCircle2,
    AlertCircle,
    Fingerprint,
    BrainCircuit,
    Zap,
    Cpu,
    Sparkles
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  user: User;
  userRole: string | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, user, userRole }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'account'>('profile');
  const [apiKey, setApiKey] = useState('');
  const [fullName, setFullName] = useState(user.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Model Preference
  const [preferredModel, setPreferredModel] = useState('gemini-2.5-flash');

  useEffect(() => {
    setApiKey(getStoredAPIKey() || '');
    setPreferredModel(getPreferredModel());
  }, []);

  const handleSaveProfile = async () => {
      setIsSaving(true);
      try {
          await updateUser(user.uid, { full_name: fullName });
          setSuccessMsg('Profile updated successfully.');
          setTimeout(() => setSuccessMsg(''), 3000);
      } catch (e) {
          console.error(e);
          alert('Failed to update profile.');
      } finally {
          setIsSaving(false);
      }
  };

  const handleSaveKey = () => {
     if (apiKey.trim()) {
         saveAPIKey(apiKey.trim());
     } else {
         removeAPIKey();
     }
     setSuccessMsg('API Key settings saved.');
     setTimeout(() => setSuccessMsg(''), 3000);
  };
  
  const handleSaveModel = (model: string) => {
      savePreferredModel(model);
      setPreferredModel(model);
      setSuccessMsg('AI Model preference updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
  }

  const handleSignOut = async () => {
      if (confirm('Are you sure you want to sign out?')) {
          await signOut();
          onBack(); // This usually routes to landing via App.tsx auth state change
      }
  };

  const getProviderIcon = (providerId: string) => {
      if (providerId.includes('google')) return 'Google';
      if (providerId.includes('github')) return 'GitHub';
      if (providerId.includes('yahoo')) return 'Yahoo';
      return 'Email';
  };

  const models = [
      {
          id: 'gemini-3-pro-preview',
          name: 'Gemini 3 Pro',
          desc: 'The best model in the world for multimodal understanding, and our most powerful agentic and vibe-coding model yet.',
          tag: 'Most Intelligent',
          icon: BrainCircuit,
          color: 'purple'
      },
      {
          id: 'gemini-2.5-flash', // Fallback for 2.5 pro request if mapped, or use 3-pro
          name: 'Gemini 2.5 Flash',
          desc: 'Our best model in terms of price-performance, offering well-rounded capabilities for high volume tasks.',
          tag: 'Balanced',
          icon: Zap,
          color: 'blue'
      },
      {
          id: 'gemini-2.5-flash-lite-latest',
          name: 'Gemini 2.5 Flash-Lite',
          desc: 'Our fastest flash model optimized for cost-efficiency and high throughput.',
          tag: 'Ultra Fast',
          icon: Cpu,
          color: 'green'
      }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <h1 className="text-xl font-bold text-neutral-900">Settings</h1>
                </div>
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-neutral-200" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                    </div>
                )}
            </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                
                {/* Sidebar Nav */}
                <nav className="w-full md:w-64 flex flex-col gap-1">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'profile' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:bg-white hover:shadow-sm'}`}
                    >
                        <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('integrations')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'integrations' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:bg-white hover:shadow-sm'}`}
                    >
                        <Key className="w-4 h-4" /> Integrations & AI
                    </button>
                    <button 
                        onClick={() => setActiveTab('account')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'account' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:bg-white hover:shadow-sm'}`}
                    >
                        <Shield className="w-4 h-4" /> Account
                    </button>
                </nav>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Public Profile</h2>
                                <p className="text-neutral-500">Manage how others see you on the platform.</p>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-neutral-100" />
                                        ) : (
                                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-8 h-8 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-neutral-900">{user.email}</div>
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider border border-blue-100">
                                                {userRole === 'employer' ? 'Employer' : 'Candidate'}
                                            </span>
                                            {user.providerData.map((p, i) => (
                                                <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium flex items-center gap-1">
                                                    {getProviderIcon(p.providerId)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-lg">
                                    <Input 
                                        label="Full Name" 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                    <div className="pt-2">
                                        <Input 
                                            label="Email Address" 
                                            value={user.email || ''} 
                                            disabled
                                            className="bg-neutral-50 text-neutral-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-neutral-400 mt-1.5 ml-1">Email cannot be changed via settings.</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
                                    <Button onClick={handleSaveProfile} isLoading={isSaving}>
                                        Save Changes
                                    </Button>
                                    {successMsg && (
                                        <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in">
                                            <CheckCircle2 className="w-4 h-4" /> {successMsg}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations Tab */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">API & Intelligence</h2>
                                <p className="text-neutral-500">Manage your connection to external AI services and model preferences.</p>
                            </div>

                            {/* API Key Section */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px]">AI</div>
                                        Google Gemini API Key
                                    </h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                                        To use AI features, you need to provide a Gemini API key. 
                                        Your key is stored locally in your browser's secure storage.
                                    </p>
                                    
                                    <div className="max-w-lg">
                                        <Input 
                                            label="API Key" 
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="AIzaSy..."
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
                                    <Button onClick={handleSaveKey}>
                                        Update Key
                                    </Button>
                                    {successMsg && apiKey && (
                                        <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in">
                                            <CheckCircle2 className="w-4 h-4" /> {successMsg}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Model Selection Section */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-yellow-500" /> Default AI Model
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-6">
                                        Choose the default intelligence model for all AI tools (Resume Builder, Audit, Chat).
                                    </p>

                                    <div className="grid gap-4">
                                        {models.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => handleSaveModel(m.id)}
                                                className={`text-left p-4 rounded-2xl border-2 transition-all ${preferredModel === m.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <m.icon className={`w-5 h-5 text-${m.color}-500`} />
                                                        <span className="font-bold text-neutral-900">{m.name}</span>
                                                    </div>
                                                    {preferredModel === m.id && <CheckCircle2 className="w-5 h-5 text-neutral-900" />}
                                                </div>
                                                <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 bg-${m.color}-50 text-${m.color}-700 uppercase tracking-wider`}>
                                                    {m.tag}
                                                </div>
                                                <p className="text-sm text-neutral-500 leading-relaxed">
                                                    {m.desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Account Security</h2>
                                <p className="text-neutral-500">Manage your session and account data.</p>
                            </div>

                             <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-4">Session Management</h3>
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-full shadow-sm">
                                                <Fingerprint className="w-5 h-5 text-neutral-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-neutral-900">Current Session</div>
                                                <div className="text-xs text-neutral-500">Active now</div>
                                            </div>
                                        </div>
                                        <Button variant="outline" onClick={handleSignOut} icon={<LogOut className="w-4 h-4"/>}>
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-neutral-100">
                                     <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
                                     <p className="text-sm text-neutral-500 mb-4">
                                         Permanently delete your account and all associated data. This action cannot be undone.
                                     </p>
                                     <button 
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                                        onClick={() => alert('Account deletion is not yet implemented in this demo.')}
                                     >
                                         Delete Account
                                     </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};
