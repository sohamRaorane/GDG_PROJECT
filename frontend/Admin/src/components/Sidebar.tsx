import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Activity
} from "lucide-react";

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Appointments & Services", path: "/appointments", icon: Calendar },
        { name: "Reports & Insights", path: "/reports", icon: BarChart3 },
        { name: "Active Therapies", path: "/active-therapies", icon: Activity },
        { name: "User Management", path: "/users", icon: Users },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-dark-slate text-white flex flex-col transition-all duration-300">
            <div className="flex h-16 items-center border-b border-slate-700 px-6">
                <h1 className="text-xl font-bold tracking-wider text-surface-white">AyurSutra<span className="text-medical-blue">.</span></h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive(item.path)
                                ? "bg-medical-blue text-white shadow-md"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t border-slate-700 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                    <Settings className="h-5 w-5" />
                    Settings
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-slate-800 hover:text-red-300 mt-1">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
