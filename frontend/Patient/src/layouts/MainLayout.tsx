import { Outlet, Link } from 'react-router-dom';
import { User, Bell, X, CheckCircle, Info, AlertCircle, CheckCircle2, Home, Sparkles, Stethoscope, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToNotifications, markNotificationAsRead } from '../services/notification';
import { createHealthLog } from '../services/db';
import { Timestamp } from 'firebase/firestore';
import { MicroSurveyModal } from '../components/modals/MicroSurveyModal';
import { AIChatbot } from '../components/ai/AIChatbot';
import { Button } from '../components/ui/Button';
import type { Notification } from '../types/db';
import { format } from 'date-fns';
import { FloatingNav } from '../components/ui/floating-navbar';

export const MainLayout = () => {
    const { currentUser } = useAuth();
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [isSOSConfirmOpen, setIsSOSConfirmOpen] = useState(false);
    const [sosSubmitted, setSosSubmitted] = useState(false);

    // Mock trigger for survey: show after 2 seconds on first load for demo purposes
    useEffect(() => {
        const timer = setTimeout(() => {
            // In a real app, this would be triggered based on appointment cleanup/completion
            // setIsSurveyOpen(true); 
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSOS = async () => {
        if (!currentUser) return;

        setSosSubmitted(true);

        try {
            const date = format(new Date(), 'yyyy-MM-dd');
            await createHealthLog({
                userId: currentUser.uid,
                date,
                painLevel: 10, // Max pain for SOS
                appetiteLevel: 5,
                sleepQuality: 5,
                isFlagged: true,
                flaggedReason: "URGENT SOS ALERT: Patient triggered emergency assistance from the app.",
                userName: currentUser.displayName || 'Anonymous Patient',
                createdAt: Timestamp.now()
            });
            console.log("SOS Alert recorded in Firestore");
        } catch (error) {
            console.error("Error recording SOS Alert:", error);
        }

        setTimeout(() => {
            setSosSubmitted(false);
            setIsSOSConfirmOpen(false);
        }, 3000);
    };

    const navItems = [
        { name: 'Home', link: '/patient', icon: <Home className="w-4 h-4" /> },
        { name: 'Therapies', link: '/patient/services', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Doctors', link: '/patient/doctors', icon: <Stethoscope className="w-4 h-4" /> },
        { name: 'Community', link: '/patient/community', icon: <User className="w-4 h-4" /> },
        { name: 'Clinics', link: '/patient/clinics', icon: <MapPin className="w-4 h-4" /> }
    ];

    const Actions = () => (
        <div className="flex items-center gap-2">
            <NotificationBell />
            <Link to="/patient/profile">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text/80 hover:text-primary active:scale-95">
                    <User size={20} />
                </button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <FloatingNav navItems={navItems} actions={<Actions />} />

            <main className="flex-1 relative pt-24">
                <Outlet />

                {/* Global SOS Button */}
                <div className="fixed bottom-8 left-8 z-40">
                    <button
                        onClick={() => setIsSOSConfirmOpen(true)}
                        className="group relative flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                        <div className="relative bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95 flex items-center gap-2">
                            <AlertCircle size={24} />
                            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold">SOS</span>
                        </div>
                    </button>
                </div>

                {/* SOS Confirmation Overlay */}
                {isSOSConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                            {!sosSubmitted ? (
                                <div className="space-y-6 text-center">
                                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                        <AlertCircle size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-800">Need Immediate Help?</h2>
                                        <p className="text-slate-500">Pressing this will instantly alert Dr. Sharma and our emergency nursing staff.</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button onClick={handleSOS} className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg rounded-2xl">
                                            Yes, Alert Doctor
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsSOSConfirmOpen(false)} className="w-full py-6 rounded-2xl border-slate-200">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-800">Help is on the way!</h2>
                                        <p className="text-slate-500">Dr. Sharma has been notified. A nurse will call you in less than 5 minutes.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-gray-100 bg-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 AyurSutra. All rights reserved.</p>
                </div>
            </footer>

            <MicroSurveyModal
                isOpen={isSurveyOpen}
                onClose={() => setIsSurveyOpen(false)}
                onSubmit={(data) => console.log('Survey submitted:', data)}
                therapyName="Shirodhara"
            />
            <AIChatbot />
        </div>
    );
};

const NotificationBell = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToNotifications(currentUser.uid, (newNotifications) => {
            setNotifications(newNotifications);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
    };

    return (
        <div className="relative text-black">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={`p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'pre' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {notification.type === 'pre' ? <Info size={16} /> : <CheckCircle size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{notification.title}</p>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-3 leading-relaxed">{notification.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-2">
                                                    {notification.createdAt.toDate().toLocaleDateString()} at {notification.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0"></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
