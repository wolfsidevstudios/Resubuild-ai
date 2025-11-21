
import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, db } from '../services/firebase';
import { Notification } from '../types';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Bell, X, MessageSquare, CheckCircle } from 'lucide-react';

interface NotificationsProps {
    userId: string;
    onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ userId, onClose }) => {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();

        // Subscribe to new notifications
        const q = query(
            collection(db, 'notifications'),
            where('user_id', '==', userId),
            orderBy('created_at', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setItems(notifs);
        });
            
        return () => unsubscribe();
    }, [userId]);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications(userId);
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id: string) => {
        await markNotificationRead(id);
        // State updates automatically via onSnapshot
    };

    return (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-40 animate-in slide-in-from-top-2">
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Notifications
                </h3>
                <button onClick={onClose}><X className="w-4 h-4 text-neutral-400 hover:text-neutral-900" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">No new notifications</div>
                ) : (
                    items.map(item => (
                        <div 
                            key={item.id} 
                            className={`p-4 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${!item.is_read ? 'bg-blue-50/50' : ''}`}
                            onClick={() => handleRead(item.id)}
                        >
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    {item.type === 'message' ? <MessageSquare className="w-4 h-4 text-blue-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-800">{item.content}</p>
                                    <span className="text-xs text-neutral-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
