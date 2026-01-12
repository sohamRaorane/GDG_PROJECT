import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Users, Clock, DollarSign, Activity, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { Appointment } from '../types/db';

const Reports = () => {
    // State for aggregated data
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [appointmentData, setAppointmentData] = useState<{ name: string; appointments: number }[]>([]);
    const [providerData, setProviderData] = useState<{ name: string; utilization: number }[]>([]);
    const [heatmapData, setHeatmapData] = useState<{ day: string; slots: number[] }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to all specific appointments for analytics
        const q = query(
            collection(db, 'appointments'),
            where('status', 'in', ['confirmed', 'completed']) // Only confirmed valid appts
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
            processData(appointments);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const processData = (appointments: Appointment[]) => {
        // --- 1. Revenue Trends (Group by Month) ---
        const revenueMap: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize current year months to 0 to show complete line
        const currentMonthIdx = new Date().getMonth();
        for (let i = 0; i <= currentMonthIdx; i++) {
            revenueMap[months[i]] = 0;
        }

        appointments.forEach(app => {
            const date = app.startAt.toDate();
            if (date.getFullYear() === new Date().getFullYear()) {
                const month = months[date.getMonth()];
                revenueMap[month] = (revenueMap[month] || 0) + (app.price || 0); // Assuming price field exists
            }
        });

        const revData = Object.keys(revenueMap).map(m => ({
            month: m,
            revenue: revenueMap[m]
        })).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort purely by month order

        setRevenueData(revData);

        // --- 2. Appointment Trends (Group by Day of Week: recent window or general distribution) ---
        // Let's show distribution per day of week for general patterns
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const apptMap: Record<string, number> = {};
        days.forEach(d => apptMap[d] = 0);

        appointments.forEach(app => {
            const day = days[app.startAt.toDate().getDay()];
            apptMap[day]++;
        });

        const apptData = days.map(d => ({
            name: d,
            appointments: apptMap[d]
        }));
        setAppointmentData(apptData);

        // --- 3. Provider Performance (Utilization/Count by Service) ---
        const serviceMap: Record<string, number> = {};
        appointments.forEach(app => {
            // Using serviceName as proxy for "Provider/Service" metric
            const name = app.serviceName || 'General';
            serviceMap[name] = (serviceMap[name] || 0) + 1;
        });

        // Convert raw count to a pseudo-utilization percentage for visualization (relative to max)
        const maxCount = Math.max(...Object.values(serviceMap), 1);
        const provData = Object.keys(serviceMap).map(name => ({
            name: name,
            utilization: Math.round((serviceMap[name] / maxCount) * 100),
            count: serviceMap[name] // keep raw count if needed
        })).slice(0, 5); // Top 5
        setProviderData(provData);

        // --- 4. Peak Booking Hours (Heatmap) ---
        // Grid: 7 days x 7 hours (9am - 3pm shown in UI)
        // Correct mappings:
        // UI days labels in order: Mon, Tue ... ? Code shows 'heatmapData' map usage.
        // Let's align with the existing UI structure: Y-axis days, X-axis hours.
        // We need to match the days order in the UI. 
        // Existing static data structure wasn't fully visible but let's assume standard Mon-Sun.

        const uiDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const uiHours = [9, 10, 11, 12, 13, 14, 15]; // 9 AM to 3 PM

        // Initialize Map
        const heatMap: Record<string, number[]> = {};
        uiDays.forEach(d => {
            heatMap[d] = new Array(uiHours.length).fill(0);
        });

        appointments.forEach(app => {
            const date = app.startAt.toDate();
            const day = uiDays[date.getDay()];
            const hour = date.getHours();

            const hourIdx = uiHours.indexOf(hour);
            if (hourIdx >= 0 && heatMap[day]) {
                heatMap[day][hourIdx]++;
            }
        });

        const heatData = uiDays.map(d => ({
            day: d,
            slots: heatMap[d]
        }));
        setHeatmapData(heatData);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

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
                                <p className="text-xs text-slate-500">Weekly appointment distribution</p>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={appointmentData}>
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
                                <h3 className="text-lg font-serif font-bold text-purple-900">Service Performance</h3>
                                <p className="text-xs text-slate-500">Popularity by service type</p>
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
                                        formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Relative Popularity']}
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
