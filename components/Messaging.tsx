
import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, getConversations } from '../services/supabase';
import { Message, UserProfile } from '../types';
import { supabase } from '../services/supabase';
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
        
        // Real-time subscription for new messages
        const channel = supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    const msg = payload.new as Message;
                    if (msg.sender_id === activeChat || msg.receiver_id === activeChat) {
                         setMessages(prev => [...prev, msg]);
                    }
                    loadConversations(); // Refresh list order
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [activeChat]);

    const loadConversations = async () => {
        try {
            const convos = await getConversations(userId);
            setConversations(convos);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    // Load active chat messages
    useEffect(() => {
        if (activeChat) {
            getMessages(userId, activeChat).then(setMessages);
        }
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
            // Optimistic update handled by subscription or we can do it here
        } catch (e) {
            alert('Failed to send');
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
