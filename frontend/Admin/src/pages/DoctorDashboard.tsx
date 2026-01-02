import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '../components/ui/Card';
import { AlertTriangle, User, Calendar, Phone, CheckCircle2, MessageSquare } from 'lucide-react';
import type { DailyHealthLog } from '../types/db';

const DoctorDashboard = () => {
    const [flaggedLogs, setFlaggedLogs] = useState<DailyHealthLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple query without orderBy to avoid composite index requirement
        const q = query(
            collection(db, 'health_logs'),
            where('isFlagged', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyHealthLog));
            // Sort client-side by createdAt
            const sortedLogs = logs.sort((a, b) => {
                const getTime = (val: any) => {
                    if (!val) return 0;
                    if (typeof val.toMillis === 'function') return val.toMillis();
                    if (val.seconds) return val.seconds * 1000;
                    if (val instanceof Date) return val.getTime();
                    return 0;
                };
                return getTime(b.createdAt) - getTime(a.createdAt);
            });
            setFlaggedLogs(sortedLogs);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error in DoctorDashboard:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAcknowledge = (id: string) => {
        // In a real app, update Firestore to mark as viewed/resolved
        console.log('Acknowledged flag:', id);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Red Flag Dashboard</h1>
                    <p className="text-slate-500 mt-2">Monitoring patients with high-priority health flags.</p>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" size={20} />
                    <span className="text-red-700 font-bold">{flaggedLogs.length} Active Alerts</span>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map(i => (
                        <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[32px]"></div>
                    ))}
                </div>
            ) : flaggedLogs.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">All Clear!</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2">
                        No patients have reported adverse symptoms or high pain levels today.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {flaggedLogs.map((log) => (
                        <Card
                            key={log.id}
                            className="relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-none bg-white p-0 rounded-[32px] shadow-xl"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Patient ID: {log.userId.slice(-6)}</h3>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                <Calendar size={12} />
                                                <span>Session Date: {log.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-red-100 text-red-600 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">Urgent</div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                                            <AlertTriangle size={12} className="text-red-500" /> Issue Reported
                                        </p>
                                        <p className="text-slate-800 font-medium leading-relaxed italic">"{log.flaggedReason || 'High pain level reported'}"</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pain Level</p>
                                            <p className="text-2xl font-black text-red-600 tracking-tighter">{log.painLevel}/10</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Digestion</p>
                                            <p className="text-lg font-bold text-slate-700">{log.digestionQuality || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm">
                                        <Phone size={16} /> Call Now
                                    </button>
                                    <button
                                        onClick={() => handleAcknowledge(log.id)}
                                        className="w-14 h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-all"
                                    >
                                        <CheckCircle2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Patient Feedback Loop Stats" description="Summary of patient check-ins.">
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-sm font-medium text-slate-600">Total Check-ins Today</span>
                            <span className="text-lg font-bold text-slate-800">42</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-sm font-medium text-slate-600">Completion Rate</span>
                            <span className="text-lg font-bold text-green-600">89%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-red-600">
                            <span className="text-sm font-bold">Unresolved Flags</span>
                            <span className="text-lg font-black">{flaggedLogs.length}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Quick Actions" description="Common tasks for flagged patients.">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <button className="p-6 bg-blue-50 text-blue-700 rounded-3xl font-bold flex flex-col items-center gap-3 hover:bg-blue-100 transition-colors">
                            <MessageSquare />
                            <span className="text-xs uppercase tracking-widest text-center">Broadcast Advisory</span>
                        </button>
                        <button className="p-6 bg-slate-50 text-slate-700 rounded-3xl font-bold flex flex-col items-center gap-3 hover:bg-slate-100 transition-colors">
                            <Calendar />
                            <span className="text-xs uppercase tracking-widest text-center">Reschedule Shifts</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DoctorDashboard;
