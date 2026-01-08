import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, Clock } from 'lucide-react';
import Card from "../components/ui/Card";

const data = [
    { name: 'Mon', appointments: 40, revenue: 2400 },
    { name: 'Tue', appointments: 30, revenue: 1398 },
    { name: 'Wed', appointments: 20, revenue: 9800 },
    { name: 'Thu', appointments: 27, revenue: 3908 },
    { name: 'Fri', appointments: 18, revenue: 4800 },
    { name: 'Sat', appointments: 23, revenue: 3800 },
    { name: 'Sun', appointments: 34, revenue: 4300 },
];

const providerData = [
    { name: 'Dr. Smith', utilization: 85, hours: 40 },
    { name: 'Dr. Doe', utilization: 72, hours: 35 },
    { name: 'Dr. Jane', utilization: 92, hours: 45 },
    { name: 'Massage Therapy', utilization: 68, hours: 50 },
];

// Heatmap data - booking intensity by day and hour
const heatmapData = [
    { day: 'Mon', slots: [2, 3, 5, 8, 6, 4, 2] },
    { day: 'Tue', slots: [1, 4, 6, 7, 5, 3, 1] },
    { day: 'Wed', slots: [3, 5, 8, 9, 7, 4, 2] },
    { day: 'Thu', slots: [2, 6, 9, 8, 6, 3, 1] },
    { day: 'Fri', slots: [4, 7, 6, 5, 4, 2, 1] },
    { day: 'Sat', slots: [1, 2, 4, 8, 9, 5, 2] },
    { day: 'Sun', slots: [1, 2, 3, 7, 9, 6, 3] },
];



const Reports = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
            <div className="space-y-6 pb-8">
                {/* Compact Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl border border-white/5">
                    {/* Animated Floating Orbs - Smaller */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                                Reports & Insights
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Analytics and performance metrics</p>
                        </div>

                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card title="Appointment Trends" description="Daily appointment volume">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Line type="monotone" dataKey="appointments" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Provider Utilization - Enhanced with Gradient Bars */}
                    <div className="group bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
                                        <Users size={20} className="text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-admin-sidebar">Provider Utilization</h3>
                                        <p className="text-xs text-admin-muted">Percentage of hours booked</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-5">
                                {providerData.map((provider, index) => (
                                    <div key={provider.name} className="group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-admin-sidebar group-hover:text-admin-active transition-colors">
                                                {provider.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-admin-muted font-semibold">{provider.hours}h</span>
                                                <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {provider.utilization}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg ${provider.utilization >= 90 ? 'shadow-emerald-500/50' :
                                                    provider.utilization >= 75 ? 'shadow-teal-500/50' : 'shadow-teal-500/30'
                                                    }`}
                                                style={{ width: `${provider.utilization}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Peak Booking Hours - Activity Bubbles Style */}
                <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                                <Clock size={20} className="text-emerald-700" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-emerald-900">Peak Booking Hours</h3>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center"><div className="w-2 h-2 bg-slate-200 rounded-full mr-2"></div> Idle</span>
                            <span className="flex items-center"><div className="w-3 h-3 bg-emerald-300 rounded-full mr-2"></div> Moderate</span>
                            <span className="flex items-center"><div className="w-4 h-4 bg-emerald-600 rounded-full mr-2"></div> Busy</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-6">
                        {/* Y-Axis Labels (Days) */}
                        <div className="flex flex-col justify-around text-xs font-bold text-slate-400 pt-8">
                            {heatmapData.map(d => <div key={d.day} className="h-12 flex items-center">{d.day}</div>)}
                        </div>

                        {/* The Grid */}
                        <div className="w-full">
                            {/* X-Axis Labels (Time) */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'].map(time => (
                                    <div key={time} className="text-center text-xs text-slate-400 font-semibold">{time}</div>
                                ))}
                            </div>

                            {/* The Bubbles */}
                            <div className="space-y-2">
                                {heatmapData.map((row, rowIdx) => (
                                    <div key={rowIdx} className="grid grid-cols-7 gap-2">
                                        {row.slots.map((val, colIdx) => {
                                            // Helper to get color/size based on intensity
                                            const getIntensityStyles = (value: number) => {
                                                if (value === 0) return "w-2 h-2 bg-slate-200"; // Tiny grey dot
                                                if (value < 3) return "w-8 h-8 bg-emerald-200 text-emerald-800"; // Light Emerald (Solid) - Increased size for visibility
                                                if (value < 6) return "w-10 h-10 bg-emerald-400 text-white shadow-md shadow-emerald-400/20"; // Medium Emerald
                                                return "w-12 h-12 bg-emerald-700 text-white shadow-lg shadow-emerald-700/30"; // Deep Emerald (High)
                                            };

                                            return (
                                                <div key={colIdx} className="h-12 flex items-center justify-center relative">
                                                    {/* The Bubble with its own hover group */}
                                                    <div className={`group/bubble rounded-full transition-all duration-500 ${getIntensityStyles(val)} flex items-center justify-center hover:scale-110 cursor-pointer relative`}>
                                                        {/* Number is always visible */}
                                                        <span className={`text-[10px] font-bold ${val === 0 ? 'hidden' : 'opacity-100'}`}>
                                                            {val}
                                                        </span>

                                                        {/* Tooltip */}
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover/bubble:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl pointer-events-none">
                                                            {val} Bookings
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-700"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
