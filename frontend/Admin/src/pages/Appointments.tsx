import { useState, useEffect } from "react";
import { Plus, Link as LinkIcon, Eye, Trash2, Clock, Users, DollarSign, Power } from "lucide-react";

// Simple utility for joining classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import ScheduleManager from "../components/appointments/ScheduleManager";
import IntakeFormBuilder from "../components/appointments/IntakeFormBuilder";
import CalendarView from "../components/appointments/CalendarView";
import { TreatmentWizard } from "../components/appointments/TreatmentWizard";
import { getAllServices, createService, getAllAppointments, updateAppointmentStatus, updateService, deleteService } from "../services/db";
import type { Appointment, Service } from "../types/db";
import { Timestamp } from "firebase/firestore";

interface AppointmentType {
    id: string | number;
    name: string;
    duration: number; // minutes
    type: "User" | "Resource";
    price: number;
    status: "Published" | "Unpublished";
    prePrecautions?: string;
    postPrecautions?: string;
}

const Appointments = () => {
    const [activeTab, setActiveTab] = useState<"services" | "availability" | "calendar" | "settings">("services");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [newType, setNewType] = useState<Partial<AppointmentType>>({
        name: "",
        duration: 30,
        type: "User",
        price: 0,
        status: "Unpublished",
        prePrecautions: "",
        postPrecautions: ""
    });

    const handleCreateType = () => {
        if (!newType.name) return;
        const type: AppointmentType = {
            id: Date.now(),
            name: newType.name as string,
            duration: newType.duration || 30,
            type: newType.type || "User",
            price: newType.price || 0,
            status: newType.status || "Unpublished",
        };

        // persist to Firestore as a Service
        (async () => {
            try {
                const svc: Omit<Service, 'id'> = {
                    name: type.name,
                    description: type.name,
                    durationMinutes: type.duration,
                    price: type.price,
                    currency: "USD",
                    isActive: type.status === "Published",
                    providerId: "admin",
                    workingHours: [],
                    bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false },
                    prePrecautions: newType.prePrecautions,
                    postPrecautions: newType.postPrecautions,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                };
                const id = await createService(svc);
                setAppointmentTypes((prev) => [...prev, { ...type, id }]);
            } catch (err) {
                console.error("Failed to create service", err);
            }
        })();

        setIsModalOpen(false);
        setNewType({ name: "", duration: 30, type: "User", price: 0, status: "Unpublished", prePrecautions: "", postPrecautions: "" });
    };

    const AppointmentTypeCard = ({ type, onToggle, onDelete }: { type: AppointmentType; onToggle?: () => void; onDelete?: () => void }) => (
        <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-dark-slate">{type.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-2 ${type.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                        {type.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-medical-blue" title="Share Link"><LinkIcon className="h-4 w-4" /></button>
                    <button className="text-slate-400 hover:text-medical-blue" title="Preview"><Eye className="h-4 w-4" /></button>
                    <button
                        onClick={onToggle}
                        className={cn(
                            "p-1 rounded-md transition-colors",
                            type.status === "Published" ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-100"
                        )}
                        title={type.status === "Published" ? "Unpublish Service" : "Publish Service"}
                    >
                        <Power className="h-4 w-4" />
                    </button>
                    <button onClick={onDelete} className="text-slate-400 hover:text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{type.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{type.type} Assignment</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span>${type.price}</span>
                </div>
            </div>
        </Card>
    );

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoadingServices(true);
            try {
                const services = await getAllServices();
                if (!mounted) return;
                const mapped: AppointmentType[] = services.map((s) => ({
                    id: s.id,
                    name: s.name,
                    duration: s.durationMinutes,
                    type: "User",
                    price: s.price,
                    status: s.isActive ? "Published" : "Unpublished",
                }));
                setAppointmentTypes(mapped);
            } catch (err) {
                console.error("Failed to load services", err);
            } finally {
                if (mounted) setLoadingServices(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    // load appointments for management list
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoadingAppointments(true);
            try {
                const appts = await getAllAppointments();
                if (!mounted) return;
                setAppointments(appts);
            } catch (err) {
                console.error("Failed to load appointments", err);
            } finally {
                if (mounted) setLoadingAppointments(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const handleChangeAppointmentStatus = async (id: string, status: Appointment['status']) => {
        try {
            await updateAppointmentStatus(id, status);
            setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status } : a));
        } catch (err) {
            console.error('Failed to update appointment status', err);
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            await deleteService(id);
            setAppointmentTypes((prev) => prev.filter(p => String(p.id) !== String(id)));
        } catch (err) {
            console.error('Failed to delete service', err);
        }
    };

    const handleToggleServiceActive = async (id: string, current: boolean) => {
        try {
            await updateService(id, { isActive: !current, updatedAt: Timestamp.now() });
            setAppointmentTypes((prev) => prev.map(p => String(p.id) === String(id) ? { ...p, status: !current ? 'Published' : 'Unpublished' } : p));
        } catch (err) {
            console.error('Failed to update service', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-slate">Service & Appointment Configuration</h1>
                {activeTab === "services" && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create New Type
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: "services", label: "Services & Types" },
                        { id: "availability", label: "Availability & Hours" },
                        { id: "calendar", label: "Calendar View" },
                        { id: "settings", label: "Booking Settings" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-deep-forest text-deep-forest"
                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-4">
                {activeTab === "services" && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {appointmentTypes.map((type) => (
                            <AppointmentTypeCard key={type.id} type={type} onToggle={() => handleToggleServiceActive(String(type.id), type.status === 'Published')} onDelete={() => handleDeleteService(String(type.id))} />
                        ))}
                    </div>
                )}

                {activeTab === "availability" && <ScheduleManager />}

                {activeTab === "calendar" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-dark-slate">Calendar Management</h2>
                            <Button onClick={() => setIsWizardOpen(true)} className="bg-primary hover:bg-primary-dark">
                                <Plus className="mr-2 h-4 w-4" /> New Treatment Plan
                            </Button>
                        </div>
                        <CalendarView />

                        <TreatmentWizard
                            isOpen={isWizardOpen}
                            onClose={() => setIsWizardOpen(false)}
                            onSuccess={() => {
                                // Refresh appointments logic to be handled by effect or simple reload for now
                                window.location.reload();
                            }}
                        />

                        {/* Appointment Status Sections */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Pending Appointments */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>Pending</span>
                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                                            {appointments.filter(a => a.status === 'pending').length}
                                        </span>
                                    </div>
                                }
                                description="Awaiting confirmation"
                            >
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                    {appointments.filter(a => a.status === 'pending').length === 0 ? (
                                        <div className="text-sm text-slate-400 text-center py-4">No pending appointments</div>
                                    ) : (
                                        appointments.filter(a => a.status === 'pending').map((a) => (
                                            <div
                                                key={a.id}
                                                onClick={() => {
                                                    setSelectedAppointment(a);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                                className="flex items-center justify-between border-l-4 border-amber-500 bg-amber-50/50 rounded-r-lg px-3 py-2.5 hover:bg-amber-50 transition-colors cursor-pointer mb-2 last:mb-0"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium text-admin-text text-sm">{a.serviceName}</div>
                                                    <div className="text-xs text-slate-500">{a.customerName} • {a.startAt.toDate().toLocaleString()}</div>
                                                </div>
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => handleChangeAppointmentStatus(a.id, e.target.value as Appointment['status'])}
                                                    className="text-xs rounded-lg border border-amber-300 bg-white px-2 py-1 focus:border-amber-500 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no-show">No-show</option>
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* Confirmed Appointments */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>Confirmed</span>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                            {appointments.filter(a => a.status === 'confirmed').length}
                                        </span>
                                    </div>
                                }
                                description="Ready to proceed"
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {appointments.filter(a => a.status === 'confirmed').length === 0 ? (
                                        <div className="text-sm text-slate-400 text-center py-4">No confirmed appointments</div>
                                    ) : (
                                        appointments.filter(a => a.status === 'confirmed').map((a) => (
                                            <div key={a.id} className="flex items-center justify-between border-l-4 border-green-500 bg-green-50/50 rounded-r-lg px-3 py-2 hover:bg-green-50 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-medium text-admin-text text-sm">{a.serviceName}</div>
                                                    <div className="text-xs text-slate-500">{a.customerName} • {a.startAt.toDate().toLocaleString()}</div>
                                                </div>
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => handleChangeAppointmentStatus(a.id, e.target.value as Appointment['status'])}
                                                    className="text-xs rounded-lg border border-green-300 bg-white px-2 py-1 focus:border-green-500 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no-show">No-show</option>
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* Completed Appointments */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>Completed</span>
                                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                                            {appointments.filter(a => a.status === 'completed').length}
                                        </span>
                                    </div>
                                }
                                description="Successfully finished"
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {appointments.filter(a => a.status === 'completed').length === 0 ? (
                                        <div className="text-sm text-slate-400 text-center py-4">No completed appointments</div>
                                    ) : (
                                        appointments.filter(a => a.status === 'completed').map((a) => (
                                            <div key={a.id} className="flex items-center justify-between border-l-4 border-indigo-500 bg-indigo-50/50 rounded-r-lg px-3 py-2 hover:bg-indigo-50 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-medium text-admin-text text-sm">{a.serviceName}</div>
                                                    <div className="text-xs text-slate-500">{a.customerName} • {a.startAt.toDate().toLocaleString()}</div>
                                                </div>
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => handleChangeAppointmentStatus(a.id, e.target.value as Appointment['status'])}
                                                    className="text-xs rounded-lg border border-indigo-300 bg-white px-2 py-1 focus:border-indigo-500 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no-show">No-show</option>
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* Cancelled Appointments */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>Cancelled</span>
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                            {appointments.filter(a => a.status === 'cancelled').length}
                                        </span>
                                    </div>
                                }
                                description="Cancelled by patient or admin"
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {appointments.filter(a => a.status === 'cancelled').length === 0 ? (
                                        <div className="text-sm text-slate-400 text-center py-4">No cancelled appointments</div>
                                    ) : (
                                        appointments.filter(a => a.status === 'cancelled').map((a) => (
                                            <div key={a.id} className="flex items-center justify-between border-l-4 border-red-500 bg-red-50/50 rounded-r-lg px-3 py-2 hover:bg-red-50 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-medium text-admin-text text-sm">{a.serviceName}</div>
                                                    <div className="text-xs text-slate-500">{a.customerName} • {a.startAt.toDate().toLocaleString()}</div>
                                                </div>
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => handleChangeAppointmentStatus(a.id, e.target.value as Appointment['status'])}
                                                    className="text-xs rounded-lg border border-red-300 bg-white px-2 py-1 focus:border-red-500 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no-show">No-show</option>
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* No-Show Appointments */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span>No-Show</span>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                            {appointments.filter(a => a.status === 'no-show').length}
                                        </span>
                                    </div>
                                }
                                description="Patient did not attend"
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {appointments.filter(a => a.status === 'no-show').length === 0 ? (
                                        <div className="text-sm text-slate-400 text-center py-4">No no-show appointments</div>
                                    ) : (
                                        appointments.filter(a => a.status === 'no-show').map((a) => (
                                            <div key={a.id} className="flex items-center justify-between border-l-4 border-slate-500 bg-slate-50/50 rounded-r-lg px-3 py-2 hover:bg-slate-50 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-medium text-admin-text text-sm">{a.serviceName}</div>
                                                    <div className="text-xs text-slate-500">{a.customerName} • {a.startAt.toDate().toLocaleString()}</div>
                                                </div>
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => handleChangeAppointmentStatus(a.id, e.target.value as Appointment['status'])}
                                                    className="text-xs rounded-lg border border-slate-300 bg-white px-2 py-1 focus:border-slate-500 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="no-show">No-show</option>
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-6">
                        <IntakeFormBuilder />
                        <Card title="Booking Rules" description="Configure general booking constraints.">
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Max Bookings Per Slot</label>
                                        <input type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue={1} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Cut-off Time (hours before)</label>
                                        <input type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue={24} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-deep-forest" id="manual-confirm" />
                                    <label htmlFor="manual-confirm" className="text-sm text-slate-700">Require Manual Confirmation</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-deep-forest" id="advance-pay" />
                                    <label htmlFor="advance-pay" className="text-sm text-slate-700">Require Advance Payment</label>
                                </div>
                                <div className="flex justify-end">
                                    <Button>Save Rules</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Appointment Type">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-deep-forest focus:outline-none focus:ring-1 focus:ring-deep-forest"
                            placeholder="e.g. Initial Consultation"
                            value={newType.name}
                            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Duration (mins)</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-deep-forest focus:outline-none focus:ring-1 focus:ring-deep-forest"
                                value={newType.duration}
                                onChange={(e) => setNewType({ ...newType, duration: Number(e.target.value) })}
                            >
                                <option value={15}>15 mins</option>
                                <option value={30}>30 mins</option>
                                <option value={45}>45 mins</option>
                                <option value={60}>1 hour</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
                            <input
                                type="number"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-deep-forest focus:outline-none focus:ring-1 focus:ring-deep-forest"
                                value={newType.price}
                                onChange={(e) => setNewType({ ...newType, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={newType.type === "User"}
                                    onChange={() => setNewType({ ...newType, type: "User" })}
                                    className="text-deep-forest focus:ring-deep-forest"
                                />
                                <span className="text-sm">User Assigned</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={newType.type === "Resource"}
                                    onChange={() => setNewType({ ...newType, type: "Resource" })}
                                    className="text-deep-forest focus:ring-deep-forest"
                                />
                                <span className="text-sm">Resource Assigned</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="published-status"
                            className="h-4 w-4 rounded border-slate-300 text-deep-forest focus:ring-deep-forest"
                            checked={newType.status === "Published"}
                            onChange={(e) => setNewType({ ...newType, status: e.target.checked ? "Published" : "Unpublished" })}
                        />
                        <label htmlFor="published-status" className="text-sm font-medium text-slate-700">
                            Publish immediately
                        </label>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Pre-treatment Precautions</label>
                        <textarea
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-deep-forest focus:outline-none focus:ring-1 focus:ring-deep-forest"
                            placeholder="Instructions for patient before treatment..."
                            rows={3}
                            value={String(newType.prePrecautions || '')}
                            onChange={(e) => setNewType({ ...newType, prePrecautions: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Post-treatment Precautions</label>
                        <textarea
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-deep-forest focus:outline-none focus:ring-1 focus:ring-deep-forest"
                            placeholder="Instructions for patient after treatment..."
                            rows={3}
                            value={String(newType.postPrecautions || '')}
                            onChange={(e) => setNewType({ ...newType, postPrecautions: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <Button className="w-full" onClick={handleCreateType}>Create Appointment Type</Button>
                    </div>
                </div>
            </Modal>

            {/* Appointment Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedAppointment(null);
                }}
                title="Appointment Details"
            >
                {selectedAppointment && (
                    <div className="space-y-6">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-admin-text">{selectedAppointment.serviceName}</h3>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                selectedAppointment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        selectedAppointment.status === 'completed' ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-slate-100 text-slate-700'
                                }`}>
                                {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                            </span>
                        </div>

                        {/* Patient Information */}
                        <div className="bg-admin-bg rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-admin-text text-sm uppercase tracking-wide">Patient Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">Name</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.customerEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Phone</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.customerEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-admin-bg rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-admin-text text-sm uppercase tracking-wide">Appointment Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">Date & Time</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.startAt.toDate().toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Duration</p>
                                    <p className="text-sm font-medium text-admin-text">
                                        {Math.round((selectedAppointment.endAt.toDate().getTime() - selectedAppointment.startAt.toDate().getTime()) / 60000)} mins
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Doctor</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.doctorId || 'Not assigned'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Clinic</p>
                                    <p className="text-sm font-medium text-admin-text">{selectedAppointment.clinicId || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedAppointment.notes && (
                            <div className="bg-admin-bg rounded-lg p-4 space-y-2">
                                <h4 className="font-semibold text-admin-text text-sm uppercase tracking-wide">Notes</h4>
                                <p className="text-sm text-slate-600">{selectedAppointment.notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-admin-border">
                            <select
                                value={selectedAppointment.status}
                                onChange={(e) => {
                                    handleChangeAppointmentStatus(selectedAppointment.id, e.target.value as Appointment['status']);
                                    setIsDetailsModalOpen(false);
                                    setSelectedAppointment(null);
                                }}
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-admin-active focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                                <option value="no-show">No-show</option>
                            </select>
                            <Button
                                onClick={() => {
                                    setIsDetailsModalOpen(false);
                                    setSelectedAppointment(null);
                                }}
                                className="bg-slate-500 hover:bg-slate-600"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Appointments;
