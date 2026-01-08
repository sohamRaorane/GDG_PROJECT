import { Link, useLocation } from "react-router-dom";
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

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

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
                                ? "bg-gradient-to-r from-[#0F766E] to-[#0ea5e9] text-white shadow-lg shadow-teal-500/20"
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

            <div className="border-t border-slate-700/50 p-4 bg-gradient-to-t from-slate-900/30 to-transparent">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/50 hover:text-white group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-all duration-200">
                        <Settings className="h-5 w-5" />
                    </div>
                    <span>Settings</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 mt-1 group border border-transparent hover:border-red-500/30">
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
