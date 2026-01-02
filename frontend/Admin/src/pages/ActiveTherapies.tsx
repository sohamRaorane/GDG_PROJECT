
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust if needed
import { Link } from 'react-router-dom';
import { Users, Calendar, Activity, ArrowRight } from 'lucide-react';
import type { ActiveTherapy } from '../types/db';

const ActiveTherapies = () => {
    const [therapies, setTherapies] = useState<ActiveTherapy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTherapies = async () => {
            try {
                const q = query(
                    collection(db, 'active_therapies'),
                    where('status', '==', 'IN_PROGRESS')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as ActiveTherapy[];
                setTherapies(data);
            } catch (error) {
                console.error("Error fetching therapies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTherapies();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-serif text-slate-900 font-bold mb-2">Active Patients</h1>
                <p className="text-slate-500">Monitor and update progress for patients currently undergoing therapy.</p>
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
                            className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-teal-200 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                                    <Activity className="w-6 h-6 text-teal-600" />
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    {therapy.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">{therapy.therapyName}</h3>
                            {/* In a real app, join with users collection to get name, using ID for now */}
                            <p className="text-sm text-slate-500 mb-4">Patient ID: {therapy.patientId}</p>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>Day {therapy.currentDay} of {therapy.totalDays}</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                                <div
                                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(therapy.currentDay / therapy.totalDays) * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex items-center text-teal-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Manage Progress <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveTherapies;
