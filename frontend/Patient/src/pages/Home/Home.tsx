import { Button } from '../../components/ui/Button';
import { Calendar, PlayCircle, Info, Sparkles, CheckCircle2, ChevronRight, Lock, Stethoscope, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ayurvedaBg from '../../assets/ayurveda_bg.png';
import therapySession from '../../assets/therapy_session.png';
import { DailyTasks } from '../../components/DailyTasks';
import { WellnessScore } from '../../components/WellnessScore';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { RecoveryTimeline } from '../../components/dashboard/RecoveryTimeline';
import type { ActiveTherapy } from '../../types/db';

export const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTherapy, setActiveTherapy] = useState<ActiveTherapy | null>(null);

    useEffect(() => {
        const fetchActiveTherapy = async () => {
            if (currentUser) {
                try {
                    // Query for an active therapy for this user
                    // Note: Ideally this should be a real-time listener or robust query
                    const q = query(
                        collection(db, 'active_therapies'),
                        where('patientId', '==', currentUser.uid),
                        limit(1)
                    );
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                        const doc = snapshot.docs[0];
                        setActiveTherapy({ id: doc.id, ...doc.data() } as ActiveTherapy);
                    } else {
                        // Fallback/Mock for demo if no real therapy found, so the user sees the UI
                        // Remove this else block for production
                        setActiveTherapy({
                            id: 'demo_therapy',
                            patientId: currentUser.uid,
                            therapyName: 'Panchakarma Detox',
                            startDate: new Date().toISOString(),
                            totalDays: 21,
                            currentDay: 4,
                            status: 'IN_PROGRESS',
                            logs: {}
                        } as ActiveTherapy);
                    }
                } catch (error) {
                    console.error("Error fetching therapy:", error);
                }
            }
        };
        fetchActiveTherapy();
    }, [currentUser]);




    return (
        <div className="min-h-screen pb-12 relative overflow-hidden bg-background">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 h-full w-full">
                <img src={ayurvedaBg} alt="Background" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background/20 to-background/50 backdrop-blur-[1px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 pt-8 space-y-8">

                {/* Disease-Specific Flying Marquee (Top below Navbar) */}
                <div className="w-full max-w-[98%] mx-auto z-40 mb-2">
                    <div className="relative overflow-hidden rounded-full border border-white/40 shadow-xl bg-white/40 backdrop-blur-xl h-14 flex items-center group">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/40 to-transparent z-10 rounded-l-full"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/40 to-transparent z-10 rounded-r-full"></div>

                        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] items-center">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 pr-16 text-slate-900 font-display font-semibold transition-colors">
                                    <span className="flex items-center gap-2 text-base">
                                        <Info size={18} className="text-primary fill-primary/10" />
                                        Drink warm water throughout the day.
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-2"></span>
                                    <span className="flex items-center gap-2 text-base">
                                        <CheckCircle2 size={18} className="text-primary fill-primary/10" />
                                        Avoid heavy meals post-sunset.
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-2"></span>
                                    <span className="flex items-center gap-2 text-base">
                                        <Sparkles size={18} className="text-primary fill-primary/10" />
                                        Practice Pranayama for 15 mins.
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-2"></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-primary-dark backdrop-blur-sm border border-white/30 text-sm font-semibold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark">
                            Namaste, <span className="text-primary">{currentUser?.displayName?.split(' ')[0] || 'Guest'}</span>
                        </h1>
                        <p className="text-slate-800 text-lg max-w-xl leading-relaxed font-medium">
                            Your healing journey is on track. Let's make today count.
                        </p>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Main Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Wellness Score Banner */}
                        <WellnessScore
                            painLevel={3}
                            sleepQuality={8}
                            taskCompletion={90}
                            appointmentAdherence={100}
                        />

                        {/* Current Status Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                <Calendar size={200} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-5">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark text-sm font-bold animate-pulse">
                                        <PlayCircle size={16} /> Active Phase: Day 4
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Virechana Therapy</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Today is the main purification day. Ensure you have followed the preparatory diet guidelines.
                                            Your session is scheduled for <strong>10:00 AM</strong>.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button onClick={() => navigate('/progress')} className="rounded-xl px-6 py-6 shadow-lg shadow-primary/20">
                                            Start Daily Check-in
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/guidelines')}
                                            className="rounded-xl px-6 py-6 border-slate-200 bg-transparent hover:bg-slate-50"
                                        >
                                            View Guidelines
                                        </Button>
                                    </div>
                                </div>
                                <div className="w-full md:w-56 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10 flex-shrink-0 group-hover:-translate-y-1 transition-transform duration-500">
                                    <img src={therapySession} alt="Therapy Session" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>


                        {/* Healing Timeline (Replaced with Live Therapy Timeline) */}
                        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-lg">
                            <h3 className="text-xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                Your Recovery Journey
                            </h3>

                            {activeTherapy ? (
                                <RecoveryTimeline therapy={activeTherapy} />
                            ) : (
                                <div className="text-center py-10 text-slate-500">
                                    <p>No active therapy found.</p>
                                    <Button variant="ghost" onClick={() => navigate('/book')} className="mt-2 text-primary hover:bg-primary/10">Start a New Journey</Button>
                                </div>
                            )}
                        </div>

                    </div>


                    {/* Right Column: Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Last Visit Details (New Section) */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
                                <Stethoscope size={18} className="text-primary" />
                                Last Visit
                            </h3>

                            {/* Mock Data for now as live query requires complex index/setup - usually would be fetched */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Dr. Anjali Gupta</h4>
                                        <p className="text-xs text-slate-500 font-medium">Ayurvedic Physician</p>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Completed</span>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>Jan 5, 2024</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                        <p className="line-clamp-2 text-xs leading-relaxed">
                                            Prescribed Ashwagandha. Recommended warm water intake and light dinner.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/profile')}
                                    className="w-full mt-4 h-8 text-xs font-bold text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-primary/10"
                                >
                                    View Prescription
                                </Button>
                            </div>
                        </div>

                        {/* Dinacharya / Daily Routine Tracker */}
                        <DailyTasks />

                        {/* Upcoming Schedule */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Upcoming</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">14</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">Follow-up</p>
                                        <p className="text-xs text-slate-500 font-medium">Dr. Sharma • 4:00 PM</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent transition-all opacity-70">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">15</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">Dietary Plan</p>
                                        <p className="text-xs text-slate-500 font-medium">Unlocks in 2 days</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300">
                                        <Lock size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
};
