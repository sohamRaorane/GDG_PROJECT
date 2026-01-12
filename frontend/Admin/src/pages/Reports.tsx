import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Users, Clock, DollarSign, Activity } from 'lucide-react';

// Data arrays - ready for database integration
const data: { name: string; appointments: number; revenue: number }[] = [];

const providerData: { name: string; utilization: number; hours: number }[] = [];

const revenueData: { month: string; revenue: number }[] = [];

// Heatmap data - booking intensity by day and hour
const heatmapData: { day: string; slots: number[] }[] = [];



const Reports = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
            <div className="space-y-6 pb-8">
                {/* Compact Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl border border-white/5">
                    {/* Animated Floating Orbs */}
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

                {/* Charts Grid - 2 Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Revenue Trends - Area Chart */}
                    <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                                <DollarSign size={20} className="text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-emerald-900">Revenue Trends</h3>
                                <p className="text-xs text-slate-500">Monthly revenue overview</p>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px', fontWeight: '500' }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
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
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Appointment Trends - Line Chart */}
                    <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                <Activity size={20} className="text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-blue-900">Appointment Trends</h3>
                                <p className="text-xs text-slate-500">Daily appointment volume</p>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px', fontWeight: '500' }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="appointments"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 7, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Provider Performance - Bar Chart */}
                    <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl hover:border-purple-200 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                                <Users size={20} className="text-purple-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-purple-900">Provider Performance</h3>
                                <p className="text-xs text-slate-500">Utilization rates by provider</p>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={providerData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '11px', fontWeight: '500' }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Utilization']}
                                    />
                                    <Bar
                                        dataKey="utilization"
                                        fill="url(#colorBar)"
                                        radius={[8, 8, 0, 0]}
                                        animationDuration={1500}
                                    >
                                        <defs>
                                            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#9333EA" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
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
        </div>
    );
};

export default Reports;
