
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  or,
  and
} from "firebase/firestore";
import { ResumeData, Message, Notification, UserProfile, PublishedResume } from '../types';

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
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- Resume Publishing ---

export const publishResume = async (data: ResumeData, userId: string) => {
    try {
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

        // Use userId as doc ID to enforce one published resume per user
        await setDoc(doc(db, "published_resumes", userId), payload);
        return true;
    } catch (error) {
        console.error("Error publishing resume:", error);
        throw error;
    }
};

export const fetchPublishedResumes = async (): Promise<PublishedResume[]> => {
    try {
        const q = query(collection(db, "published_resumes"), orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublishedResume));
    } catch (error) {
        console.error("Error fetching published resumes:", error);
        return [];
    }
};

// --- Profile & Role ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as UserProfile;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    return null;
};

export const createUserProfile = async (user: User, role: 'candidate' | 'employer' = 'candidate', fullName?: string) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        if (!snap.exists()) {
            const profileData: UserProfile = {
                id: user.uid,
                full_name: fullName || user.displayName || "User",
                role: role,
                avatar_url: user.photoURL || undefined
            };
            await setDoc(userRef, profileData);
        }
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
};

export const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, data);
        
        // If name is updated, also update Auth profile
        if (data.full_name && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: data.full_name });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// --- Messaging ---

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    try {
        await addDoc(collection(db, "messages"), {
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            created_at: new Date().toISOString(),
            is_read: false
        });
        
        // Create a notification for the receiver
        await addDoc(collection(db, "notifications"), {
            user_id: receiverId,
            type: 'message',
            content: `New message received`,
            related_id: senderId,
            is_read: false,
            created_at: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
    try {
        const q = query(
            collection(db, "messages"),
            or(
                and(where("sender_id", "==", userId), where("receiver_id", "==", otherUserId)),
                and(where("sender_id", "==", otherUserId), where("receiver_id", "==", userId))
            ),
            orderBy("created_at", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const getConversations = async (userId: string) => {
    try {
        // Fetch all messages where user is sender OR receiver
        const q = query(
            collection(db, "messages"),
            or(where("sender_id", "==", userId), where("receiver_id", "==", userId)),
            orderBy("created_at", "desc")
        );
        
        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        
        // Group by other user
        const conversationMap = new Map();
        
        for (const msg of messages) {
            const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
            if (!conversationMap.has(otherId)) {
                // Need to fetch profile for display
                const profile = await getUserProfile(otherId);
                if (profile) {
                    conversationMap.set(otherId, {
                        user: profile,
                        lastMessage: msg
                    });
                }
            }
        }
        
        return Array.from(conversationMap.values());
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};

// --- Notifications ---

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    try {
        const q = query(
            collection(db, "notifications"), 
            where("user_id", "==", userId), 
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markNotificationRead = async (id: string) => {
    try {
        const docRef = doc(db, "notifications", id);
        await updateDoc(docRef, { is_read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const signOut = async () => {
    await firebaseSignOut(auth);
};
