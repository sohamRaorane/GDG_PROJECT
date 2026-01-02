import { Button } from '../../components/ui/Button';
import { Calendar, CheckCircle, Lock, PlayCircle, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ayurvedaBg from '../../assets/ayurveda_bg.png';
import therapySession from '../../assets/therapy_session.png';
import { DailyTasks } from '../../components/DailyTasks';

export const Home = () => {
    const navigate = useNavigate();

    // Mock Data for Timeline
    const steps = [
        { id: 1, title: 'Preparation', subtitle: 'Ghee Intake', status: 'completed', day: 'Day 1-3' },
        { id: 2, title: 'Main Therapy', subtitle: 'Virechana', status: 'active', day: 'Day 4 (Today)' },
        { id: 3, title: 'Recovery', subtitle: 'Paschatkarma', status: 'locked', day: 'Day 5-10' },
    ];

    return (
        <div className="min-h-screen pb-12 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={ayurvedaBg} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 pt-8 space-y-8">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-dark">
                            Namaste, Aditya
                        </h1>
                        <p className="text-text/80 text-lg">Your healing journey continues today.</p>
                    </div>
                    <Button onClick={() => navigate('/book')} className="w-fit shadow-lg shadow-primary/20">
                        Book Consultation
                    </Button>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Section: Timeline & Status (Span 2 cols) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Current Status Card */}
                        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar size={120} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-dark text-sm font-semibold animate-pulse">
                                        <PlayCircle size={16} /> Active Phase: Day 4
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-text">Virechana Therapy</h2>
                                    <p className="text-gray-700">
                                        Today is the main purification day. Ensure you have followed the preparatory diet guidelines.
                                        Your session is scheduled for <strong>10:00 AM</strong>.
                                    </p>
                                    <div className="flex gap-3 pt-2">
                                        <Button onClick={() => navigate('/progress')}>Start Daily Check-in</Button>
                                        <Button variant="outline" className="bg-white/50 hover:bg-white/80">View Guidelines</Button>
                                    </div>
                                </div>
                                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                                    <img src={therapySession} alt="Therapy Session" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>

                        {/* Healing Timeline */}
                        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-lg">
                            <h3 className="text-xl font-display font-bold text-text mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                The Healing Timeline
                            </h3>

                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-300 md:hidden"></div> {/* Vertical for Mobile */}
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 hidden md:block -translate-y-1/2"></div> {/* Horizontal for Desktop */}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
                                    {steps.map((step, index) => {
                                        const isCompleted = step.status === 'completed';
                                        const isActive = step.status === 'active';

                                        return (
                                            <div key={step.id} className={`relative flex md:flex-col items-center gap-4 md:text-center p-4 rounded-xl transition-all ${isActive ? 'bg-white/80 shadow-md transform scale-105 z-10' : 'opacity-80'}`}>

                                                {/* Node Circle */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 
                                                    ${isCompleted ? 'bg-primary border-primary text-white' : ''}
                                                    ${isActive ? 'bg-white border-primary text-primary animate-bounce-slow shadow-[0_0_0_4px_rgba(74,124,89,0.2)]' : ''}
                                                    ${step.status === 'locked' ? 'bg-gray-200 border-gray-300 text-gray-400' : ''}
                                                `}>
                                                    {isCompleted && <CheckCircle size={16} />}
                                                    {isActive && <div className="w-3 h-3 bg-primary rounded-full" />}
                                                    {step.status === 'locked' && <Lock size={14} />}
                                                </div>

                                                <div className="md:pt-4">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{step.day}</div>
                                                    <h4 className={`font-display font-bold text-lg ${isActive ? 'text-primary-dark' : 'text-text'}`}>{step.title}</h4>
                                                    <p className="text-sm text-gray-600">{step.subtitle}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar: Quick Actions & Education (Span 1 col) */}
                    <div className="space-y-6">

                        {/* Dinacharya / Daily Routine Tracker */}
                        <DailyTasks />

                        {/* Daily Tips Widget */}
                        <div className="bg-[#E8DCCA]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A373]/30 shadow-lg">
                            <h3 className="text-lg font-bold text-[#5C4033] mb-4 flex items-center gap-2">
                                <Info size={18} /> Daily Veda Tip
                            </h3>
                            <p className="text-[#5C4033]/90 italic font-medium">
                                "Drink warm water throughout the day to aid digestion during the Virechana phase."
                            </p>
                        </div>

                        {/* Recent Activity / Next Steps */}
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg">
                            <h3 className="text-lg font-bold text-text mb-4">Upcoming Schedule</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">14</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-text">Follow-up Consultation</p>
                                        <p className="text-xs text-gray-500">Dr. Sharma • 4:00 PM</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">15</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-text">Dietary Recovery Plan</p>
                                        <p className="text-xs text-gray-500">Unlocks in 2 days</p>
                                    </div>
                                    <Lock size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
