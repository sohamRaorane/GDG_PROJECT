
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHealthLogs, createHealthLog } from '../../services/db';
import type { DailyHealthLog } from '../../types/db';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Plus, Activity, Moon, Utensils, Heart, Brain, Coffee, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { SmartSlider } from '../../components/ui/SmartSlider';

export const Progress = () => {
    const { currentUser: user } = useAuth();
    const [logs, setLogs] = useState<DailyHealthLog[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
        setSubmitting(true);

        // Simulate a breath/pause for emotional UX
        await new Promise(resolve => setTimeout(resolve, 800));

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

        setSubmitting(false);
        setShowForm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
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
                <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 max-w-4xl mx-auto animate-in zoom-in-95 duration-500 ring-1 ring-slate-100">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-50 pb-6">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm">
                            <Heart size={28} className="fill-current" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Daily Dinacharya</h2>
                            <p className="text-slate-500 text-sm font-medium">Help us understand your health today.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 text-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <SmartSlider
                                type="pain"
                                label="Pain Level"
                                value={formData.painLevel}
                                onChange={(val) => setFormData({ ...formData, painLevel: val })}
                                icon={<Activity size={18} />}
                            />
                            <SmartSlider
                                type="appetite"
                                label="Appetite Level"
                                value={formData.appetiteLevel}
                                onChange={(val) => setFormData({ ...formData, appetiteLevel: val })}
                                icon={<Utensils size={18} />}
                            />
                            <SmartSlider
                                type="sleep"
                                label="Sleep Quality"
                                value={formData.sleepQuality}
                                onChange={(val) => setFormData({ ...formData, sleepQuality: val })}
                                icon={<Moon size={18} />}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                                    <Coffee size={18} className="text-amber-600" /> Digestion Quality
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Poor', 'Moderate', 'Excellent'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, digestionQuality: status as any })}
                                            className={`relative overflow-hidden py-3 px-2 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${formData.digestionQuality === status
                                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200 ring-2 ring-amber-100 ring-offset-2'
                                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:shadow-md'
                                                }`}
                                        >
                                            {status}
                                            {formData.digestionQuality === status && (
                                                <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {formData.digestionQuality === 'Poor' && (
                                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <Sparkles size={12} /> Consider warm meals & slower eating today.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                                    <Brain size={18} className="text-purple-600" /> Mental State
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Agitated', 'Calm', 'Lethargic'].map((state) => (
                                        <button
                                            key={state}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, mentalState: state as any })}
                                            className={`relative overflow-hidden py-3 px-2 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${formData.mentalState === state
                                                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200 ring-2 ring-purple-100 ring-offset-2'
                                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:shadow-md'
                                                }`}
                                        >
                                            {state}
                                            {formData.mentalState === state && (
                                                <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {['Agitated', 'Lethargic'].includes(formData.mentalState) && (
                                    <p className="text-xs text-purple-600 bg-purple-50 p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <Sparkles size={12} /> Try 5 mins of deep breathing or grounding exercises.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Optional Notes</label>
                            <div className="relative group">
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="• Bloating after lunch&#10;• Late sleep due to screen time&#10;• Feeling energetic after yoga"
                                    className="w-full p-5 rounded-3xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-36 text-slate-700 placeholder:text-slate-400 resize-none shadow-inner"
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-slate-300 font-medium bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formData.notes.length}/500
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-5 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 ${submitting ? 'bg-slate-800 scale-95 opacity-90' : 'bg-gradient-to-r from-emerald-800 to-teal-900 hover:shadow-2xl hover:scale-[1.01] hover:from-emerald-700 hover:to-teal-800'}`}
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Update My Healing Path <span className="text-xl">🌱</span>
                                    </span>
                                )}
                            </Button>
                            <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center gap-1.5 font-medium">
                                <ShieldCheck size={12} /> Your data is private & encrypted
                            </p>
                        </div>
                    </form>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700">
                        <div className="bg-emerald-500 rounded-full p-1">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="font-medium">Your body thanks you for checking in today!</span>
                    </div>
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
