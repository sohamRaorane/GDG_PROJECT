import { useState } from 'react';
import { User, Calendar, History, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';

// Mock Data
const UPCOMING_APPOINTMENTS = [
    {
        id: '1',
        service: 'Shirodhara',
        doctor: 'Dr. Anjali Sharma',
        date: '2024-03-15',
        time: '10:00 AM',
        status: 'Confirmed'
    }
];

const PAST_APPOINTMENTS = [
    {
        id: '2',
        service: 'Abhyanga',
        doctor: 'Dr. John Doe',
        date: '2024-02-10',
        time: '02:00 PM',
        status: 'Completed'
    },
    {
        id: '3',
        service: 'Nasya',
        doctor: 'Dr. John Doe',
        date: '2024-01-05',
        time: '11:00 AM',
        status: 'Completed'
    }
];

export const Profile = () => {
    const [activeTab, setActiveTab] = useState<'details' | 'upcoming' | 'history'>('upcoming');

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold font-display text-text mb-8">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                            activeTab === 'upcoming' ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
                        )}
                    >
                        <Calendar size={18} />
                        <span className="font-medium">Upcoming Appointments</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                            activeTab === 'history' ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
                        )}
                    >
                        <History size={18} />
                        <span className="font-medium">History</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                            activeTab === 'details' ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
                        )}
                    >
                        <User size={18} />
                        <span className="font-medium">Personal Details</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 min-h-[500px]">
                    {activeTab === 'upcoming' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-text">Upcoming Appointments</h2>
                            {UPCOMING_APPOINTMENTS.map(apt => (
                                <AppointmentCard key={apt.id} appointment={apt} type="upcoming" />
                            ))}
                            {UPCOMING_APPOINTMENTS.length === 0 && (
                                <p className="text-gray-400">No upcoming appointments.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-text">Appointment History</h2>
                            {PAST_APPOINTMENTS.map(apt => (
                                <AppointmentCard key={apt.id} appointment={apt} type="past" />
                            ))}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6 max-w-md">
                            <h2 className="text-xl font-bold text-text">Personal Details</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                                    <input type="text" defaultValue="Aditya User" className="w-full mt-1 p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                    <input type="email" defaultValue="aditya@example.com" className="w-full mt-1 p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                    <input type="tel" defaultValue="+91 9876543210" className="w-full mt-1 p-2 border rounded-md" />
                                </div>
                                <Button>Save Changes</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AppointmentCard = ({ appointment, type }: { appointment: any, type: 'upcoming' | 'past' }) => {
    return (
        <div className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors bg-gray-50/50">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-text">{appointment.service}</h3>
                    <p className="text-primary font-medium">{appointment.doctor}</p>
                </div>
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    type === 'upcoming' ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-500"
                )}>
                    {appointment.status}
                </span>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                </div>
            </div>

            {type === 'upcoming' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 border-red-200 hover:border-red-300">Cancel</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                </div>
            )}
        </div>
    )
}
