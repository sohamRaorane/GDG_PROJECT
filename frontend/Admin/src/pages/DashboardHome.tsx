import {
    Users,
    Calendar,
    UserCheck,
    TrendingUp,
    TrendingDown,
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
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const DashboardHome = () => {
    // Revenue data for the last 6 months
    const revenueData = [
        { month: "Jul", revenue: 45000, appointments: 320, patients: 280 },
        { month: "Aug", revenue: 52000, appointments: 380, patients: 310 },
        { month: "Sep", revenue: 48000, appointments: 350, patients: 295 },
        { month: "Oct", revenue: 61000, appointments: 420, patients: 340 },
        { month: "Nov", revenue: 73000, appointments: 480, patients: 385 },
        { month: "Dec", revenue: 124000, appointments: 650, patients: 520 },
    ];

    // Sparkline data for revenue card
    const sparklineData = [
        { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 }, { value: 73 }, { value: 124 }
    ];

    // Provider performance data
    const providerData = [
        { name: "Dr. Sharma", patients: 85, rating: 4.9 },
        { name: "Dr. Patel", patients: 72, rating: 4.8 },
        { name: "Dr. Kumar", patients: 68, rating: 4.7 },
        { name: "Dr. Singh", patients: 91, rating: 4.9 },
    ];

    // Recent activity with avatars
    const recentActivity = [
        {
            id: 1,
            type: "booking",
            title: "New appointment booked",
            description: "Panchakarma Therapy - Dr. Sharma",
            time: "2 minutes ago",
            avatar: "PS",
            color: "bg-teal-500"
        },
        {
            id: 2,
            type: "user",
            title: "New patient registered",
            description: "Rajesh Kumar joined the platform",
            time: "15 minutes ago",
            avatar: "RK",
            color: "bg-blue-500"
        },
        {
            id: 3,
            type: "payment",
            title: "Payment received",
            description: "₹5,400 from appointment #1023",
            time: "1 hour ago",
            avatar: "₹",
            color: "bg-emerald-500"
        },
        {
            id: 4,
            type: "verification",
            title: "Provider verified",
            description: "Dr. Anjali Mehta - Ayurvedic Specialist",
            time: "2 hours ago",
            avatar: "AM",
            color: "bg-purple-500"
        },
        {
            id: 5,
            type: "therapy",
            title: "Therapy completed",
            description: "21-day Detox Program - Patient #892",
            time: "3 hours ago",
            avatar: "TC",
            color: "bg-orange-500"
        },
    ];

    const stats = [
        {
            title: "Total Users",
            value: "1,240",
            icon: Users,
            change: "+12.5%",
            trend: "up",
            iconBg: "bg-teal-50",
            iconColor: "text-teal-600",
            subtitle: "from last month"
        },
        {
            title: "Service Providers",
            value: "48",
            icon: UserCheck,
            change: "+4.2%",
            trend: "up",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            subtitle: "from last month"
        },
        {
            title: "Total Appointments",
            value: "3,892",
            icon: Calendar,
            change: "+28.4%",
            trend: "up",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            subtitle: "from last month"
        },
        {
            title: "Revenue",
            value: "₹124k",
            icon: DollarSign,
            change: "+8.1%",
            trend: "up",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            subtitle: "from last month",
            hasSparkline: true
        },
    ];

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
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
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
                            <span className="text-lg font-bold text-amber-600">3</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <CalendarCheck className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Appointment Requests</p>
                                    <p className="text-xs text-slate-600">Needs confirmation</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-blue-600">12</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Active Therapies</p>
                                    <p className="text-xs text-slate-600">In progress</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">28</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-[#1C4E46] to-[#0F766E] rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Today's Summary</h2>
                        <TrendingUp className="h-5 w-5 opacity-80" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">New Appointments</span>
                            <span className="text-2xl font-bold">24</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">Completed Sessions</span>
                            <span className="text-2xl font-bold">18</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/20">
                            <span className="text-sm opacity-90">New Patients</span>
                            <span className="text-2xl font-bold">7</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Revenue Today</span>
                            <span className="text-2xl font-bold">₹8.2k</span>
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
