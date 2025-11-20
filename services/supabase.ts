
import { createClient } from '@supabase/supabase-js';
import { ResumeData } from '../types';

const supabaseUrl = 'https://taxnvatmwzfhfwhuachd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheG52YXRtd3pmaGZ3aHVhY2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDkwMzEsImV4cCI6MjA3MTk4NTAzMX0.xpDSp0pxsIlhNUev4-FT3OibCUwHurQxbUe_9RNbptw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface PublishedResume {
    id: string;
    user_id: string;
    full_name: string;
    job_title: string;
    location: string;
    skills: string[];
    resume_data: ResumeData;
    created_at: string;
}

export const publishResume = async (data: ResumeData, userId: string) => {
    // Flatten data for easy querying
    const payload = {
        user_id: userId,
        resume_data: data,
        full_name: data.personalInfo.fullName,
        job_title: data.personalInfo.jobTitle,
        skills: data.skills,
        location: data.personalInfo.location,
        contact_email: data.personalInfo.email
    };

    // Upsert based on user_id to prevent duplicates/spam (one published resume per user)
    const { error } = await supabase
        .from('published_resumes')
        .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
};

export const fetchPublishedResumes = async (): Promise<PublishedResume[]> => {
    const { data, error } = await supabase
        .from('published_resumes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PublishedResume[];
};
