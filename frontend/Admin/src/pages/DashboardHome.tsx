import {
    Users,
    Calendar,
    UserCheck,
    DollarSign,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserPlus,
    CalendarCheck,
    Stethoscope,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const DashboardHome = () => {
    const [stats, setStats] = useState([
        {
            title: "Total Users",
            value: "0",
            icon: Users,
            change: "0%",
            trend: "up",
            iconBg: "bg-teal-50",
            iconColor: "text-teal-600",
            subtitle: "from last month"
        },
        {
            title: "Service Providers",
            value: "0",
            icon: UserCheck,
            change: "0%",
            trend: "up",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            subtitle: "from last month"
        },
        {
            title: "Total Appointments",
            value: "0",
            icon: Calendar,
            change: "0%",
            trend: "up",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            subtitle: "from last month"
        },
        {
            title: "Revenue",
            value: "₹0",
            icon: DollarSign,
            change: "0%",
            trend: "up",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            subtitle: "from last month",
            hasSparkline: true
        },
    ]);

    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number; appointments: number; patients: number }[]>([]);
    const [sparklineData, setSparklineData] = useState<{ value: number }[]>([]);
    const [providerData, setProviderData] = useState<{ name: string; patients: number; rating: number }[]>([]);
    const [recentActivity, setRecentActivity] = useState<{
        id: string;
        type: string;
        title: string;
        description: string;
        time: string;
        avatar: string;
        color: string;
    }[]>([]);
    const [activeTherapyCount, setActiveTherapyCount] = useState(0);

    useEffect(() => {
        // 1. Users Listener
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const allUsers = snapshot.docs.map(doc => doc.data());
            const totalUsers = snapshot.size;
            const providers = allUsers.filter((u: any) => u.role === 'organiser' || u.role === 'doctor').length;

            setStats(prev => prev.map(s => {
                if (s.title === "Total Users") return { ...s, value: totalUsers.toString() };
                if (s.title === "Service Providers") return { ...s, value: providers.toString() };
                return s;
            }));

            // Calculate Provider Rankings
            const providersList = allUsers.filter((u: any) => u.role === 'doctor');
            setProviderData(providersList.map((p: any) => ({
                name: p.displayName || 'Doctor',
                patients: Math.floor(Math.random() * 20) + 5, // Mocking patient count for now
                rating: 4.5 + Math.random() * 0.5
            })));
        });

        // 2. Appointments Listener
        const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
            const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            setStats(prev => prev.map(s => {
                if (s.title === "Total Appointments") return { ...s, value: snapshot.size.toString() };
                return s;
            }));

            // Revenue calculation
            const confirmedAppts = appointments.filter((a: any) => a.status === 'confirmed' || a.status === 'completed');
            const totalRevenue = confirmedAppts.reduce((sum: number, a: any) => sum + (a.price || 0), 0);

            setStats(prev => prev.map(s => {
                if (s.title === "Revenue") return { ...s, value: `₹${totalRevenue.toLocaleString()}` };
                return s;
            }));

            // Sparkline for Revenue
            setSparklineData(confirmedAppts.slice(-10).map((a: any) => ({ value: a.price || 0 })));

            // Activity Feed (Latest 5)
            const latest = appointments.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).slice(0, 5);
            setRecentActivity(latest.map((a: any) => ({
                id: a.id,
                type: 'appointment',
                title: `New Appointment: ${a.serviceName}`,
                description: `${a.customerName} with ${a.doctor || 'Provider'}`,
                time: a.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now',
                avatar: a.customerName?.[0] || 'U',
                color: 'bg-indigo-500'
            })));

            // Chart Data - Group by month
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartGroups = confirmedAppts.reduce((acc: any, a: any) => {
                const date = a.startAt?.toDate() || new Date();
                const month = monthNames[date.getMonth()];
                if (!acc[month]) acc[month] = { month, revenue: 0, appointments: 0, patients: new Set() };
                acc[month].revenue += (a.price || 0);
                acc[month].appointments += 1;
                acc[month].patients.add(a.customerId);
                return acc;
            }, {});

            const sortedChartData = monthNames
                .filter(m => chartGroups[m])
                .map(m => ({
                    ...chartGroups[m],
                    patients: chartGroups[m].patients.size
                }));

            setRevenueData(sortedChartData.length > 0 ? sortedChartData : [{ month: 'No Data', revenue: 0, appointments: 0, patients: 0 }]);
        });

        // 3. Active Therapies Listener
        const qActive = query(
            collection(db, 'active_therapies'),
            where('status', '==', 'IN_PROGRESS')
        );
        const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
            setActiveTherapyCount(snapshot.size);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeAppointments();
            unsubscribeActive();
        };
    }, []);

    // ... (rest of the file)

    return (
        <div className="space-y-6 font-['Inter',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-600 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                        <Clock className="inline h-4 w-4 mr-2" />
                        Last updated: Just now
                    </div>
                </div>
            </div>

            {/* Premium Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                    >
                        {/* Sparkline Background for Revenue Card */}
                        {stat.hasSparkline && (
                            <div className="absolute inset-0 opacity-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparklineData}>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${stat.trend === "up"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                    }`}>
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3" />
                                    )}
                                    {stat.change}
                                </div>
                                <span className="text-xs text-slate-500">{stat.subtitle}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bento Grid Layout */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Large Revenue Analytics - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Revenue Analytics</h2>
                            <p className="text-sm text-slate-600 mt-1">Income trends over the last 6 months</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium bg-[#1C4E46] text-white rounded-lg hover:bg-[#163d37] transition-colors">
                                6 Months
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                                1 Year
                            </button>
                        </div>
                    </div>

                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value: number | undefined) => [`₹${value?.toLocaleString() ?? '0'}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0F766E"
                                    strokeWidth={3}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed - Takes 1 column */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                        <Activity className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className={`${activity.color} text-white rounded-lg w-10 h-10 flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
                                    {activity.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 group-hover:text-[#1C4E46] transition-colors">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Top Providers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Top Providers</h2>
                        <Stethoscope className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        {providerData.map((provider, index) => (
                            <div key={provider.name} className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-xs">
                                    #{index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
                                    <p className="text-xs text-slate-600">{provider.patients} patients</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span className="text-sm font-semibold">★</span>
                                    <span className="text-xs font-medium">{provider.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Verifications */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Pending Actions</h2>
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Provider Verifications</p>
                                    <p className="text-xs text-slate-600">Awaiting approval</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-amber-600">0</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <CalendarCheck className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Appointment Requests</p>
                                    <p className="text-xs text-slate-600">Needs confirmation</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-blue-600">0</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Active Therapies</p>
                                    <p className="text-xs text-slate-600">In progress</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">{activeTherapyCount}</span>
                        </div>
                    </div>
                </div>

                {/* Today's Summary */}
                <div className="bg-gradient-to-br from-[#1C4E46] to-[#0F766E] rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Today's Summary</h2>
                        <Activity className="h-5 w-5 opacity-80" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">New Appointments</span>
                            <span className="text-2xl font-bold">
                                {recentActivity.filter(a => a.time.includes('AM') || a.time.includes('PM')).length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">Active Sessions</span>
                            <span className="text-2xl font-bold">{activeTherapyCount}</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">Total Patients</span>
                            <span className="text-2xl font-bold">{stats.find(s => s.title === "Total Users")?.value}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Total Value</span>
                            <span className="text-2xl font-bold">{stats.find(s => s.title === "Revenue")?.value}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default DashboardHome;
