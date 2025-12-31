import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
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
    { name: 'Dr. Smith', hours: 40, utilization: 85 },
    { name: 'Dr. Doe', hours: 35, utilization: 78 },
    { name: 'Dr. Jane', hours: 25, utilization: 92 },
    { name: 'Massage Therapy', hours: 50, utilization: 65 },
];

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-slate">Reports & Insights</h1>
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-deep-forest focus:outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Appointment Trends" description="Daily appointment volume over the last week.">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Line type="monotone" dataKey="appointments" stroke="#0284C7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Provider Utilization" description="Percentage of available hours booked.">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={providerData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Legend />
                                <Bar dataKey="utilization" fill="#2C5F2D" radius={[0, 4, 4, 0]} name="Utilization %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Peak Booking Hours" description="Heatmap of most active booking times.">
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <div key={d} className="font-medium text-slate-500 py-2">{d}</div>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded py-3 ${i % 3 === 0 ? 'bg-deep-forest/80 text-white' :
                                i % 2 === 0 ? 'bg-deep-forest/40 text-dark-slate' :
                                    'bg-slate-100 text-slate-400'
                                }`}
                        >
                            {9 + (i % 8)}:00
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Reports;
