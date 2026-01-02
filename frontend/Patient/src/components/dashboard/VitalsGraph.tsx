
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { TherapyLog } from '../../types/db';

interface VitalsGraphProps {
    logs: Record<string, TherapyLog>;
}

export const VitalsGraph = ({ logs }: VitalsGraphProps) => {
    // Transform logs object to array and sort by day
    const data = Object.entries(logs)
        .map(([key, log]) => {
            // Extract number from "day_1" -> 1
            const dayNum = parseInt(key.split('_')[1] || '0');
            return {
                name: `Day ${dayNum}`,
                dayNum,
                pain: log.painLevel || 0,
                // Add reference line or other metrics here
            };
        })
        .sort((a, b) => a.dayNum - b.dayNum);

    if (data.length === 0) {
        return <div className="text-center text-gray-400 py-8">No vitals data available yet.</div>;
    }

    return (
        <div className="w-full h-[300px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Recovery Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#0F766E', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="pain"
                        stroke="#0F766E"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPain)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
