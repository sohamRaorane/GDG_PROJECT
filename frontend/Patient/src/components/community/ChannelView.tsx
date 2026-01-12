import { useState, useEffect, useRef } from 'react';
import { Send, User, ThumbsUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getChannelPosts, createPost, joinChannel, isChannelMember, subscribeToChannelPosts } from '../../services/db';
import type { CommunityChannel, CommunityPost } from '../../types/db';
import { Timestamp } from 'firebase/firestore';
import { Button } from '../ui/Button';

interface ChannelViewProps {
    channel: CommunityChannel;
    onBack: () => void;
}

export const ChannelView = ({ channel, onBack }: ChannelViewProps) => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoading(true);
            try {
                const fetchedPosts = await getChannelPosts(channel.id);
                setPosts(fetchedPosts);

                if (currentUser) {
                    const memberStatus = await isChannelMember(channel.id, currentUser.uid);
                    setIsMember(memberStatus);
                }
            } catch (error) {
                console.error("Failed to load posts", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, [channel.id, currentUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [posts]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;

        const post: Omit<CommunityPost, 'id'> = {
            channelId: channel.id,
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Anonymous',
            userAvatar: currentUser.photoURL || '',
            content: newMessage,
            createdAt: Timestamp.now(),
            likes: 0
        };

        try {
            await createPost(post);
            setNewMessage('');
            // Real-time listener will update posts automatically
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleJoin = async () => {
        if (!currentUser) return;
        try {
            await joinChannel(channel.id, currentUser.uid);
            setIsMember(true);
        } catch (error) {
            console.error("Failed to join channel", error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-[#FFFCF5] rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden text-slate-500 hover:text-slate-700">← Back</button>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {/* Try to render icon dynamically or fallback */}
                        <span className="font-bold text-lg">{channel.name[0]}</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">{channel.name}</h2>
                        <p className="text-xs text-slate-500">{channel.description}</p>
                    </div>
                </div>
                {!isMember && currentUser && (
                    <Button onClick={handleJoin} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Join Community
                    </Button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {isLoading ? (
                    <div className="flex justify-center py-10"><span className="loading loading-spinner text-emerald-500"></span></div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No messages yet. Be the first to start the conversation!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className={`flex gap-3 ${post.userId === currentUser?.uid ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                                {post.userAvatar ? (
                                    <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <User size={14} />
                                    </div>
                                )}
                            </div>
                            <div className={`max-w-[75%] rounded-2xl p-3 ${post.userId === currentUser?.uid
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                                }`}>
                                <div className={`text-xs font-bold mb-1 ${post.userId === currentUser?.uid ? 'text-emerald-100' : 'text-slate-900'}`}>
                                    {post.userName}
                                </div>
                                <p className="text-sm">{post.content}</p>
                                <div className={`text-[10px] mt-1 flex justify-end gap-1 ${post.userId === currentUser?.uid ? 'text-emerald-200' : 'text-slate-400'}`}>
                                    {post.createdAt ? post.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {currentUser ? (
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isMember ? "Type a message..." : "Join to post messages"}
                            disabled={!isMember}
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || !isMember}
                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-slate-50 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-500">Please <a href="/login" className="text-emerald-600 font-bold hover:underline">login</a> to participate.</p>
                </div>
            )}
        </div>
    );
};
