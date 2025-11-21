
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, ExternalLink, Building2, Filter, Globe, ChevronRight, X } from 'lucide-react';
import { searchJobs, JobPost } from '../services/jobService';
import { Button } from './Button';
import { Input } from './InputField';

export const JobSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
    
    // Initial load
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        const results = await searchJobs(query, location);
        setJobs(results);
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-full flex flex-col bg-neutral-50 relative overflow-hidden">
            {/* Header Section */}
            <div className="bg-white border-b border-neutral-200 px-8 py-6 z-20 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Find your next role</h1>
                    <p className="text-neutral-500 mb-6">Browse thousands of remote-friendly jobs from top tech companies.</p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input 
                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                                placeholder="Job title, keywords, or company..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input 
                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                                placeholder="Location (e.g. 'Worldwide', 'USA')..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <Button type="submit" isLoading={loading} className="px-8 py-3 h-auto rounded-xl shadow-lg shadow-neutral-900/20">
                            Search Jobs
                        </Button>
                    </form>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Stats / Filters Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-medium text-neutral-500">
                                Showing <span className="text-neutral-900 font-bold">{jobs.length}</span> jobs
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50">
                                    <Filter className="w-3 h-3" /> Filters
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50">
                                    <Globe className="w-3 h-3" /> Remote Only
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 h-48 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-xl"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                                                <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900">No jobs found</h3>
                                <p className="text-neutral-500">Try adjusting your search terms or location.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {jobs.map(job => (
                                    <div 
                                        key={job.id}
                                        onClick={() => setSelectedJob(job)}
                                        className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white border border-neutral-100 rounded-xl flex items-center justify-center p-1 shadow-sm">
                                                    {job.company_logo ? (
                                                        <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-lg" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
                                                    ) : (
                                                        <Building2 className="w-6 h-6 text-neutral-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-neutral-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                                    <div className="text-sm text-neutral-500 font-medium">{job.company_name}</div>
                                                </div>
                                            </div>
                                            {job.publication_date && (
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50 px-2 py-1 rounded">
                                                    {formatDate(job.publication_date)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" /> {job.job_type || 'Full-time'}
                                            </span>
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> {job.candidate_required_location || 'Remote'}
                                            </span>
                                            {job.salary && (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" /> {job.salary}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-neutral-50 flex justify-between items-center">
                                            <span className="text-xs text-neutral-400 font-medium">{job.category}</span>
                                            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                View Details <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Details Slide-over */}
                {selectedJob && (
                    <div className="absolute inset-0 z-30 flex justify-end bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200">
                        <div 
                            className="w-full md:w-[600px] bg-white h-full shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-neutral-100 flex justify-between items-start bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                                        {selectedJob.company_logo ? (
                                            <img src={selectedJob.company_logo} alt={selectedJob.company_name} className="w-full h-full object-contain rounded-xl" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-neutral-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900 leading-tight">{selectedJob.title}</h2>
                                        <div className="text-neutral-500 font-medium">{selectedJob.company_name}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <div className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {selectedJob.candidate_required_location}
                                    </div>
                                    <div className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> {selectedJob.job_type}
                                    </div>
                                    <div className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Posted {formatDate(selectedJob.publication_date)}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-4">Job Description</h3>
                                <div 
                                    className="prose prose-neutral prose-sm max-w-none text-neutral-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                                />
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setSelectedJob(null)}>Close</Button>
                                <a 
                                    href={selectedJob.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                                >
                                    Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Click outside to close */}
                        <div className="flex-1" onClick={() => setSelectedJob(null)} />
                    </div>
                )}
            </div>
        </div>
    );
};
