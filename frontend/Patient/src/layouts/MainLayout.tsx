import { Outlet, Link } from 'react-router-dom';
import { User, Menu, Bell, X, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToNotifications, markNotificationAsRead } from '../services/notification';
import type { Notification } from '../types/db';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="text-xl font-bold text-primary font-display">AyurSutra</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-text hover:text-primary transition-colors">Home</Link>
                        <Link to="/services" className="text-sm font-medium text-text hover:text-primary transition-colors">Therapies</Link>
                        <Link to="/doctors" className="text-sm font-medium text-text hover:text-primary transition-colors">Doctors</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Link to="/profile">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text">
                                <User size={20} />
                            </button>
                        </Link>
                        <button className="md:hidden p-2 text-text">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-gray-100 bg-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 AyurSutra. All rights reserved.</p>
                </div>
            </footer>
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
        <div className="relative">
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
