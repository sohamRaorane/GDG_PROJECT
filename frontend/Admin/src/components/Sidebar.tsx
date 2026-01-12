import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Activity,
    AlertTriangle
} from "lucide-react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged, type User } from "firebase/auth";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname === path;
    const [user, setUser] = useState<User | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setImgError(false); // Reset error when user changes
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return "AD";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Doctor Dashboard", path: "/doctor-dashboard", icon: AlertTriangle },
        { name: "Appointments & Services", path: "/appointments", icon: Calendar },
        { name: "Reports & Insights", path: "/reports", icon: BarChart3 },
        { name: "Active Therapies", path: "/active-therapies", icon: Activity },
        { name: "User Management", path: "/users", icon: Users },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0F172A] to-[#0a0f1a] text-white flex flex-col transition-all duration-300 shadow-xl border-r border-slate-800/50">
            <div className="flex flex-col h-16 items-start justify-center border-b border-slate-700/50 px-6 bg-gradient-to-r from-slate-900/50 to-transparent">
                <h1 className="text-xl font-bold tracking-wider text-white">AyurSutra<span className="text-[#0F766E]">.</span></h1>
                <p className="text-[10px] text-slate-400 tracking-wide">Medical Portal</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative ${isActive(item.path)
                                ? "bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white shadow-lg shadow-teal-500/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                }`}
                        >
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse" />
                            )}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isActive(item.path)
                                ? "bg-white/20"
                                : "bg-slate-800/50 group-hover:bg-slate-700/50"
                                }`}>
                                <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                            </div>
                            <span className="flex-1">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User Profile Mini Card */}
            <div className="border-t border-slate-700/50 p-4 bg-gradient-to-t from-slate-900/50 to-transparent">
                <div className="bg-gradient-to-br from-[#1C4E46]/20 to-[#0F766E]/10 rounded-xl p-3 mb-3 border border-[#1C4E46]/30">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            {user?.photoURL && !imgError ? (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0F766E]"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1C4E46] to-[#0F766E] flex items-center justify-center text-white font-bold text-sm border-2 border-[#1C4E46]">
                                    {getInitials(user?.displayName || user?.email || "Admin User")}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.displayName || "Admin User"}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email || "Super Admin"}</p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/settings"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group ${isActive('/settings')
                        ? 'bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white shadow-lg shadow-teal-500/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isActive('/settings')
                        ? 'bg-white/20'
                        : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                        }`}>
                        <Settings className="h-5 w-5" />
                    </div>
                    <span>Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 mt-1 group border border-transparent hover:border-red-500/30"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-200">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
