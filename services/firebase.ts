import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { ResumeData, UserProfile, Message, Notification } from "../types";

const firebaseConfig = {
    apiKey: "AIzaSyALmX4xk9t4PbRK_3MSl3wxMyEayK9tbBI",
    authDomain: "wolfsi-studios.firebaseapp.com",
    projectId: "wolfsi-studios",
    storageBucket: "wolfsi-studios.firebasestorage.app",
    messagingSenderId: "562922803230",
    appId: "1:562922803230:web:19f1d436de5ed763275e0f",
    measurementId: "G-HCQ6FH170Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface PublishedResume {
    id: string;
    user_id: string;
    full_name: string;
    job_title: string;
    location: string;
    skills: string[];
    resume_data: ResumeData;
    created_at: string; // ISO string
    contact_email?: string;
}

// --- Resume Publishing ---

export const publishResume = async (data: ResumeData, userId: string) => {
    const payload = {
        user_id: userId,
        resume_data: data,
        full_name: data.personalInfo.fullName,
        job_title: data.personalInfo.jobTitle,
        skills: data.skills,
        location: data.personalInfo.location,
        contact_email: data.personalInfo.email,
        created_at: new Date().toISOString()
    };

    // Use user_id as document ID to ensure one resume per user
    await setDoc(doc(db, "published_resumes", userId), payload);
    return true;
};

export const fetchPublishedResumes = async (): Promise<PublishedResume[]> => {
    const q = query(collection(db, "published_resumes"), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublishedResume));
};

// --- Profile & Role ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "profiles", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    await setDoc(doc(db, "profiles", userId), data, { merge: true });
};

// --- Messaging ---

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    await addDoc(collection(db, "messages"), {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString(),
        is_read: false
    });
    
    // Create notification
    await addDoc(collection(db, "notifications"), {
        user_id: receiverId,
        type: 'message',
        content: `New message received`,
        related_id: senderId,
        created_at: new Date().toISOString(),
        is_read: false
    });
};

export const getMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
    // Firestore doesn't support logical OR easily in one query for this case without multiple queries or client-side filtering
    // Simple approach: Get relevant messages
    const q = query(
        collection(db, "messages"),
        orderBy("created_at", "asc")
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    
    return messages.filter(m => 
        (m.sender_id === userId && m.receiver_id === otherUserId) || 
        (m.sender_id === otherUserId && m.receiver_id === userId)
    );
};

export const getConversations = async (userId: string) => {
    // This is complex in NoSQL. 
    // Simplified: Get all messages involving user, then group by other party.
    const q = query(
        collection(db, "messages"),
        orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    
    const myMessages = allMessages.filter(m => m.sender_id === userId || m.receiver_id === userId);
    
    const conversations = new Map();
    
    for (const msg of myMessages) {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!conversations.has(otherId)) {
             const otherProfile = await getUserProfile(otherId);
             if (otherProfile) {
                 conversations.set(otherId, {
                     user: otherProfile,
                     lastMessage: msg
                 });
             }
        }
    }
    
    return Array.from(conversations.values());
};

// --- Notifications ---

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const q = query(
        collection(db, "notifications"),
        where("user_id", "==", userId),
        orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const markNotificationRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { is_read: true });
};

