
import { useState } from 'react';
import { User, Calendar, History, Clock, MapPin, Phone, Mail, Camera, ChevronRight, Settings, CreditCard, LogOut, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useNavigate } from 'react-router-dom';

// Mock Data
const UPCOMING_APPOINTMENTS = [
    {
        id: '1',
        service: 'Shirodhara Therapy',
        doctor: 'Dr. Anjali Sharma',
        clinic: 'AyurSutra Wellness Center, Mumbai',
        date: 'March 15, 2024',
        time: '10:00 AM',
        duration: '60 mins',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d302427f?q=80&w=200&auto=format&fit=crop'
    }
];

const PAST_APPOINTMENTS = [
    {
        id: '2',
        service: 'Abhyanga Massage',
        doctor: 'Dr. John Doe',
        clinic: 'Prakriti Ayurvedic Care',
        date: 'Feb 10, 2024',
        time: '02:00 PM',
        status: 'Completed',
        rating: 5
    },
    {
        id: '3',
        service: 'Nasya Treatment',
        doctor: 'Dr. John Doe',
        clinic: 'Prakriti Ayurvedic Care',
        date: 'Jan 05, 2024',
        time: '11:00 AM',
        status: 'Completed',
        rating: 4
    }
];

export const Profile = () => {
    const { currentUser, logout } = useAuth();
    const { isPlaying, toggleAudio } = useAudio();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'upcoming' | 'history' | 'settings'>('upcoming');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // Helper to render section headers
    const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
        <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500">{subtitle}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-display font-bold text-slate-900">My Account</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Sidebar Navigation */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 sticky top-28">
                            {/* User Mini Profile */}
                            <div className="flex flex-col items-center text-center p-4 border-b border-slate-100 pb-6 mb-4">
                                <div className="w-20 h-20 rounded-full bg-slate-100 mb-3 overflow-hidden border-2 border-white shadow-md relative group cursor-pointer">
                                    <img
                                        src={currentUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">{currentUser?.displayName || 'Guest User'}</h3>
                                <p className="text-xs text-slate-500">{currentUser?.email || 'guest@example.com'}</p>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                <NavButton
                                    active={activeTab === 'upcoming'}
                                    onClick={() => setActiveTab('upcoming')}
                                    icon={<Calendar size={18} />}
                                    label="Appointments"
                                    badge={UPCOMING_APPOINTMENTS.length}
                                />
                                <NavButton
                                    active={activeTab === 'history'}
                                    onClick={() => setActiveTab('history')}
                                    icon={<History size={18} />}
                                    label="History"
                                />
                                <NavButton
                                    active={activeTab === 'details'}
                                    onClick={() => setActiveTab('details')}
                                    icon={<User size={18} />}
                                    label="Personal Details"
                                />
                            </nav>

                            <div className="mt-6 pt-6 border-t border-slate-100 px-2 space-y-1">
                                <button
                                    onClick={toggleAudio}
                                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                                >
                                    {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                    {isPlaying ? 'Mute Background Music' : 'Play Background Music'}
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-3",
                                        activeTab === 'settings' ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <Settings size={18} /> Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-9 space-y-6">

                        {activeTab === 'upcoming' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <SectionHeader title="Upcoming Appointments" subtitle="Manage your scheduled sessions" />

                                {UPCOMING_APPOINTMENTS.map(apt => (
                                    <div key={apt.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Date Box */}
                                            <div className="hidden md:flex flex-col items-center justify-center w-24 bg-primary/5 rounded-2xl border border-primary/10 p-4 shrink-0">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Mar</span>
                                                <span className="text-3xl font-display font-bold text-slate-800">15</span>
                                                <span className="text-xs font-medium text-slate-500">2024</span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide border border-green-200">
                                                                {apt.status}
                                                            </span>
                                                            <span className="text-xs text-slate-400 font-medium">• {apt.duration}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-800">{apt.service}</h3>
                                                        <p className="text-primary font-medium flex items-center gap-1.5 mt-1">
                                                            Dr. {apt.doctor.replace('Dr. ', '')}
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-2.5">
                                                        <Clock size={16} className="text-slate-400" />
                                                        {apt.time}
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <MapPin size={16} className="text-slate-400" />
                                                        <span className="truncate">{apt.clinic}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => alert("Appointment cancellation initiated. Our team will contact you.")}
                                                        className="text-red-600 border-slate-200 hover:bg-red-50 hover:border-red-200"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => navigate('/book')}
                                                        className="border-slate-200 hover:bg-slate-50"
                                                    >
                                                        Reschedule
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate(`/therapy/live/${apt.id}`)}
                                                        className="ml-auto shadow-lg shadow-primary/20"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {UPCOMING_APPOINTMENTS.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <Calendar size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">No appointments scheduled</h3>
                                        <p className="text-slate-500 mb-6">Book your next therapy session now.</p>
                                        <Button onClick={() => navigate('/book')}>Book Appointment</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <SectionHeader title="Past Appointments" subtitle="Your treatment history and records" />

                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    {PAST_APPOINTMENTS.map((apt, idx) => (
                                        <div key={apt.id} className={cn(
                                            "p-6 hover:bg-slate-50 transition-colors cursor-pointer group",
                                            idx !== PAST_APPOINTMENTS.length - 1 ? "border-b border-slate-100" : ""
                                        )}>
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {apt.date.split(' ')[0].substring(0, 3)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-slate-800 truncate">{apt.service}</h4>
                                                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full group-hover:bg-white transition-colors">
                                                            {apt.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mb-1">{apt.doctor} • {apt.date}</p>
                                                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                                        {'★'.repeat(apt.rating)}{'☆'.repeat(5 - apt.rating)} <span className="text-slate-400 ml-1">Rating</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <SectionHeader title="Personal Details" subtitle="Update your profile information" />

                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">

                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <User size={20} className="text-primary" /> Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                            <input type="text" defaultValue={currentUser?.displayName || "Aditya User"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                                <input type="email" defaultValue={currentUser?.email || "aditya@example.com"} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                                <input type="tel" defaultValue="+91 9876543210" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date of Birth</label>
                                            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <MapPin size={20} className="text-primary" /> Address Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Street Address</label>
                                            <input type="text" placeholder="123, Green Street, Mumbai" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={() => alert("Profile details updated successfully!")}
                                        className="px-8 py-6 rounded-xl text-lg shadow-xl shadow-primary/20"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <SectionHeader title="Account Settings" subtitle="Manage your preferences and security" />

                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Settings size={20} className="text-primary" /> Notification Preferences
                                    </h3>
                                    <div className="space-y-4">
                                        {['Email Notifications', 'SMS Reminders', 'Marketing Updates'].map((item) => (
                                            <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <span className="font-medium text-slate-700">{item}</span>
                                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <CreditCard size={20} className="text-primary" /> Payment Methods
                                    </h3>
                                    <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                                        <p className="text-slate-500 mb-4">No payment methods saved.</p>
                                        <Button variant="outline">Add New Card</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >
    );
};

const NavButton = ({ active, onClick, icon, label, badge }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-slate-600 hover:bg-slate-50"
        )}
    >
        <div className="flex items-center gap-3 relative z-10">
            <span className={cn("transition-colors", active ? "text-white" : "text-slate-400 group-hover:text-primary")}>
                {icon}
            </span>
            <span className="font-medium">{label}</span>
        </div>
        {badge && (
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold relative z-10",
                active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            )}>
                {badge}
            </span>
        )}
    </button>
);
