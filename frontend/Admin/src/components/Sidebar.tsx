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
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-admin-sidebar to-slate-950 text-white flex flex-col transition-all duration-300 shadow-2xl border-r border-slate-800/50">
            {/* Header with Gradient */}
            <div className="relative overflow-hidden border-b border-slate-700/30 px-6 py-5">
                <div className="absolute inset-0 bg-gradient-to-r from-admin-active/5 to-transparent"></div>
                <h1 className="relative text-xl font-bold tracking-wide text-white">
                    AyurSutra
                    <span className="text-admin-active ml-0.5 inline-block animate-pulse">.</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">Medical Portal</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive(item.path)
                                ? "bg-gradient-to-r from-admin-active to-admin-active/80 text-white shadow-lg shadow-admin-active/20"
                                : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                                }`}
                        >
                            {/* Active Indicator */}
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                            )}

                            {/* Icon */}
                            <div className={`p-1.5 rounded-lg transition-all ${isActive(item.path)
                                ? "bg-white/20"
                                : "group-hover:bg-slate-700/50"
                                }`}>
                                <item.icon className={`h-4 w-4 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-white"
                                    }`} />
                            </div>

                            {/* Label */}
                            <span className={isActive(item.path) ? "font-bold" : ""}>{item.name}</span>

                            {/* Active Glow */}
                            {isActive(item.path) && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-admin-active/0 via-admin-active/10 to-admin-active/0 animate-pulse"></div>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-700/30 p-4 space-y-2">
                <button className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-800/40 hover:text-white">
                    <div className="p-1.5 rounded-lg group-hover:bg-slate-700/50 transition-all">
                        <Settings className="h-4 w-4" />
                    </div>
                    Settings
                </button>
                <button className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-950/30 hover:text-red-300 border border-transparent hover:border-red-900/50">
                    <div className="p-1.5 rounded-lg group-hover:bg-red-900/20 transition-all">
                        <LogOut className="h-4 w-4" />
                    </div>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
