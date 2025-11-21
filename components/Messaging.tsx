
import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, getConversations, db } from '../services/firebase';
import { Message, UserProfile } from '../types';
import { collection, onSnapshot, query, where, orderBy, or, and } from "firebase/firestore";
import { Send, X, Loader2, User } from 'lucide-react';
import { Button } from './Button';

interface MessagingProps {
    userId: string;
    recipientId?: string; // If provided, opens chat directly with this person
    onClose: () => void;
}

export const Messaging: React.FC<MessagingProps> = ({ userId, recipientId, onClose }) => {
    const [activeChat, setActiveChat] = useState<string | null>(recipientId || null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations list
    useEffect(() => {
        loadConversations();
        
        // Real-time subscription for new messages involved with the user
        // We query messages where the user is sender OR receiver
        // Firestore 'or' query requires a composite index usually, but for simple listeners
        // checking 'or' on multiple fields, it's doable.
        // However, for simplicity and performance, we can just reload conversations 
        // when opening the modal or use a simpler trigger if needed.
        // But let's try to set up a listener on the collection filtering for this user.
        
        const q = query(
            collection(db, 'messages'), 
            or(where("sender_id", "==", userId), where("receiver_id", "==", userId)),
            orderBy("created_at", "desc")
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // When new messages arrive, reload conversation list to update snippets/ordering
            loadConversations();
            
            // Also if the new message belongs to active chat, update messages list
            if (activeChat) {
                const newMessages = snapshot.docChanges()
                    .filter(change => change.type === 'added')
                    .map(change => change.doc.data() as Message)
                    .filter(msg => 
                        (msg.sender_id === activeChat && msg.receiver_id === userId) || 
                        (msg.sender_id === userId && msg.receiver_id === activeChat)
                    );
                    
                if (newMessages.length > 0) {
                    // We can append, but to be safe and keep order correct with existing logic
                    // we might just let the activeChat effect handle it or merge.
                    // For now, relying on the activeChat listener below is safer for message content.
                }
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const loadConversations = async () => {
        try {
            const convos = await getConversations(userId);
            setConversations(convos);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    // Load active chat messages with real-time listener
    useEffect(() => {
        if (!activeChat) return;

        // Listen for messages between userId and activeChat
        const q = query(
            collection(db, 'messages'),
            or(
                and(where("sender_id", "==", userId), where("receiver_id", "==", activeChat)),
                and(where("sender_id", "==", activeChat), where("receiver_id", "==", userId))
            ),
            orderBy("created_at", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [activeChat, userId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            await sendMessage(userId, activeChat, newMessage);
            setNewMessage('');
            // Real-time listener will update the UI
        } catch (e) {
            alert('Failed to send');
            console.error(e);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-[90vw] md:w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex overflow-hidden z-50 animate-in slide-in-from-bottom-4">
            {/* Sidebar - Conversations */}
            <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-neutral-100 bg-neutral-50`}>
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Messages</h3>
                    <button onClick={onClose} className="md:hidden p-1"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-neutral-400 text-sm">No conversations yet.</div>
                    ) : (
                        conversations.map((convo: any) => (
                            <div 
                                key={convo.user.id}
                                onClick={() => setActiveChat(convo.user.id)}
                                className={`p-4 border-b border-neutral-100 cursor-pointer hover:bg-white transition-colors ${activeChat === convo.user.id ? 'bg-white border-l-4 border-l-neutral-900' : ''}`}
                            >
                                <div className="font-bold text-neutral-900">{convo.user.full_name}</div>
                                <div className="text-xs text-neutral-500 truncate">{convo.lastMessage.content}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white relative`}>
                {!activeChat ? (
                    <div className="flex-1 flex items-center justify-center text-neutral-400 flex-col gap-2">
                         <User className="w-8 h-8 opacity-20" />
                         <span>Select a conversation</span>
                         <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
                            <div className="font-bold flex items-center gap-2">
                                <button onClick={() => setActiveChat(null)} className="md:hidden text-sm text-neutral-500 mr-2">Back</button>
                                {conversations.find(c => c.user.id === activeChat)?.user.full_name || 'Chat'}
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
                            {messages.map(msg => {
                                const isMe = msg.sender_id === userId;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-none shadow-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-4 border-t border-neutral-100 flex gap-2 bg-white">
                            <input 
                                className="flex-1 bg-neutral-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" className="w-10 h-10 rounded-full p-0 flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
