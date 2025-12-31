import { useState } from "react";
import { Plus, Link as LinkIcon, Eye, Trash2, Edit2, Clock, Users, DollarSign } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import ScheduleManager from "../components/appointments/ScheduleManager";
import IntakeFormBuilder from "../components/appointments/IntakeFormBuilder";
import CalendarView from "../components/appointments/CalendarView";

interface AppointmentType {
    id: number;
    name: string;
    duration: number; // minutes
    type: "User" | "Resource";
    price: number;
    status: "Published" | "Unpublished";
}

const Appointments = () => {
    const [activeTab, setActiveTab] = useState<"services" | "availability" | "calendar" | "settings">("services");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([
        { id: 1, name: "General Consultation", duration: 30, type: "User", price: 50, status: "Published" },
        { id: 2, name: "Ayurvedic Massage", duration: 60, type: "Resource", price: 120, status: "Unpublished" },
    ]);

    const [newType, setNewType] = useState<Partial<AppointmentType>>({
        name: "",
        duration: 30,
        type: "User",
        price: 0,
        status: "Unpublished"
    });

    const handleCreateType = () => {
        if (!newType.name) return;
        const type: AppointmentType = {
            id: Date.now(),
            name: newType.name,
            duration: newType.duration || 30,
            type: newType.type || "User",
            price: newType.price || 0,
            status: newType.status || "Unpublished",
        };
        setAppointmentTypes([...appointmentTypes, type]);
        setIsModalOpen(false);
        setNewType({ name: "", duration: 30, type: "User", price: 0, status: "Unpublished" });
    };

    const AppointmentTypeCard = ({ type }: { type: AppointmentType }) => (
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
                    <button className="text-slate-400 hover:text-medical-blue"><Edit2 className="h-4 w-4" /></button>
                    <button className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
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
                            <AppointmentTypeCard key={type.id} type={type} />
                        ))}
                    </div>
                )}

                {activeTab === "availability" && <ScheduleManager />}

                {activeTab === "calendar" && <CalendarView />}

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

                    <div className="pt-4">
                        <Button className="w-full" onClick={handleCreateType}>Create Appointment Type</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Appointments;
