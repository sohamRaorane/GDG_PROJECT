
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust if needed
import { Link } from 'react-router-dom';
import { Users, Calendar, Activity, ArrowRight } from 'lucide-react';
import type { ActiveTherapy } from '../types/db';

const ActiveTherapies = () => {
    const [therapies, setTherapies] = useState<ActiveTherapy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'active_therapies'),
            where('status', '==', 'IN_PROGRESS')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ActiveTherapy[];

            // Filter out test/dummy data
            const DUMMY_NAMES = ['kITKAT', 'Dental Care', 'Tennis Court', 'Abhyanga Snan', 'Abhyanga Therapy', 'Full Panchakarma Detox'];
            const filteredData = data.filter(t =>
                !t.therapyName.toLowerCase().includes('test') &&
                !t.therapyName.toLowerCase().includes('demo') &&
                !t.therapyName.toLowerCase().includes('dummy') &&
                !DUMMY_NAMES.includes(t.therapyName)
            );

            setTherapies(filteredData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching therapies:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-admin-sidebar mb-2">Active Patients</h1>
                <p className="text-admin-muted">Monitor and update progress for patients currently undergoing therapy.</p>
            </header>

            {therapies.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No active therapies</h3>
                    <p className="text-slate-500">Scheduled therapies will appear here once started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {therapies.map((therapy) => (
                        <Link
                            key={therapy.id}
                            to={`/active-therapies/${therapy.id}`}
                            className="group relative bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-6 hover:shadow-2xl hover:border-teal-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            {/* Gradient Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>

                            {/* Subtle Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50/50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl group-hover:from-teal-100 group-hover:to-emerald-100 transition-all shadow-sm">
                                        <Activity className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                                        {therapy.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-admin-sidebar mb-1.5 group-hover:text-admin-active transition-colors">{therapy.therapyName}</h3>
                                <p className="text-sm text-admin-muted mb-5">Patient ID: {therapy.patientId}</p>

                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-5 bg-slate-50 rounded-lg px-3 py-2">
                                    <Calendar className="w-4 h-4 text-teal-500" />
                                    <span className="font-medium">Day {therapy.currentDay} of {therapy.totalDays}</span>
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Progress</span>
                                        <span className="text-xs font-bold text-teal-600">{Math.round((therapy.currentDay / therapy.totalDays) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-lg"
                                            style={{ width: `${(therapy.currentDay / therapy.totalDays) * 100}%` }}
                                        >
                                            <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center text-teal-600 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                    Manage Progress <ArrowRight className="w-4 h-4 ml-1.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveTherapies;
