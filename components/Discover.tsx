
import React, { useEffect, useState, useRef } from 'react';
import { fetchPublishedResumes } from '../services/firebase';
import { PublishedResume } from '../types';
import { ResumePreview } from './ResumePreview';
import { Search, MapPin, Briefcase, X, Loader2, FileText, User } from 'lucide-react';
import { Button } from './Button';
import { AdUnit } from './AdUnit';

interface DiscoverProps {
    onHome: () => void;
}

export const Discover: React.FC<DiscoverProps> = ({ onHome }) => {
    const [resumes, setResumes] = useState<PublishedResume[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResume, setSelectedResume] = useState<PublishedResume | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const previewRef = useRef<HTMLDivElement>(null); // Dummy ref for readonly preview

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            const data = await fetchPublishedResumes();
            setResumes(data);
        } catch (error) {
            console.error("Failed to load resumes", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResumes = resumes.filter(r => 
        r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
                        <img 
                            src="https://i.ibb.co/BVvMCjx1/Google-AI-Studio-2025-11-20-T21-17-48-480-Z-modified.png" 
                            alt="Resubuild Logo" 
                            className="w-10 h-10 rounded-xl object-cover"
                        />
                        <span className="font-bold text-xl tracking-tight">Resubuild <span className="text-neutral-400 font-normal">Discover</span></span>
                    </div>
                    <div className="relative w-full max-w-md mx-8 hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-full focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                            placeholder="Search for designers, engineers, skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" onClick={onHome}>
                        Back to App
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Hero Text */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Top Talent</h1>
                    <p className="text-neutral-500 max-w-2xl mx-auto">
                        Browse resumes created by professionals using Resubuild. Find your next hire or get inspiration for your own resume.
                    </p>
                    {/* Mobile Search */}
                    <div className="relative mt-6 md:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-full focus:ring-2 focus:ring-neutral-900 focus:outline-none shadow-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Top Ad Banner */}
                <div className="mb-12 max-w-3xl mx-auto">
                    <AdUnit slot="1234567890" className="w-full" style={{ minHeight: '100px' }} />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
                    </div>
                ) : filteredResumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">No resumes found</h3>
                        <p className="text-neutral-500">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResumes.map((resume, index) => (
                            <React.Fragment key={resume.id}>
                                <div 
                                    onClick={() => setSelectedResume(resume)}
                                    className="bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                                >
                                    {/* Preview header */}
                                    <div className="h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
                                        <div className="absolute -bottom-6 left-6">
                                            <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-md border-4 border-white">
                                                <span className="font-bold text-lg">{resume.full_name.charAt(0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8 pb-6 px-6 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-neutral-900 mb-1 line-clamp-1">{resume.full_name}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-3 font-medium">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            <span className="line-clamp-1">{resume.job_title || 'Professional'}</span>
                                        </div>

                                        {resume.location && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                                                <MapPin className="w-3 h-3" />
                                                <span className="line-clamp-1">{resume.location}</span>
                                            </div>
                                        )}
                                        
                                        <div className="mt-auto pt-4 border-t border-neutral-100">
                                            <div className="flex flex-wrap gap-1.5 h-16 overflow-hidden content-start">
                                                {resume.skills?.slice(0, 4).map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-600 text-[10px] uppercase font-bold tracking-wider rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {resume.skills && resume.skills.length > 4 && (
                                                    <span className="px-2 py-0.5 text-neutral-400 text-[10px] font-medium">
                                                        +{resume.skills.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* In-Feed Ad every 8 items */}
                                {(index + 1) % 8 === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 py-4">
                                        <AdUnit slot="1234567890" className="w-full flex justify-center" style={{ minHeight: '120px' }} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </main>

            {/* Resume Detail Modal */}
            {selectedResume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
                     <div className="bg-neutral-100 w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="bg-white px-6 py-4 border-b border-neutral-200 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg leading-tight">{selectedResume.full_name}</h2>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{selectedResume.job_title}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedResume.resume_data.personalInfo.email && (
                                    <a 
                                        href={`mailto:${selectedResume.resume_data.personalInfo.email}`}
                                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                                    >
                                        Contact
                                    </a>
                                )}
                                <button 
                                    onClick={() => setSelectedResume(null)}
                                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Resume Preview Wrapper */}
                        <div className="flex-1 overflow-hidden relative bg-neutral-200/50 flex justify-center">
                            <div className="w-full h-full overflow-auto custom-scrollbar pb-20">
                                {/* Ad Unit in Modal */}
                                <div className="max-w-[210mm] mx-auto my-4">
                                    <AdUnit slot="1234567890" style={{ minHeight: '90px' }} />
                                </div>

                                {/* Pass the resume data to preview, ensure pointer events are enabled for scrolling */}
                                <ResumePreview 
                                    data={selectedResume.resume_data} 
                                    previewRef={previewRef} 
                                />
                            </div>
                        </div>

                     </div>
                </div>
            )}
        </div>
    );
};
