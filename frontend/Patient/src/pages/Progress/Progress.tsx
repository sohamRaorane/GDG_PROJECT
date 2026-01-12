
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHealthLogs, createHealthLog } from '../../services/db';
import type { DailyHealthLog } from '../../types/db';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Plus, Activity, Moon, Utensils, Heart, Brain, Coffee } from 'lucide-react';
import { SentimentSlider } from '../../components/ui/SentimentSlider';

export const Progress = () => {
    const { currentUser: user } = useAuth();
    const [logs, setLogs] = useState<DailyHealthLog[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        painLevel: 5,
        appetiteLevel: 5,
        sleepQuality: 5,
        digestionQuality: 'Moderate' as 'Poor' | 'Moderate' | 'Excellent',
        mentalState: 'Calm' as 'Agitated' | 'Calm' | 'Lethargic',
        notes: ''
    });

    useEffect(() => {
        const loadLogs = async () => {
            if (user) {
                const data = await getHealthLogs(user.uid);
                setLogs(data);
            }
        };
        loadLogs();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const date = format(new Date(), 'yyyy-MM-dd');
        // Check for high pain level to set flag (simple frontend logic, backend will also handle this)
        const isFlagged = formData.painLevel >= 8;
        const flaggedReason = isFlagged ? `High pain level reported: ${formData.painLevel}` : undefined;

        const newLog: Omit<DailyHealthLog, 'id'> = {
            userId: user.uid,
            date,
            painLevel: formData.painLevel,
            appetiteLevel: formData.appetiteLevel,
            sleepQuality: formData.sleepQuality,
            digestionQuality: formData.digestionQuality,
            mentalState: formData.mentalState,
            notes: formData.notes,
            isFlagged,
            ...(flaggedReason ? { flaggedReason } : {}),
            createdAt: Timestamp.now()
        };

        await createHealthLog(newLog);

        // Refresh logs
        const updatedLogs = await getHealthLogs(user.uid);
        setLogs(updatedLogs);
        setShowForm(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-text bg-gradient-to-r from-primary to-deep-forest bg-clip-text text-transparent">Proof of Healing</h1>
                    <p className="text-gray-600 mt-2 italic">"Your path to wellness, measured one step at a time."</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-6 py-6 rounded-2xl shadow-lg transition-all duration-300 ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover animate-pulse'}`}
                >
                    {showForm ? 'Close Check-in' : <><Plus size={20} /> Today's Check-in</>}
                </Button>
            </div>

            {/* Input Form */}
            {showForm && (
                <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Heart size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Daily Dinacharya</h2>
                            <p className="text-slate-500 text-sm">Help us understand your health today.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 text-black">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SentimentSlider
                                label="Pain Level"
                                value={formData.painLevel}
                                onChange={(val) => setFormData({ ...formData, painLevel: val })}
                                icon={<Activity size={18} className="text-red-500" />}
                                colorClass="text-red-600"
                            />
                            <SentimentSlider
                                label="Appetite Level"
                                value={formData.appetiteLevel}
                                onChange={(val) => setFormData({ ...formData, appetiteLevel: val })}
                                icon={<Utensils size={18} className="text-orange-500" />}
                                colorClass="text-orange-600"
                            />
                            <SentimentSlider
                                label="Sleep Quality"
                                value={formData.sleepQuality}
                                onChange={(val) => setFormData({ ...formData, sleepQuality: val })}
                                icon={<Moon size={18} className="text-blue-500" />}
                                colorClass="text-blue-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Coffee size={18} className="text-amber-600" /> Digestion Quality
                                </label>
                                <div className="flex gap-2">
                                    {['Poor', 'Moderate', 'Excellent'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, digestionQuality: status as any })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${formData.digestionQuality === status
                                                ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200 scale-105'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-500 hover:text-amber-500'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Brain size={18} className="text-purple-600" /> Mental State
                                </label>
                                <div className="flex gap-2">
                                    {['Agitated', 'Calm', 'Lethargic'].map((state) => (
                                        <button
                                            key={state}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, mentalState: state as any })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${formData.mentalState === state
                                                ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-200 scale-105'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-purple-500 hover:text-purple-500'
                                                }`}
                                        >
                                            {state}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Optional Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Describe any symptoms or observations..."
                                className="w-full p-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all h-32 text-black"
                            />
                        </div>

                        <Button type="submit" className="w-full py-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                            Submit Log & Update Healing Path
                        </Button>
                    </form>
                </div>
            )}

            {/* Chart Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6">14-Day Wellness Trends</h2>
                <div className="h-[400px] w-full">
                    {logs.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={logs}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 10]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="painLevel"
                                    name="Pain Level"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="appetiteLevel"
                                    name="Appetite"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sleepQuality"
                                    name="Sleep Quality"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Activity size={48} className="mb-4 opacity-20" />
                            <p>No health logs yet. Add your first entry to see the chart!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
