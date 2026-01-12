import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { Appointment } from '../types/db';
import { DOCTORS } from '../utils/doctors';
import { User, Clock, Calendar, Activity } from 'lucide-react';
import Card from '../components/ui/Card';

interface DoctorStatus {
    id: string;
    name: string;
    photoURL?: string;
    status: 'Available' | 'In Session' | 'Booked Next';
    currentAppointment?: Appointment;
    nextAppointment?: Appointment;
}

const DoctorStatusPage = () => {
    const [doctors, setDoctors] = useState<DoctorStatus[]>([]);
    const [loading, setLoading] = useState(true);

    // Use static DOCTORS list as base
    useEffect(() => {
        let unsubscribe: () => void;

        const init = async () => {
            // Setup Realtime Listener
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const q = query(
                collection(db, 'appointments'),
                where('startAt', '>=', startOfDay),
                where('status', 'in', ['confirmed', 'completed'])
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const appointments = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
                const currentTime = new Date();

                // Map static DOCTORS to status
                const processed = DOCTORS.map(doc => {
                    const myAppts = appointments.filter(a => a.providerId === doc.id);

                    // Find active
                    const active = myAppts.find(a => {
                        const s = a.startAt.toDate();
                        const e = a.endAt.toDate();
                        return currentTime >= s && currentTime <= e;
                    });

                    // Find Next
                    const future = myAppts
                        .filter(a => a.startAt.toDate() > currentTime)
                        .sort((a, b) => a.startAt.seconds - b.startAt.seconds);

                    const next = future.length > 0 ? future[0] : undefined;

                    let st: 'Available' | 'In Session' | 'Booked Next' = 'Available';
                    if (active) st = 'In Session';
                    else if (next && (next.startAt.toDate().getTime() - currentTime.getTime() <= 30 * 60000)) {
                        st = 'Booked Next';
                    }

                    return {
                        id: doc.id,
                        name: doc.name,
                        photoURL: undefined, // Add image if avail in DOCTORS
                        status: st,
                        currentAppointment: active,
                        nextAppointment: next
                    };
                });

                setDoctors(processed);
                setLoading(false);
            });
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Doctor Availability Status</h1>
                <p className="text-slate-500">Real-time monitoring of provider availability and active sessions</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors.map(doc => (
                    <Card key={doc.id} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        {/* Status Stripe */}
                        <div className={`absolute top-0 left-0 w-2 h-full 
                            ${doc.status === 'Available' ? 'bg-emerald-500' :
                                doc.status === 'In Session' ? 'bg-red-500' : 'bg-amber-500'}`}
                        />

                        <div className="p-6 pl-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                                        {doc.photoURL ? (
                                            <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{doc.name}</h3>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
                                            ${doc.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                doc.status === 'In Session' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Available' ? 'bg-emerald-500 animate-pulse' : doc.status === 'In Session' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                            {doc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {doc.status === 'In Session' && doc.currentAppointment && (
                                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                        <div className="flex items-center gap-2 text-red-800 font-semibold text-xs uppercase mb-2">
                                            <Activity size={12} /> Current Phase
                                        </div>
                                        <p className="font-medium text-slate-900 text-sm truncate">{doc.currentAppointment.serviceName}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <Clock size={12} />
                                            <span>Until {doc.currentAppointment.endAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                )}

                                {doc.nextAppointment ? (
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase mb-2">
                                            <Calendar size={12} /> Up Next
                                        </div>
                                        <p className="font-medium text-slate-900 text-sm truncate">{doc.nextAppointment.serviceName}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <Clock size={12} />
                                            <span>{doc.nextAppointment.startAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-center text-xs text-slate-400 h-20">
                                        No upcoming appointments today
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {doctors.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <User size={48} className="mb-4 opacity-20" />
                        <p>No doctors found or system error.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorStatusPage;
