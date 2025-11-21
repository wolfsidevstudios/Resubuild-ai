
// Using Remotive API (Public, no key required)
// It provides a list of remote jobs. We filter client-side for better UX on the demo.
const API_URL = 'https://remotive.com/api/remote-jobs';

export interface JobPost {
    id: number;
    url: string;
    title: string;
    company_name: string;
    company_logo: string;
    category: string;
    job_type: string;
    publication_date: string;
    candidate_required_location: string;
    salary: string;
    description: string;
}

let cachedJobs: JobPost[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export const searchJobs = async (query: string, location: string = ''): Promise<JobPost[]> => {
    try {
        // Check cache first to avoid hitting API limit/latency
        const now = Date.now();
        if (cachedJobs.length === 0 || now - lastFetchTime > CACHE_DURATION) {
            const response = await fetch(API_URL);
            const data = await response.json();
            cachedJobs = data.jobs;
            lastFetchTime = now;
        }

        let results = cachedJobs;

        if (query) {
            const q = query.toLowerCase();
            results = results.filter(job => 
                job.title.toLowerCase().includes(q) || 
                job.company_name.toLowerCase().includes(q) ||
                job.category.toLowerCase().includes(q)
            );
        }

        if (location) {
            const l = location.toLowerCase();
            results = results.filter(job => 
                job.candidate_required_location.toLowerCase().includes(l)
            );
        }

        // Return top 50 matches to keep UI snappy
        return results.slice(0, 50);

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
};
