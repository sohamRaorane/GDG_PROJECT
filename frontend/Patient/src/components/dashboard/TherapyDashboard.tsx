
import { useParams } from 'react-router-dom';
import { useTherapyLive } from '../../hooks/useTherapyLive';
import { VitalsGraph } from './VitalsGraph';
import { RecoveryTimeline } from './RecoveryTimeline';
import { Calendar, Activity, Clock } from 'lucide-react';

export const TherapyDashboard = () => {
    const { id } = useParams<{ id: string }>();
    const { data: therapy, loading, error } = useTherapyLive(id || '');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-teal-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                    <p className="mt-4 text-slate-400 text-sm">Connecting to live therapy stream...</p>
                </div>
            </div>
        );
    }

    // DEBUG: Function to seed data for testing
    const seedData = async () => {
        try {
            if (!id) return;
            // Dynamic import to avoid bundling seed logic in prod if we wanted to be strict, 
            // but for this prototype direct usage is fine.
            const { doc, setDoc, Timestamp } = await import('firebase/firestore');
            const { db } = await import('../../firebase'); // Ensure this path is correct relative to this file

            await setDoc(doc(db, 'active_therapies', id), {
                patientId: 'user_123',
                therapyName: 'Panchakarma Detox',
                startDate: new Date().toISOString().split('T')[0],
                totalDays: 7,
                status: 'IN_PROGRESS',
                currentDay: 3,
                logs: {
                    day_1: { painLevel: 8, status: 'Done', notes: 'Heavy headache, cleared by evening.' },
                    day_2: { painLevel: 6, status: 'Done', notes: 'Better sleep.' },
                    day_3: { painLevel: 5, status: 'In_Progress', notes: 'Nausea during treatment.' }
                }
            });
            alert('Data seeded! You should see the graphs update instantly.');
        } catch (e) {
            console.error(e);
            alert('Error seeding data. Check console.');
        }
    };

    if (error || !therapy) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 text-red-500">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Unable to load therapy</h2>
                    <p className="text-sm mt-2">{error || "Therapy plan not found."}</p>
                    {/* DEBUG BUTTON FOR EMPTY STATE */}
                    <button
                        onClick={seedData}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
                    >
                        Debug: Create Test Data for ID "{id}"
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-serif text-teal-900 font-bold">{therapy.therapyName}</h1>
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                            <Calendar size={14} /> Started {therapy.startDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${therapy.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                        `}>
                            {therapy.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">

                {/* Status Card */}
                <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-teal-200 text-sm font-medium uppercase tracking-wider mb-1">Current Phase</p>
                        <h2 className="text-4xl font-bold mb-4">Day {therapy.currentDay} <span className="text-teal-300 text-2xl font-normal">of {therapy.totalDays}</span></h2>

                        <div className="flex gap-6 mt-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                <Activity className="w-5 h-5 text-teal-300 mb-1" />
                                <div className="text-xs text-teal-200">Pain Level</div>
                                <div className="text-xl font-bold">
                                    {therapy.logs[`day_${therapy.currentDay}`]?.painLevel ?? '--'}
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                <Clock className="w-5 h-5 text-teal-300 mb-1" />
                                <div className="text-xs text-teal-200">Next Session</div>
                                <div className="text-xl font-bold">09:00 AM</div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                </div>

                {/* Vitals Graph */}
                <section>
                    <VitalsGraph logs={therapy.logs} />
                </section>

                {/* Timeline */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Healing Journey</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                        <RecoveryTimeline therapy={therapy} />
                    </div>
                </section>


            </main>
        </div>
    );
};
