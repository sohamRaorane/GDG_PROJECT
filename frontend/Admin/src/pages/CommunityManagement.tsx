import { useState, useEffect } from 'react';
import { getChannels, getChannelPosts, subscribeToChannelPosts } from '../services/db';
import type { CommunityChannel, CommunityPost } from '../services/db';
import { Users, Hash, Search, ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const CommunityManagement = () => {
    const [channels, setChannels] = useState<CommunityChannel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<CommunityChannel | null>(null);
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const data = await getChannels();
                setChannels(data);
            } catch (error) {
                console.error("Failed to load channels", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, []);

    useEffect(() => {
        if (!selectedChannel) return;

        setLoadingPosts(true);

        const unsubscribe = subscribeToChannelPosts(selectedChannel.id, (fetchedPosts) => {
            setPosts(fetchedPosts);
            setLoadingPosts(false);
        });

        // Cleanup function to unsubscribe when component unmounts or channel changes
        return () => unsubscribe();
    }, [selectedChannel]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Community Lobbies</h1>
                    <p className="text-slate-500 text-sm">Monitor patient discussions and engagement</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <Users size={16} />
                    {channels.length} Active Channels
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
                    </div>
                ) : (
                    channels.map((channel) => (
                        <div
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                    <Hash size={24} />
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-1">{channel.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2">{channel.description}</p>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <span>Channel ID: {channel.id}</span>
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md group-hover:bg-emerald-100 transition-colors">View Posts</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={!!selectedChannel}
                onClose={() => setSelectedChannel(null)}
                title={selectedChannel ? `Lobby: ${selectedChannel.name}` : 'Details'}
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {loadingPosts ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-emerald-500 h-6 w-6" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <MessageSquare className="mx-auto mb-2 opacity-20" size={32} />
                            <p>No messages in this lobby yet.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                    {post.userAvatar ? <img src={post.userAvatar} className="w-full h-full rounded-full object-cover" /> : post.userName?.[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-800 text-sm">{post.userName}</span>
                                        <span className="text-xs text-slate-400">{post.createdAt?.toDate().toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{post.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CommunityManagement;
