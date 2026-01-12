import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, Clock, Users, DollarSign, Power, Calendar, Settings, MoreVertical, Check } from "lucide-react";

// Simple utility for joining classes
// @ts-ignore
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import ScheduleManager from "../components/appointments/ScheduleManager";
import IntakeFormBuilder from "../components/appointments/IntakeFormBuilder";
import CalendarView from "../components/appointments/CalendarView";
import BookingSettingsPanel from "../components/appointments/BookingSettingsPanel";
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
    // @ts-ignore
    const [loadingServices, setLoadingServices] = useState(false);
    // @ts-ignore
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    // @ts-ignore
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
        <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
            {/* Status Line */}
            <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${type.status === "Published" ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-slate-200"
                }`} />

            <div className="flex justify-between items-start mb-6 mt-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{type.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${type.status === "Published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${type.status === "Published" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {type.status}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-slate-50 p-1 rounded-lg">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Preview">
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onToggle}
                        className={`p-1.5 rounded-md transition-colors ${type.status === "Published" ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                        title={type.status === "Published" ? "Unpublish" : "Publish"}
                    >
                        <Power className="h-4 w-4" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</span>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span>{type.duration} mins</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Price</span>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span>${type.price}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-md">
                    <Users className="h-3.5 w-3.5" />
                    <span>{type.type} Assignment</span>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoadingServices(true);
            try {
                const services = await getAllServices();

                // CLEANUP: Automatically remove dummy services shown in screenshot
                const DUMMY_NAMES = ['kITKAT', 'Dental Care', 'Tennis Court', 'Abhyanga Snan', 'Abhyanga Therapy', 'Full Panchakarma Detox'];
                const dummyServices = services.filter(s => DUMMY_NAMES.includes(s.name));

                if (dummyServices.length > 0) {
                    console.log("Cleaning up dummy services...", dummyServices.length);
                    await Promise.all(dummyServices.map(s => deleteService(s.id)));
                }

                if (!mounted) return;

                // Filter out deleted services from display
                const validServices = services.filter(s => !DUMMY_NAMES.includes(s.name));

                const mapped: AppointmentType[] = validServices.map((s) => ({
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
            <div className="space-y-6 pb-8">
                {/* Premium Gradient Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                                Service & Appointment Configuration
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Manage services, schedules, and booking settings</p>
                        </div>
                        {activeTab === "services" && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-200 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                Create New Type
                            </button>
                        )}
                    </div>
                </div>

                {/* Pill-Style Tabs */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200 shadow-sm sticky top-4 z-10 mx-auto max-w-4xl">
                    <nav className="flex items-center justify-center gap-2">
                        {[
                            { id: "services", label: "Services & Types", icon: Users },
                            { id: "availability", label: "Availability & Hours", icon: Clock },
                            { id: "calendar", label: "Calendar View", icon: Calendar },
                            { id: "settings", label: "Booking Settings", icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#1C4E46] to-[#0F766E] text-white shadow-lg shadow-teal-500/20 scale-105"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
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

                            {/* Appointment Status Board */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                {[
                                    { id: 'pending', label: 'Pending Request', color: 'amber', icon: Clock },
                                    { id: 'confirmed', label: 'Confirmed', color: 'emerald', icon: Check },
                                    { id: 'completed', label: 'Completed', color: 'blue', icon: Calendar },
                                    { id: 'cancelled', label: 'Cancelled', color: 'red', icon: Trash2 },
                                    { id: 'no-show', label: 'No Show', color: 'slate', icon: Eye }
                                ].map((status) => {
                                    const filtered = appointments.filter(a => a.status === status.id);
                                    // Dynamic color classes based on status color
                                    const colors: Record<string, { bg: string, border: string, text: string, icon: string }> = {
                                        amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-500" },
                                        emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500" },
                                        blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-500" },
                                        red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500" },
                                        slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", icon: "text-slate-500" }
                                    };

                                    const style = colors[status.color] || colors.slate;
                                    const bgClass = style.bg;
                                    const borderClass = style.border;
                                    const textClass = style.text;
                                    const iconClass = style.icon;

                                    return (
                                        <div key={status.id} className={`rounded-2xl border ${borderClass} ${bgClass} p-5 transition-all duration-300 hover:shadow-md`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-lg bg-white/60 ${textClass}`}>
                                                        <status.icon className={`h-5 w-5 ${iconClass}`} />
                                                    </div>
                                                    <h3 className={`font-bold text-lg ${textClass}`}>{status.label}</h3>
                                                </div>
                                                <span className={`bg-white/60 px-3 py-1 rounded-full text-sm font-bold ${textClass} border border-white/50 shadow-sm`}>
                                                    {filtered.length}
                                                </span>
                                            </div>

                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {filtered.length === 0 ? (
                                                    <div className={`text-center py-8 rounded-xl border border-dashed ${borderClass} bg-white/30 text-slate-400 text-sm`}>
                                                        No {status.id} appointments
                                                    </div>
                                                ) : (
                                                    filtered.map((a) => (
                                                        <div
                                                            key={a.id}
                                                            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                                                            onClick={() => {
                                                                setSelectedAppointment(a);
                                                                setIsDetailsModalOpen(true);
                                                            }}
                                                        >
                                                            <div className={`absolute top-0 left-0 w-1 h-full ${bgClass.replace('50', '500')}`}></div>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{a.serviceName}</div>
                                                                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                                                        <Users className="h-3 w-3" /> {a.customerName}
                                                                    </div>
                                                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" /> {a.startAt.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                                <button className="text-slate-300 hover:text-slate-500">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6">
                            <IntakeFormBuilder />
                            <BookingSettingsPanel />
                        </div>
                    )}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Service">
                    <div className="space-y-5">
                        <div className="group">
                            <label className="mb-2 block text-sm font-semibold text-slate-700 group-focus-within:text-emerald-600 transition-colors">
                                Service Name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none placeholder:text-slate-400"
                                placeholder="e.g. Ayurvedic Consultation"
                                value={newType.name}
                                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="group">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 group-focus-within:text-emerald-600 transition-colors">
                                    Duration
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select
                                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-slate-700 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none appearance-none"
                                        value={newType.duration}
                                        onChange={(e) => setNewType({ ...newType, duration: Number(e.target.value) })}
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>1 hour</option>
                                        <option value={90}>1.5 hours</option>
                                        <option value={120}>2 hours</option>
                                    </select>
                                </div>
                            </div>
                            <div className="group">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 group-focus-within:text-emerald-600 transition-colors">
                                    Price
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-slate-700 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none placeholder:text-slate-400"
                                        value={newType.price}
                                        onChange={(e) => setNewType({ ...newType, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-700">Assignment Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${newType.type === "User"
                                    ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        className="sr-only"
                                        checked={newType.type === "User"}
                                        onChange={() => setNewType({ ...newType, type: "User" })}
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-full p-2 ${newType.type === "User" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${newType.type === "User" ? "text-emerald-900" : "text-slate-700"}`}>User Assigned</p>
                                            <p className="text-xs text-slate-500">Specific staff member</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${newType.type === "Resource"
                                    ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        className="sr-only"
                                        checked={newType.type === "Resource"}
                                        onChange={() => setNewType({ ...newType, type: "Resource" })}
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-full p-2 ${newType.type === "Resource" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                            <Settings className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${newType.type === "Resource" ? "text-emerald-900" : "text-slate-700"}`}>Resource Based</p>
                                            <p className="text-xs text-slate-500">Room or equipment</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <label htmlFor="published-status" className="relative flex h-6 w-11 items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="published-status"
                                    className="peer h-0 w-0 opacity-0"
                                    checked={newType.status === "Published"}
                                    onChange={(e) => setNewType({ ...newType, status: e.target.checked ? "Published" : "Unpublished" })}
                                />
                                <span className="absolute left-0 top-0 h-6 w-11 cursor-pointer rounded-full bg-slate-200 transition-colors duration-300 ease-in-out peer-checked:bg-emerald-500"></span>
                                <span className="absolute left-[2px] top-[2px] h-5 w-5 translate-x-0 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                            </label>
                            <label htmlFor="published-status" className="cursor-pointer">
                                <p className="text-sm font-semibold text-slate-700">Publish Immediately</p>
                                <p className="text-xs text-slate-500">Service will be visible for booking</p>
                            </label>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="group">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Pre-treatment Instructions</label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none placeholder:text-slate-400 min-h-[80px]"
                                    placeholder="e.g. Do not eat 2 hours before..."
                                    value={String(newType.prePrecautions || '')}
                                    onChange={(e) => setNewType({ ...newType, prePrecautions: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Post-treatment Instructions</label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none placeholder:text-slate-400 min-h-[80px]"
                                    placeholder="e.g. Drink plenty of water..."
                                    value={String(newType.postPrecautions || '')}
                                    onChange={(e) => setNewType({ ...newType, postPrecautions: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transform transition-all active:scale-[0.98]"
                                onClick={handleCreateType}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Create Service Type
                            </Button>
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
                                        <p className="text-sm font-medium text-admin-text">{/* @ts-ignore */}
                                            {selectedAppointment.doctorId || 'Not assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Clinic</p>
                                        <p className="text-sm font-medium text-admin-text">{/* @ts-ignore */}
                                            {selectedAppointment.clinicId || 'N/A'}
                                        </p>
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
        </div>
    );
};

export default Appointments;
