import { useState, useEffect } from 'react';
import { getChannels } from '../services/db';
import type { CommunityChannel } from '../types/db';
import { ChannelView } from '../components/community/ChannelView';
import { Users, Search, Hash, Star } from 'lucide-react';

export const Community = () => {
    const [channels, setChannels] = useState<CommunityChannel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<CommunityChannel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const data = await getChannels();
                setChannels(data);
                // Default to first channel on desktop if available
                if (window.innerWidth >= 768 && data.length > 0 && !selectedChannel) {
                    setSelectedChannel(data[0]);
                }
            } catch (error) {
                console.error("Failed to load community channels", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl h-[calc(100vh-100px)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">

                {/* Channel List - Hidden on mobile if channel selected */}
                <div className={`md:col-span-4 lg:col-span-3 flex flex-col h-full ${selectedChannel ? 'hidden md:flex' : 'flex'}`}>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Community</h1>
                        <p className="text-slate-500 text-sm">Connect with others on the same journey</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Find a topic..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {loading ? (
                                <div className="p-4 text-center text-slate-400 text-sm">Loading communities...</div>
                            ) : (
                                channels.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${selectedChannel?.id === channel.id
                                                ? 'bg-emerald-50 border-emerald-100 ring-1 ring-emerald-200/50 shadow-sm'
                                                : 'hover:bg-slate-50 border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedChannel?.id === channel.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
                                            }`}>
                                            <Hash size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`font-semibold text-sm truncate ${selectedChannel?.id === channel.id ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                {channel.name}
                                            </h3>
                                            <p className={`text-xs truncate ${selectedChannel?.id === channel.id ? 'text-emerald-700/70' : 'text-slate-400'}`}>
                                                {channel.description}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Premium Members</p>
                                    <p className="text-[10px] text-slate-500">Access exclusive expert talks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`md:col-span-8 lg:col-span-9 h-full ${!selectedChannel ? 'hidden md:flex items-center justify-center' : 'block'}`}>
                    {selectedChannel ? (
                        <ChannelView channel={selectedChannel} onBack={() => setSelectedChannel(null)} />
                    ) : (
                        <div className="text-center p-8 max-w-sm mx-auto">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-200">
                                <Users size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Community</h2>
                            <p className="text-slate-500">Choose a channel from the left to start reading or sharing your experiences.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
