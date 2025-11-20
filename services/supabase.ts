
import { createClient } from '@supabase/supabase-js';
import { ResumeData, Message, Notification, UserProfile } from '../types';

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
    contact_email?: string;
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

// --- Profile & Role ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) return null;
    return data as UserProfile;
};

// --- Messaging ---

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    const { error } = await supabase
        .from('messages')
        .insert({ sender_id: senderId, receiver_id: receiverId, content });

    if (error) throw error;
    
    // Create a notification for the receiver
    await supabase.from('notifications').insert({
        user_id: receiverId,
        type: 'message',
        content: `New message received`,
        related_id: senderId
    });
};

export const getMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
        
    if (error) throw error;
    return data as Message[];
};

export const getConversations = async (userId: string) => {
    // Complex query simplified: get all messages where user is involved
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:profiles!sender_id(full_name, id),
            receiver:profiles!receiver_id(full_name, id)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Group by the other person ID to list conversations
    const conversations = new Map();
    data.forEach((msg: any) => {
        const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
        if (!conversations.has(otherUser.id)) {
            conversations.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg
            });
        }
    });
    
    return Array.from(conversations.values());
};

// --- Notifications ---

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    return data as Notification[];
};

export const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
};
