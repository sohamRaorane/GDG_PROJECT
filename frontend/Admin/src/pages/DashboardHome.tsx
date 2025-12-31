import Card from "../components/ui/Card";
import { Users, Calendar, UserCheck, TrendingUp } from "lucide-react";

const DashboardHome = () => {
    const stats = [
        { title: "Total Users", value: "1,240", icon: Users, change: "+12.5%", trend: "up" },
        { title: "Service Providers", value: "48", icon: UserCheck, change: "+4.2%", trend: "up" },
        { title: "Total Appointments", value: "3,892", icon: Calendar, change: "+28.4%", trend: "up" },
        { title: "Revenue", value: "$124k", icon: TrendingUp, change: "+8.1%", trend: "up" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dark-slate">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-dark-slate mt-1">{stat.value}</h3>
                            </div>
                            <div className="rounded-full bg-blue-50 p-2 text-medical-blue">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 font-medium">{stat.change}</span>
                            <span className="text-slate-400 ml-2">from last month</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Recent Activity" description="Latest actions across the platform.">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <div className="h-2 w-2 rounded-full bg-medical-blue"></div>
                                <div>
                                    <p className="text-sm font-medium text-dark-slate">New booking confirmed #102{i}</p>
                                    <p className="text-xs text-slate-400">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Pending Verifications" description="Providers waiting for approval.">
                    <div className="flex items-center justify-center h-32 text-slate-400">
                        No pending verifications
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
