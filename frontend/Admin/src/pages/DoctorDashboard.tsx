import { AlertTriangle, Phone, Check, User, AlertCircle, Clock, Activity as ActivityIcon, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DoctorDashboard = () => {
    // Mock Data for Red Flags
    const RED_FLAGS = [
        {
            id: '1',
            patientId: 'ODSRC3',
            sessionDate: '2026-01-07',
            alert: 'URGENT SOS ALERT: Patient triggered emergency assistance from the app.',
            painLevel: '10/10',
            digestion: 'N/A',
            isUrgent: true
        },
        {
            id: '2',
            patientId: 'YX9P92',
            sessionDate: '2026-01-06',
            alert: 'URGENT SOS ALERT: Patient triggered emergency assistance from the app.',
            painLevel: '10/10',
            digestion: 'N/A',
            isUrgent: true
        },
        {
            id: '3',
            patientId: 'YX9P92',
            sessionDate: '2026-01-06',
            alert: 'URGENT SOS ALERT: Patient triggered emergency assistance from the app.',
            painLevel: '10/10',
            digestion: 'N/A',
            isUrgent: true
        }
    ];

    // Mock Data for Incoming Therapy Sessions
    const INCOMING_SESSIONS = [
        { id: '1', patient: 'Sarah Jenkins', therapy: 'Panchakarma (Day 3)', time: '09:00 AM', status: 'Arrived', room: 'Room 2A' },
        { id: '2', patient: 'Michael Chang', therapy: 'Shirodhara', time: '10:30 AM', status: 'En Route', room: 'Room 1B' },
        { id: '3', patient: 'Emma Wilson', therapy: 'Abhyanga', time: '12:00 PM', status: 'Scheduled', room: 'Room 3C' },
        { id: '4', patient: 'Robert Fox', therapy: 'Panchakarma (Day 1)', time: '02:00 PM', status: 'Scheduled', room: 'Room 2A' },
    ];

    // Mock Data for Vitals Trends
    const VITALS_DATA = [
        { day: 'Mon', pain: 4, sleep: 6, appetite: 7 },
        { day: 'Tue', pain: 3, sleep: 7, appetite: 8 },
        { day: 'Wed', pain: 5, sleep: 5, appetite: 6 },
        { day: 'Thu', pain: 2, sleep: 8, appetite: 9 },
        { day: 'Fri', pain: 2, sleep: 8, appetite: 9 },
        { day: 'Sat', pain: 1, sleep: 9, appetite: 10 },
        { day: 'Sun', pain: 1, sleep: 9, appetite: 10 },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-admin-active/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Red Flag Dashboard</h1>
                        <p className="text-slate-300">Monitoring active alerts and high-priority patients in real-time.</p>
                    </div>
                    <div className="bg-red-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 border border-red-400/30 shadow-lg">
                        <div className="relative">
                            <AlertTriangle size={24} className="text-red-400" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                        </div>
                        <span className="text-lg">{RED_FLAGS.length} Active Alerts</span>
                    </div>
                </div>
            </div>

            {/* Red Flag Cards Grid */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1.5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50"></div>
                    <h2 className="text-2xl font-bold text-admin-sidebar uppercase tracking-tight">Critical Interventions</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RED_FLAGS.map((flag, index) => (
                        <div
                            key={flag.id}
                            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Red Accent Bar */}
                            <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 group-hover:from-red-600 group-hover:via-red-700 group-hover:to-red-600 transition-all"></div>

                            <div className="p-6">
                                {/* Top Row: User & ID */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner border border-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition-all">
                                            <User size={22} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-admin-sidebar leading-tight">{flag.patientId}</h3>
                                            <p className="text-xs text-admin-muted font-semibold mt-0.5 flex items-center gap-1">
                                                <Calendar size={11} />
                                                {flag.sessionDate}
                                            </p>
                                        </div>
                                    </div>
                                    {flag.isUrgent && (
                                        <span className="bg-gradient-to-r from-red-50 to-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full border border-red-200 uppercase tracking-wider shadow-sm">
                                            Urgent
                                        </span>
                                    )}
                                </div>

                                {/* Alert Box */}
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 mb-5 border border-red-100/50 shadow-sm">
                                    <div className="flex items-center gap-2 text-red-600 mb-2">
                                        <AlertCircle size={16} strokeWidth={2.5} />
                                        <span className="text-[11px] font-bold uppercase tracking-wide">Issue Reported</span>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                                        "{flag.alert}"
                                    </p>
                                </div>

                                {/* Vitals */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Pain Level</p>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">{flag.painLevel}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Digestion</p>
                                        <p className="text-2xl font-bold text-slate-700">{flag.digestion}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30">
                                        <Phone size={16} />
                                        Call Now
                                    </button>
                                    <button className="px-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center group">
                                        <Check size={18} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Incoming Therapy Sessions Table */}
                <section className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                        <h2 className="text-2xl font-bold text-admin-sidebar uppercase tracking-tight">Incoming Therapy Sessions</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs uppercase text-admin-muted font-bold tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-xs uppercase text-admin-muted font-bold tracking-wider">Therapy</th>
                                        <th className="px-6 py-4 text-xs uppercase text-admin-muted font-bold tracking-wider">Time</th>
                                        <th className="px-6 py-4 text-xs uppercase text-admin-muted font-bold tracking-wider">Room</th>
                                        <th className="px-6 py-4 text-xs uppercase text-admin-muted font-bold tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {INCOMING_SESSIONS.map((session, index) => (
                                        <tr
                                            key={session.id}
                                            className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all group"
                                        >
                                            <td className="px-6 py-4 font-bold text-admin-sidebar group-hover:text-admin-active transition-colors">{session.patient}</td>
                                            <td className="px-6 py-4 text-slate-600">{session.therapy}</td>
                                            <td className="px-6 py-4 font-semibold text-admin-sidebar flex items-center gap-2">
                                                <Clock size={14} className="text-admin-muted" />
                                                {session.time}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                                                <MapPin size={12} className="text-slate-400" />
                                                {session.room}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${session.status === 'Arrived' ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-sm' :
                                                        session.status === 'En Route' ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 shadow-sm' :
                                                            'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {session.status === 'Arrived' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>}
                                                    {session.status === 'En Route' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>}
                                                    {session.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Patient Vitals Chart */}
                <section className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1.5 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full shadow-lg shadow-teal-500/50"></div>
                        <h2 className="text-2xl font-bold text-admin-sidebar uppercase tracking-tight">Vitals</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 h-[420px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-admin-muted flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg">
                                    <TrendingUp size={16} className="text-teal-600" />
                                </div>
                                Avg. Recovery Metrics
                            </h3>
                        </div>

                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={VITALS_DATA}>
                                <defs>
                                    <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="appetiteGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#64748B"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontWeight={600}
                                />
                                <YAxis
                                    stroke="#64748B"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 10]}
                                    fontWeight={600}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '8px 12px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748B', marginBottom: '4px' }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px', fontWeight: 'bold' }}
                                    iconType="circle"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pain"
                                    stroke="#EF4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#EF4444' }}
                                    name="Pain"
                                    fill="url(#painGradient)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sleep"
                                    stroke="#0EA5E9"
                                    strokeWidth={3}
                                    dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0EA5E9' }}
                                    name="Sleep"
                                    fill="url(#sleepGradient)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="appetite"
                                    stroke="#0F766E"
                                    strokeWidth={3}
                                    dot={{ fill: '#0F766E', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0F766E' }}
                                    name="Appetite"
                                    fill="url(#appetiteGradient)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DoctorDashboard;
