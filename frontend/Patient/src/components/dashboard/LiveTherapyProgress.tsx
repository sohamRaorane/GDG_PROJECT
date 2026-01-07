
import { useTherapyLive } from '../../hooks/useTherapyLive';
import { VitalsGraph } from './VitalsGraph';
import { RecoveryTimeline } from './RecoveryTimeline';
import { Activity, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface LiveTherapyProgressProps {
    therapyId: string;
}

export const LiveTherapyProgress = ({ therapyId }: LiveTherapyProgressProps) => {
    const { data: therapy, loading, error } = useTherapyLive(therapyId);

    // DEBUG: Function to seed data for testing
    const seedData = async () => {
        try {
            if (!therapyId) return;
            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../../firebase');

            await setDoc(doc(db, 'active_therapies', therapyId), {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-white/60 backdrop-blur-md rounded-3xl border border-white/50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-teal-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                    <p className="mt-4 text-slate-400 text-sm">Loading live progress...</p>
                </div>
            </div>
        );
    }

    if (error || !therapy) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 text-red-500">
                <div className="text-center p-6">
                    <h2 className="text-xl font-bold">Unable to load therapy</h2>
                    <p className="text-sm mt-2">{error || "Therapy plan not found."}</p>
                    <button
                        onClick={seedData}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
                    >
                        Debug: Create Test Data for ID "{therapyId}"
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Status Card */}
            <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-teal-200 text-sm font-medium uppercase tracking-wider">Current Phase</p>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${therapy.status === 'IN_PROGRESS' ? 'bg-green-400/20 text-green-300' : 'bg-gray-400/20 text-gray-300'}
                        `}>
                            {therapy.status.replace('_', ' ')}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                        Day {therapy.currentDay} <span className="text-teal-300 text-xl md:text-2xl font-normal">of {therapy.totalDays}</span>
                    </h2>

                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1 min-w-[120px]">
                            <Activity className="w-5 h-5 text-teal-300 mb-1" />
                            <div className="text-xs text-teal-200">Pain Level</div>
                            <div className="text-xl font-bold">
                                {therapy.logs[`day_${therapy.currentDay}`]?.painLevel ?? '--'}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1 min-w-[120px]">
                            <Clock className="w-5 h-5 text-teal-300 mb-1" />
                            <div className="text-xs text-teal-200">Next Session</div>
                            <div className="text-xl font-bold">09:00 AM</div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button variant="ghost" className="text-teal-100 hover:text-white hover:bg-white/10 p-0 h-auto">
                            View Full Details →
                        </Button>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
            </div>

            {/* Vitals Graph */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">Wellness Trends</h3>
                <VitalsGraph logs={therapy.logs} />
            </div>

            {/* Timeline */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">Healing Journey</h3>
                <RecoveryTimeline therapy={therapy} />
            </div>
        </div>
    );
};
