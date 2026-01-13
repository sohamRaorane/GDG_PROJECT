import { Button } from '../../components/ui/Button';
import { Calendar, PlayCircle, Info, Sparkles, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';
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
import { format } from 'date-fns';
import type { ActiveTherapy, DailyHealthLog, DailyTask, Appointment } from '../../types/db';

import { getDoctorName } from '../../utils/doctors';
import { motion, AnimatePresence } from 'framer-motion';
import namasteLady from '../../assets/namaste_lady.png';
import { PrescriptionModal, type PrescriptionData } from '../../components/dashboard/PrescriptionModal';

const mockPrescription: PrescriptionData = {
    doctorName: "Anjali Gupta",
    doctorSpecialization: "Ayurvedic Physician",
    date: "Jan 5, 2024",
    diagnosis: "Vata Dosha Imbalance & Mild Insomnia",
    medicines: [
        {
            id: 'm1',
            name: 'Ashwagandha Churna',
            dosage: '1 tsp with warm milk',
            frequency: '1-0-1',
            timing: 'After Food',
            duration: '15 Days',
            type: 'Powder'
        },
        {
            id: 'm2',
            name: 'Brahmi Vati',
            dosage: '1 Tablet',
            frequency: '0-0-1',
            timing: 'After Food',
            duration: '15 Days',
            type: 'Tablet'
        },
        {
            id: 'm3',
            name: 'Triphala Churna',
            dosage: '1/2 tsp with warm water',
            frequency: '0-0-1',
            timing: 'Before Food',
            duration: '30 Days',
            type: 'Powder'
        }
    ],
    advice: [
        "Drink at least 3-4 liters of warm water daily.",
        "Practice Anuloz-Vilom Pranayama for 15 mins every morning.",
        "Avoid caffeine and spicy foods after sunset.",
        "Maintain a regular sleep schedule (10 PM - 6 AM)."
    ],
    followUpDate: "Jan 19, 2024"
};

export const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTherapy, setActiveTherapy] = useState<ActiveTherapy | null>(null);
    // Check localStorage immediately to prevent animation flash on tab switches
    const [introComplete, setIntroComplete] = useState(() => {
        return localStorage.getItem('hasSeenNamasteIntro') === 'true';
    });
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    // Real Data State
    const [todayLog, setTodayLog] = useState<DailyHealthLog | null>(null);
    const [todayTasks, setTodayTasks] = useState<DailyTask[]>([]);
    const [lastVisit, setLastVisit] = useState<Appointment | null>(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        // Check if the intro has been shown before
        const hasSeenIntro = localStorage.getItem('hasSeenNamasteIntro');

        if (hasSeenIntro === 'true') {
            // Skip the animation if already seen
            setIntroComplete(true);
        } else {
            // Show the animation and mark as seen
            const timer = setTimeout(() => {
                setIntroComplete(true);
                localStorage.setItem('hasSeenNamasteIntro', 'true');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                try {
                    const today = format(new Date(), 'yyyy-MM-dd');

                    // 1. Fetch Active Therapy
                    const q_active = query(
                        collection(db, 'active_therapies'),
                        where('patientId', '==', currentUser.uid),
                        where('status', '==', 'IN_PROGRESS'),
                        limit(1)
                    );
                    let snapshot = await getDocs(q_active);
                    if (snapshot.empty) {
                        const q_any = query(
                            collection(db, 'active_therapies'),
                            where('patientId', '==', currentUser.uid),
                            limit(1)
                        );
                        snapshot = await getDocs(q_any);
                    }
                    if (!snapshot.empty) {
                        const doc = snapshot.docs[0];
                        setActiveTherapy({ id: doc.id, ...doc.data() } as ActiveTherapy);
                    } else {
                        setActiveTherapy(null);
                    }

                    // 2. Fetch Today's Health Log
                    const q_log = query(
                        collection(db, 'health_logs'),
                        where('userId', '==', currentUser.uid),
                        where('date', '==', today),
                        limit(1)
                    );
                    const logSnapshot = await getDocs(q_log);
                    if (!logSnapshot.empty) {
                        setTodayLog(logSnapshot.docs[0].data() as DailyHealthLog);
                    } else {
                        setTodayLog(null);
                    }

                    // 3. Fetch Today's Tasks
                    const q_tasks = query(
                        collection(db, 'daily_tasks'),
                        where('userId', '==', currentUser.uid),
                        where('date', '==', today)
                    );
                    const taskSnapshot = await getDocs(q_tasks);
                    const tasks = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyTask));
                    setTodayTasks(tasks);

                    // 4. Fetch Appointments (Last Visit & Upcoming)
                    const q_appointments = query(
                        collection(db, 'appointments'),
                        where('customerId', '==', currentUser.uid)
                    );
                    const appSnapshot = await getDocs(q_appointments);
                    const appointments = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));

                    // Filter for Last Visit (completed or past)
                    const completedApps = appointments
                        .filter(app => app.status === 'completed' || app.endAt.toDate() < new Date())
                        .sort((a, b) => b.startAt.toDate().getTime() - a.startAt.toDate().getTime());

                    if (completedApps.length > 0) {
                        setLastVisit(completedApps[0]);
                    } else {
                        setLastVisit(null);
                    }

                    // Filter for Upcoming (future)
                    const upcomingApps = appointments
                        .filter(app => app.status !== 'cancelled' && app.status !== 'completed' && app.startAt.toDate() > new Date())
                        .sort((a, b) => a.startAt.toDate().getTime() - b.startAt.toDate().getTime())
                        .slice(0, 3); // Limit to 3 upcoming

                    setUpcomingAppointments(upcomingApps);

                } catch (error) {
                    console.error("Error fetching home data:", error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    // Calculate Task Completion
    const taskCompletion = todayTasks.length > 0
        ? Math.round((todayTasks.filter(t => t.isCompleted).length / todayTasks.length) * 100)
        : 0;




    return (
        <div className="min-h-screen pb-12 relative overflow-hidden bg-background">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 h-full w-full">
                <img src={ayurvedaBg} alt="Background" className="w-full h-full object-cover opacity-60" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background/20 to-background/50"
                    animate={{ backdropFilter: introComplete ? "blur(1px)" : "blur(8px)" }}
                    transition={{ duration: 1 }}
                ></motion.div>
            </div>

            {/* Intro Animation Layer */}
            <AnimatePresence>
                {!introComplete && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    >
                        <motion.img
                            layoutId="namaste-lady"
                            src={namasteLady}
                            alt="Namaste"
                            className="w-[180vh] h-auto object-contain drop-shadow-2xl translate-y-24"
                            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

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
                <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 min-h-[160px]">
                    <div className="relative z-10 space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-primary-dark backdrop-blur-sm border border-white/30 text-sm font-semibold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark">
                            Namaste, <span className="text-primary">{currentUser?.displayName?.split(' ')[0] || 'Guest'}</span>
                        </h1>
                        <p className="text-slate-800 text-lg leading-relaxed font-medium">
                            Your healing journey is on track. Let's make today count.
                        </p>
                    </div>

                    {/* Final Position for Namaste Lady */}
                    {introComplete && (
                        <div className="absolute right-0 bottom-0 z-0 pointer-events-none hidden md:block">
                            <motion.img
                                layoutId="namaste-lady"
                                src={namasteLady}
                                alt="Namaste"
                                className="w-auto h-[300px] object-contain drop-shadow-xl translate-y-12 translate-x-12"
                                transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                            />
                        </div>
                    )}
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Main Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Wellness Score Banner */}
                        <WellnessScore
                            painLevel={todayLog?.painLevel || 0}
                            sleepQuality={todayLog?.sleepQuality || 0}
                            taskCompletion={taskCompletion}
                            appointmentAdherence={100}
                        />

                        {/* Current Status Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                <Calendar size={200} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-5">
                                    {activeTherapy ? (
                                        <>
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark text-sm font-bold animate-pulse">
                                                <PlayCircle size={16} /> Active Phase: Day {activeTherapy.currentDay}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">{activeTherapy.therapyName}</h2>
                                                <p className="text-slate-600 leading-relaxed">
                                                    {activeTherapy.timeline?.find(t => t.day === activeTherapy.currentDay)?.description || "Follow your daily prescribed guidelines for optimal results."}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">
                                                <PlayCircle size={16} /> Not Started
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Start Your Journey</h2>
                                                <p className="text-slate-600 leading-relaxed">
                                                    Book a consultation to get a personalized Ayurvedic therapy plan designed just for you.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex gap-3 pt-2">
                                        <Button onClick={() => navigate('/patient/progress')} className="rounded-xl px-6 py-6 shadow-lg shadow-primary/20">
                                            Start Daily Check-in
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/patient/guidelines')}
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

                        {/* Last Visit Details */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
                                <Stethoscope size={18} className="text-primary" />
                                Last Visit
                            </h3>

                            {/* Dynamic Data */}
                            {lastVisit ? (
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{getDoctorName(lastVisit.providerId)}</h4>
                                            <p className="text-xs text-slate-500 font-medium">Ayurvedic Physician</p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg capitalize">{lastVisit.status === 'confirmed' ? 'Completed' : lastVisit.status}</span>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span>{lastVisit.startAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-sm text-slate-600">
                                            <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                            <p className="line-clamp-2 text-xs leading-relaxed">
                                                {lastVisit.serviceName} session. {lastVisit.notes || 'Follow prescribed guidelines.'}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsPrescriptionOpen(true)}
                                        className="w-full mt-4 h-8 text-xs font-bold text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-primary/10"
                                    >
                                        View Prescription
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm">No past visits recorded.</p>
                                    <Button variant="ghost" onClick={() => navigate('/book')} className="text-xs text-primary mt-1 h-auto p-0 hover:bg-transparent hover:underline">Book Appointment</Button>
                                </div>
                            )}

                        </div>



                        {/* Dinacharya / Daily Routine Tracker */}
                        <DailyTasks />

                        {/* Upcoming Schedule */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Upcoming</h3>
                            <div className="space-y-3">
                                {upcomingAppointments.length > 0 ? (
                                    upcomingAppointments.map((apt) => (
                                        <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                {apt.startAt.toDate().getDate()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{apt.serviceName}</p>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {getDoctorName(apt.providerId)} • {apt.startAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-500 mb-2">No upcoming sessions.</p>
                                        <Button variant="ghost" onClick={() => navigate('/book')} className="text-xs text-primary h-auto p-0 hover:bg-transparent hover:underline">Book Now</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <PrescriptionModal
                isOpen={isPrescriptionOpen}
                onClose={() => setIsPrescriptionOpen(false)}
                data={mockPrescription}
            />
        </div>
    );
};
