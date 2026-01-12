
import { useState, useEffect } from 'react';
import { User, Calendar, History, Clock, MapPin, Phone, Mail, Camera, Settings, LogOut, Music, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { getUserProfile, getServiceById } from '../../services/db';

export const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { isPlaying, toggleAudio } = useAudio();
    const [activeTab, setActiveTab] = useState<'appointments' | 'history' | 'details' | 'settings'>('appointments');

    // State for appointments
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [pastAppointments, setPastAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                // Fetch all appointments for the current user
                // Note: Indexing might be required for compound queries if we add orderBy('startAt')
                // For now, we'll fetch and sort client-side to avoid index requirement blocks
                const q = query(
                    collection(db, 'appointments'),
                    where('customerId', '==', currentUser.uid)
                );

                const snapshot = await getDocs(q);

                const appointments = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const startAtDate = data.startAt.toDate();

                    // Fetch Doctor Profile for name & image
                    let doctorName = 'AyurSutra Specialist';
                    let doctorImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor';
                    if (data.providerId) {
                        const docProfile = await getUserProfile(data.providerId);
                        if (docProfile) {
                            doctorName = docProfile.displayName;
                            doctorImage = docProfile.photoURL || doctorImage;
                        }
                    }

                    // Fetch Service Details for type & duration
                    let serviceType = 'Ayurvedic Therapy';
                    let duration = '60 mins';
                    if (data.serviceId) {
                        const service = await getServiceById(data.serviceId);
                        if (service) {
                            // serviceType = service.category || 'Ayurvedic Therapy'; // Assuming category exists or just default
                            duration = `${service.durationMinutes} mins`;
                        }
                    }

                    return {
                        id: doc.id,
                        service: data.serviceName || 'Healing Session',
                        type: serviceType,
                        doctor: doctorName,
                        doctorImage: doctorImage,
                        clinic: 'AyurSutra Wellness Center', // Default for now
                        location: 'Mumbai, India',
                        date: startAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        month: startAtDate.toLocaleDateString('en-US', { month: 'short' }),
                        day: startAtDate.getDate().toString(),
                        year: startAtDate.getFullYear().toString(),
                        time: startAtDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        duration: duration,
                        status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
                        statusColor: data.status === 'confirmed' ? 'bg-[#E3F2E1] text-[#2F5E3D]' : 'bg-gray-100 text-gray-600',
                        rawDate: startAtDate, // For sorting
                        rating: 0 // Placeholder
                    };
                }));

                // Sort: Recent first
                appointments.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

                const now = new Date();
                const upcoming = appointments.filter(apt => apt.rawDate >= now && apt.status !== 'Completed' && apt.status !== 'Cancelled');
                const past = appointments.filter(apt => apt.rawDate < now || apt.status === 'Completed');

                setUpcomingAppointments(upcoming);
                setPastAppointments(past);

            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };


    const HealingProgressWidget = () => (
        <div
            onClick={() => navigate('/progress')}
            className="bg-gradient-to-b from-[#2F5E3D] to-[#1A2E25] rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl group cursor-pointer transition-transform hover:scale-[1.02]"
        >
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Progress Circle */}
                <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="8"
                            strokeDasharray="283" strokeDashoffset="100"
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-display font-bold">65%</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-80">Healed</span>
                    </div>
                </div>

                <div className="flex-1 text-center space-y-1.5">
                    <div className="inline-block px-3 py-0.5 bg-white/10 rounded-full text-[10px] font-bold mb-1 border border-white/10">Phase: Restoration</div>
                    <h3 className="text-lg font-display font-bold leading-tight">Processing Well</h3>
                    <p className="text-white/80 text-xs px-2 leading-relaxed">4/6 sessions completed. Keep it up!</p>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden font-sans">

            {/* Live Nature Background */}
            <NatureBackground />

            {/* Floating Music Toggle - Aligned with Nav */}
            <div className="fixed top-6 right-8 z-[5001]">
                <button
                    onClick={toggleAudio}
                    className={cn(
                        "p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md border border-white/20",
                        isPlaying ? "bg-[#2F5E3D] text-white" : "bg-white/90 text-[#6B8577]"
                    )}
                >
                    {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
                    <span className={cn("text-xs font-bold uppercase tracking-wider overflow-hidden transition-all duration-300", isPlaying ? "w-auto max-w-xs ml-1" : "max-w-0 w-0")}>
                        {isPlaying ? "On" : "Off"}
                    </span>
                </button>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl relative z-10 pt-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Stacked Widgets */}
                    <aside className="lg:col-span-4 space-y-6 sticky top-28 h-fit">

                        {/* Healing Progress - Top Left */}
                        {activeTab === 'appointments' && <HealingProgressWidget />}
                        {/* Note: User wanted it 'top left'. Putting it here ensures it's in the hierarchy. I'll make it always visible or just for appointments tab as requested? 
                           "move that healing segment in top ledt corner". If I keep it here, it shows for all tabs? 
                           Actually, standard sidebar behavior is consistent. I will show it always if logic permits, or just standard.
                           Let's show it always in the sidebar above the profile card.
                        */}
                        {activeTab !== 'appointments' && <HealingProgressWidget />}

                        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(31,38,135,0.07)] border border-white/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(31,38,135,0.12)] group">

                            {/* User Profile */}
                            <div className="flex flex-col items-center text-center mb-8 pt-2">
                                <div className="relative cursor-pointer">
                                    <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr from-[#8FA893] to-[#C4D7C4] shadow-xl mb-4 group-hover:shadow-2xl transition-shadow duration-500">
                                        <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                                            <img
                                                src={currentUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md border border-slate-100 text-[#5F7C66] opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                                        <Camera size={16} />
                                    </div>
                                </div>
                                <h3 className="font-display font-bold text-[#1a2e25] text-xl tracking-tight">{currentUser?.displayName || 'Guest User'}</h3>
                                <p className="text-[#6B8577] font-medium tracking-wide mt-1 text-sm">{currentUser?.email || 'guest@example.com'}</p>
                            </div>

                            {/* Sidebar Menu */}
                            <nav className="space-y-2">
                                <SidebarItem
                                    active={activeTab === 'appointments'}
                                    onClick={() => setActiveTab('appointments')}
                                    icon={<Calendar size={20} />}
                                    label="My Wellness"
                                />
                                <SidebarItem
                                    active={activeTab === 'history'}
                                    onClick={() => setActiveTab('history')}
                                    icon={<History size={20} />}
                                    label="History"
                                />
                                <SidebarItem
                                    active={activeTab === 'details'}
                                    onClick={() => setActiveTab('details')}
                                    icon={<User size={20} />}
                                    label="Personal Details"
                                />
                                <SidebarItem
                                    active={activeTab === 'settings'}
                                    onClick={() => setActiveTab('settings')}
                                    icon={<Settings size={20} />}
                                    label="Settings"
                                />
                                <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#C4D7C4]/50 to-transparent" />
                                <SidebarItem
                                    onClick={handleLogout}
                                    icon={<LogOut size={20} />}
                                    label="Sign Out"
                                    variant="danger"
                                />
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-8">
                        <div className="min-h-[600px] relative">

                            {activeTab === 'appointments' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-10">

                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <PageHeader title="Upcoming Sessions" subtitle="Your journey continues" />
                                            <Button onClick={() => navigate('/book')} className="hidden md:flex bg-[#2F5E3D] hover:bg-[#1A2E25] text-white rounded-xl px-6 py-2.5 shadow-lg shadow-[#2F5E3D]/20">
                                                Book New
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8">
                                            {upcomingAppointments.map((apt, index) => (
                                                <div key={apt.id} className="animate-in slide-in-from-bottom-4 fade-in duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                                                    <AppointmentCard apt={apt} />
                                                </div>
                                            ))}
                                        </div>

                                        {upcomingAppointments.length === 0 && (
                                            <EmptyState
                                                icon={<Sparkles size={48} />}
                                                title="No upcoming sessions"
                                                description="Your schedule is clear. Take a moment to breathe, or book your next therapy."
                                                action={() => navigate('/book')}
                                                actionLabel="Book Appointment"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-6">
                                    <PageHeader title="Past Treatments" subtitle="A record of your healing path" />

                                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 overflow-hidden shadow-sm">
                                        {pastAppointments.length > 0 ? (
                                            pastAppointments.map((apt, idx) => (
                                                <div key={apt.id} className={cn(
                                                    "p-8 hover:bg-white/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 group",
                                                    idx !== pastAppointments.length - 1 ? "border-b border-white/30" : ""
                                                )}>
                                                    <div className="w-16 h-16 rounded-2xl bg-[#E8EEE9] text-[#2F5E3D] flex flex-col items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                        <span className="text-[10px] uppercase tracking-wider opacity-70">{apt.date.split(' ')[0]}</span>
                                                        <span className="text-xl font-display">{apt.date.split(' ')[1].replace(',', '')}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h4 className="text-xl font-bold text-[#1A2E25] font-display truncate pr-4">{apt.service}</h4>
                                                            <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-[#5F7C66] border border-white/50 shadow-sm">
                                                                {apt.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[#6B8577] text-sm mb-3">{apt.clinic} • {apt.doctor}</p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex text-amber-400 text-xs">
                                                                {'★'.repeat(apt.rating)}
                                                                {'☆'.repeat(5 - apt.rating)}
                                                            </div>
                                                            <button className="text-xs font-bold text-[#2F5E3D] underline opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Rate Experience
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end md:justify-start">
                                                        <Button variant="ghost" className="text-[#6B8577] hover:bg-[#E3F2E1] hover:text-[#2F5E3D] rounded-xl px-4">
                                                            Rebook
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center text-[#6B8577]">No past treatments found.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-8">
                                    <PageHeader title="Personal Details" subtitle="Manage your profile information" />

                                    <div className="grid grid-cols-1 gap-8"> {/* Full width details */}
                                        <div className="bg-white/50 backdrop-blur-lg rounded-[2.5rem] p-10 shadow-sm border border-white/60 hover:shadow-lg transition-shadow duration-500">
                                            <h3 className="text-xl font-bold text-[#1A2E25] flex items-center gap-3 mb-8">
                                                <div className="p-3 bg-[#E3F2E1] text-[#2F5E3D] rounded-2xl shadow-sm"><User size={22} /></div>
                                                Basic Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputGroup label="Full Name" defaultValue="Aditya User" />
                                                <InputGroup label="Email" defaultValue="aditya@example.com" type="email" icon={<Mail className="text-[#8FA893]" size={18} />} />
                                                <InputGroup label="Phone" defaultValue="+91 98765 43210" type="tel" icon={<Phone className="text-[#8FA893]" size={18} />} />
                                                <InputGroup label="Date of Birth" type="date" />
                                            </div>
                                        </div>

                                        <div className="bg-white/50 backdrop-blur-lg rounded-[2.5rem] p-10 shadow-sm border border-white/60 hover:shadow-lg transition-shadow duration-500">
                                            <h3 className="text-xl font-bold text-[#1A2E25] flex items-center gap-3 mb-8">
                                                <div className="p-3 bg-[#E3F2E1] text-[#2F5E3D] rounded-2xl shadow-sm"><MapPin size={22} /></div>
                                                Address Details
                                            </h3>
                                            <div className="space-y-6">
                                                <InputGroup label="Street Address" defaultValue="123, Wellness Ave, Bandra West" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup label="City" defaultValue="Mumbai" />
                                                    <InputGroup label="State" defaultValue="Maharashtra" />
                                                </div>
                                                <InputGroup label="Postal Code" defaultValue="400050" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sticky bottom-4 flex justify-end">
                                        <Button className="bg-[#2F5E3D] hover:bg-[#1A2E25] text-white rounded-2xl px-10 py-4 text-lg font-bold shadow-xl shadow-[#2F5E3D]/20 hover:scale-105 active:scale-95 transition-all">
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-6">
                                    <PageHeader title="Settings" subtitle="Preferences & Privacy" />

                                    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-sm space-y-2">
                                        <SettingToggle label="Email Notifications" description="Receive updates about your appointments" />
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                        <SettingToggle label="SMS Reminders" description="Get reminders 1 hour before sessions" />
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                        <SettingToggle label="Marketing Updates" description="Receive offers and wellness tips" />
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                        <SettingToggle label="Two-Factor Authentication" description="Secure your account" />
                                    </div>
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

// --- Sub Components ---



const NatureBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#F0F4F1]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D1E8D5] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#CDE0D0] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#D9EBE0] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob animation-delay-4000"></div>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
    </div>
);

const SidebarItem = ({ active, onClick, icon, label, variant = 'default' }: any) => {
    const isDanger = variant === 'danger';
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium text-[15px] group relative overflow-hidden",
                active
                    ? "bg-[#2F5E3D] text-white shadow-lg shadow-[#2F5E3D]/25 translate-x-1"
                    : isDanger
                        ? "text-red-500 hover:bg-red-50/50"
                        : "text-[#5F7C66] hover:bg-white/50 hover:text-[#2F5E3D] hover:shadow-sm"
            )}
        >
            <span className={cn("transition-transform duration-300 group-hover:scale-110", active ? "text-white" : isDanger ? "text-red-500" : "text-[#8FA893] group-hover:text-[#2F5E3D]")}>
                {icon}
            </span>
            <span className="relative z-10">{label}</span>
            {active && <div className="absolute right-4 w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>}
        </button>
    );
};

const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-2">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A2E25] tracking-tight">{title}</h2>
        <p className="text-[#6B8577] mt-2 text-lg">{subtitle}</p>
    </div>
);

const AppointmentCard = ({ apt }: { apt: any }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_50px_rgba(47,94,61,0.1)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-1">

        {/* Soft Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#F0F4F1]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            {/* Date Block */}
            <div className="hidden lg:flex flex-col items-center justify-center min-w-[120px] h-auto bg-[#F4F9F5] rounded-[2rem] border border-[#E3F2E1] text-[#2F5E3D] p-6 shadow-sm group-hover:bg-[#E3F2E1] transition-colors duration-500">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B8577] mb-1">{apt.month}</span>
                <span className="text-5xl font-display font-bold mb-1 leading-none">{apt.day}</span>
                <span className="text-xs font-bold opacity-60">{apt.year}</span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border border-transparent shadow-sm", apt.statusColor)}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            {apt.status}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1A2E25] group-hover:text-[#2F5E3D] transition-colors leading-tight">{apt.service}</h3>
                        <p className="text-[#6B8577] font-medium mt-1">{apt.type}</p>
                    </div>

                    {/* Doctor Badge */}
                    <div className="flex items-center gap-3 bg-white/60 pl-2 pr-4 py-2 rounded-full border border-white/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <img src={apt.doctorImage} alt={apt.doctor} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-bold text-[#8FA893]">Doctor</p>
                            <span className="text-sm font-bold text-[#2F5E3D] leading-none">{apt.doctor}</span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-[#F8FAF9] rounded-2xl border border-[#E3F2E1]/50 group-hover:bg-white transition-colors duration-300">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#2F5E3D]"><Clock size={20} /></div>
                        <div>
                            <p className="text-[10px] font-bold text-[#8FA893] uppercase tracking-wide">Time & Duration</p>
                            <p className="text-[#1A2E25] font-bold">{apt.time} <span className="text-[#6B8577] font-normal">• {apt.duration}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-[#F8FAF9] rounded-2xl border border-[#E3F2E1]/50 group-hover:bg-white transition-colors duration-300">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#2F5E3D]"><MapPin size={20} /></div>
                        <div>
                            <p className="text-[10px] font-bold text-[#8FA893] uppercase tracking-wide">Location</p>
                            <p className="text-[#1A2E25] font-bold truncate">{apt.clinic}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button className="flex-1 md:flex-none bg-[#2F5E3D] hover:bg-[#1A2E25] text-white rounded-xl px-8 py-3.5 text-sm font-bold tracking-wide shadow-lg shadow-[#2F5E3D]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        View Details
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none border-[#C4D7C4] text-[#2F5E3D] hover:bg-[#E3F2E1] rounded-xl px-6 py-3.5 text-sm font-bold bg-transparent">
                        Reschedule
                    </Button>
                    <button className="px-6 py-2 text-sm font-bold text-[#E57373] hover:text-red-600 transition-colors ml-auto md:ml-0 hover:underline decoration-2 underline-offset-4 decoration-red-200">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const InputGroup = ({ label, defaultValue, type = "text", icon }: any) => (
    <div className="space-y-2.5">
        <label className="text-xs font-bold text-[#6B8577] uppercase tracking-widest pl-1">{label}</label>
        <div className="relative group">
            {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-hover:text-[#2F5E3D] opacity-60">{icon}</div>}
            <input
                type={type}
                defaultValue={defaultValue}
                className={cn(
                    "w-full bg-[#F4F9F5]/50 border border-[#E3F2E1] rounded-2xl py-4 focus:outline-none focus:ring-4 focus:ring-[#2F5E3D]/10 focus:border-[#2F5E3D] transition-all font-semibold text-[#1A2E25] shadow-sm hover:bg-white/80",
                    icon ? "pl-12 pr-6" : "px-6"
                )}
            />
        </div>
    </div>
);

const SettingToggle = ({ label, description }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-white/60 rounded-2xl transition-all cursor-pointer group hover:shadow-sm">
        <div>
            <h4 className="font-bold text-[#1A2E25] group-hover:text-[#2F5E3D] transition-colors text-lg">{label}</h4>
            <p className="text-sm text-[#6B8577] mt-1 pr-4">{description}</p>
        </div>
        <div className="w-14 h-8 bg-[#E3F2E1] rounded-full relative transition-colors group-hover:bg-[#C4D7C4] cursor-pointer shadow-inner shrink-0">
            <div className="absolute top-1 left-1 bottom-1 w-6 bg-white rounded-full shadow-sm transition-transform duration-300 transform group-hover:translate-x-6"></div>
        </div>
    </div>
);

const EmptyState = ({ icon, title, description, action, actionLabel }: any) => (
    <div className="text-center py-24 bg-white/40 border-2 border-dashed border-[#C4D7C4] rounded-[3rem] animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#F0F4F1] rounded-full flex items-center justify-center mx-auto mb-6 text-[#8FA893] shadow-inner">
            {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-[#1A2E25] mb-3">{title}</h3>
        <p className="text-[#6B8577] mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
        {action && (
            <Button onClick={action} className="bg-[#2F5E3D] hover:bg-[#1A2E25] text-white rounded-2xl px-10 py-4 font-bold shadow-lg shadow-[#2F5E3D]/20 hover:scale-105 transition-transform">
                {actionLabel}
            </Button>
        )}
    </div>
);
