
import { useState, useEffect } from 'react';
import { X, Calendar, User, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { getAllUsers, getAllServices, checkConflicts, createAppointmentBatch } from '../../services/db';
import type { UserProfile, Service } from '../../types/db';
import { Timestamp } from 'firebase/firestore';

interface TreatmentWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const TreatmentWizard = ({ isOpen, onClose, onSuccess }: TreatmentWizardProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    // Selection
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [durationDays, setDurationDays] = useState(7);

    // Validation
    const [conflicts, setConflicts] = useState<{ date: string, conflict: boolean }[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadData();
            setStep(1);
            setConflicts([]);
            setError(null);
            setSelectedUser('');
            setSelectedService(null);
            setStartDate('');
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            setError(null);
            const [u, s] = await Promise.all([getAllUsers(), getAllServices()]);

            if (u.length === 0) {
                console.warn("No users found in database.");
            }
            setUsers(u);
            setServices(s);
        } catch (err: any) {
            console.error("Error loading data:", err);
            setError(err.message || "Failed to load data");
        }
    };

    const handleNext = async () => {
        if (step === 2) {
            setLoading(true);
            const conflictResults = await checkConflicts(startDate, durationDays, startTime);
            setConflicts(conflictResults);
            setLoading(false);
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!selectedService || !selectedUser) return;
        setLoading(true);

        try {
            const appointments = [];
            let currentDate = new Date(startDate);

            // Get user details
            const user = users.find(u => u.uid === selectedUser);
            if (!user) return;

            for (let i = 0; i < durationDays; i++) {
                const startAt = new Date(currentDate);
                const [hours, minutes] = startTime.split(':').map(Number);
                startAt.setHours(hours, minutes, 0, 0);

                const endAt = new Date(startAt);
                endAt.setMinutes(endAt.getMinutes() + selectedService.durationMinutes);

                appointments.push({
                    customerId: user.uid,
                    customerName: user.displayName,
                    customerEmail: user.email,
                    serviceId: selectedService.id,
                    serviceName: selectedService.name,
                    providerId: selectedService.providerId,
                    startAt: Timestamp.fromDate(startAt),
                    endAt: Timestamp.fromDate(endAt),
                    status: 'confirmed' as const,
                    price: selectedService.price,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            await createAppointmentBatch(appointments);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create plan", error);
            setError("Failed to create appointments. Check console.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">New Treatment Plan</h2>
                        <p className="text-sm text-gray-500">Step {step} of 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1">

                    {/* Step 1: Select Patient */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="text-primary" /> Select Patient
                            </h3>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-4 text-sm">
                                    Error: {error}
                                </div>
                            )}

                            {users.length === 0 && !error ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No patients found in the database.</p>
                                    <p className="text-xs mt-2">Create a user with role 'customer' first.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {users.map(user => (
                                        <div
                                            key={user.uid}
                                            onClick={() => setSelectedUser(user.uid)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                                ${selectedUser === user.uid ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-300'}
                                            `}
                                        >
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                                {user.displayName ? user.displayName.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{user.displayName || 'Unknown User'}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            {selectedUser === user.uid && <CheckCircle className="ml-auto text-primary" size={20} />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Scheduling */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="text-primary" /> Configuration
                            </h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Therapy Type</label>
                                <select
                                    className="w-full p-3 border rounded-xl"
                                    onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value) || null)}
                                >
                                    <option value="">Select Therapy...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border rounded-xl"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border rounded-xl"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
                                <div className="flex items-center gap-4">
                                    {[3, 5, 7, 14, 21].map(days => (
                                        <button
                                            key={days}
                                            onClick={() => setDurationDays(days)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${durationDays === days ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                            `}
                                        >
                                            {days} Days
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle className="text-primary" /> Review Plan
                            </h3>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                                <p><span className="font-bold">Patient:</span> {users.find(u => u.uid === selectedUser)?.displayName}</p>
                                <p><span className="font-bold">Therapy:</span> {selectedService?.name}</p>
                                <p><span className="font-bold">Schedule:</span> {durationDays} days starting {startDate} at {startTime}</p>
                            </div>

                            {conflicts.length > 0 ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <h4 className="flex items-center gap-2 text-red-700 font-bold mb-2">
                                        <AlertTriangle size={18} /> Schedule Conflicts Detected
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                        {conflicts.filter(c => c.conflict).map((c, i) => (
                                            <li key={i}>Conflict on {c.date} (Slot unavailable)</li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-red-500 mt-2">Please go back and adjust the time or date.</p>
                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                                    <CheckCircle size={20} />
                                    <span className="font-medium">All 7 slots are available!</span>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="px-6 py-2 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 disabled:opacity-50"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={!selectedUser || (step === 2 && (!selectedService || !startDate))}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || conflicts.length > 0}
                            className="bg-primary text-white px-8 py-2 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Confirm Booking'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};
