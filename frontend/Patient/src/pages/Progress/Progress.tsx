
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHealthLogs, createHealthLog } from '../../services/db';
import type { DailyHealthLog } from '../../types/db';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Plus, Activity, Moon, Utensils } from 'lucide-react';

export const Progress = () => {
    const { currentUser: user } = useAuth();
    const [logs, setLogs] = useState<DailyHealthLog[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        painLevel: 5,
        appetiteLevel: 5,
        sleepQuality: 5,
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
        const newLog = {
            userId: user.uid,
            date,
            painLevel: formData.painLevel,
            appetiteLevel: formData.appetiteLevel,
            sleepQuality: formData.sleepQuality,
            notes: formData.notes,
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
                    <h1 className="text-3xl font-display font-bold text-text">Proof of Healing</h1>
                    <p className="text-gray-600">Visualize your journey to wellness.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                    <Plus size={18} /> Log Today's Vitals
                </Button>
            </div>

            {/* Input Form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Daily Check-in</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Activity size={16} className="text-red-500" /> Pain Level (1-10)
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={formData.painLevel}
                                    onChange={(e) => setFormData({ ...formData, painLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center font-bold text-primary">{formData.painLevel}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Utensils size={16} className="text-orange-500" /> Appetite (1-10)
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={formData.appetiteLevel}
                                    onChange={(e) => setFormData({ ...formData, appetiteLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center font-bold text-primary">{formData.appetiteLevel}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Moon size={16} className="text-blue-500" /> Sleep Quality (1-10)
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={formData.sleepQuality}
                                    onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center font-bold text-primary">{formData.sleepQuality}</div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Save Entry</Button>
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
