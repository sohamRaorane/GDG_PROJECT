import { useEffect, useState } from 'react';
import { Search, Sparkles, Clock, IndianRupee } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAllServices, servicesCollection } from '../../../services/db';
import type { Service } from '../../../types/db';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { seedTreatmentRooms } from '../../../services/seedRooms';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

// Textures
// Textures
// Texture imports removed as they were unsed after removing hardcoded data

import oilTexture from '../../../assets/textures/oil_massage.png';

const SERVICE_IMAGES: Record<string, string> = {
    nasya: '/nasya_therapy.png',
    snehapan: oilTexture,
    abhyang: '/abhyanga_therapy.jpg',
    swedan: '/swedan_therapy.jpg',
    shirodhara: '/shirodhara_therapy.webp',
    virechan: '/virechan_therapy.jpg',
    vasti: '/vasti_therapy.jpg'
};

const DEFAULT_WORKING_HOURS = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isAvailable: false },
] as any[]; // casting to any to match strict type if needed, or better define it properly.

const DEFAULT_SERVICES: Partial<Service>[] = [
    {
        id: 'nasya',
        name: 'Nasya',
        price: 800,
        description: 'Administration of herbal oils through the nasal passage for head ailments.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'snehapan',
        name: 'Snehapan',
        price: 1200,
        description: 'Internal oleation therapy with medicated ghee for deep tissue nourishment.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'abhyang',
        name: 'Abhyang',
        price: 1500,
        description: 'Full body massage with warm medicated herbal oils to improve circulation.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'swedan',
        name: 'Swedan',
        price: 1000,
        description: 'Herbal steam therapy to open channels and eliminate toxins.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'shirodhara',
        name: 'Shirodhara',
        price: 2200,
        description: 'Continuous pouring of warm medicated oil on the forehead to relieve stress.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'virechan',
        name: 'Virechan',
        price: 2800,
        description: 'Therapeutic purgation to eliminate excess Pitta dosha.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    },
    {
        id: 'vasti',
        name: 'Vasti',
        price: 1200,
        description: 'Medicated enema therapy to eliminate toxins and balance Vata dosha.',
        type: 'Paid',
        durationMinutes: 60,
        isActive: true,
        currency: 'INR',
        providerId: 'admin',
        workingHours: DEFAULT_WORKING_HOURS,
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 2, requiresManualConfirmation: false }
    }
];

interface SelectServiceProps {
    selectedServiceId: string;
    onSelect: (serviceId: string) => void;
}

export const SelectService = ({ selectedServiceId, onSelect }: SelectServiceProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Free' | 'Paid'>('All');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingService, setViewingService] = useState<Service | null>(null);

    useEffect(() => {
        // Seed rooms on first load to ensure availability logic works
        console.log("Starting Room Seeding...");
        seedTreatmentRooms().then(success => {
            console.log("Room Seeding Finished. Success:", success);
        });

        const fetchServices = async () => {
            try {
                const fetchedServices = await getAllServices();
                const existingIds = new Set(fetchedServices.map(s => s.id));
                const servicesToCreate = DEFAULT_SERVICES.filter(ds => ds.id && !existingIds.has(ds.id));

                if (servicesToCreate.length > 0) {
                    const newServices: Service[] = [];
                    for (const serviceToCreate of servicesToCreate) {
                        const newService: Service = {
                            ...serviceToCreate,
                            createdAt: Timestamp.now(),
                            updatedAt: Timestamp.now()
                        } as Service;
                        await setDoc(doc(servicesCollection, serviceToCreate.id), newService);
                        newServices.push(newService);
                    }
                    setServices([...fetchedServices, ...newServices]);
                } else {
                    setServices(fetchedServices);
                }
            } catch (error) {
                console.error("Error fetching/seeding services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || service.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Curating your therapies...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header: Search & Filter */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="relative w-full md:w-2/3 lg:w-1/2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search for a healing treatment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-amber-900/10 focus:border-amber-600/30 focus:bg-white focus:ring-4 focus:ring-amber-600/5 outline-none transition-all text-amber-900 font-serif shadow-sm placeholder:text-amber-900/30 placeholder:italic"
                    />
                </div>

                <div className="flex bg-white p-1.5 rounded-full border border-amber-900/10 shadow-sm self-stretch md:self-auto gap-1">
                    {['All', 'Free', 'Paid'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={cn(
                                "px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                filterType === type
                                    ? "bg-amber-100 text-amber-800 shadow-sm"
                                    : "text-amber-900/40 hover:bg-amber-50 hover:text-amber-900"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredServices.map((service) => (
                    <div
                        key={service.id}
                        className={cn(
                            "group rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col relative bg-white h-full",
                            selectedServiceId === service.id
                                ? "border-amber-500 shadow-2xl shadow-amber-900/10 -translate-y-2 ring-4 ring-amber-100"
                                : "border-amber-900/5 shadow-sm hover:border-amber-900/20 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1"
                        )}
                    >
                        {/* Image Header */}
                        <div className="h-56 relative overflow-hidden bg-amber-50">
                            <img
                                src={SERVICE_IMAGES[service.id] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"}
                                alt={service.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                            {selectedServiceId === service.id && (
                                <div className="absolute top-4 right-4 bg-amber-600 text-white p-2.5 rounded-full shadow-lg animate-in zoom-in-50 duration-300">
                                    <Sparkles size={18} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-display font-bold text-2xl text-amber-950 mb-1 italic group-hover:text-amber-700 transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-amber-700 font-bold font-serif">
                                        <IndianRupee size={14} />
                                        <span className="text-lg">{service.price}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold border",
                                    service.type === 'Free' ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-800 border-amber-100"
                                )}>
                                    {service.type}
                                </span>
                            </div>

                            <p className="text-amber-900/60 text-sm leading-relaxed mb-8 font-serif">
                                {service.intro || service.description}
                            </p>

                            <div className="mt-auto space-y-6">
                                <div className="flex items-center gap-3 text-amber-900/40 border-t border-amber-900/5 pt-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 text-amber-700">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight uppercase">{service.durationMinutes} mins Session</span>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingService(service);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-xl border border-amber-600 text-amber-900 font-bold text-sm bg-amber-50/50 hover:bg-amber-100 transition-colors"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(service.id);
                                        }}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md",
                                            selectedServiceId === service.id
                                                ? "bg-amber-800 text-white shadow-amber-900/20 ring-2 ring-amber-800 ring-offset-2"
                                                : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20"
                                        )}
                                    >
                                        {selectedServiceId === service.id ? "Selected" : "Book Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Modal */}
            <Modal isOpen={!!viewingService} onClose={() => setViewingService(null)}>
                {viewingService && (
                    <div className="space-y-6">
                        <div className="relative h-56 -mx-6 -mt-6 mb-6">
                            <img
                                src={SERVICE_IMAGES[viewingService.id] || ""}
                                alt={viewingService.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <h2 className="absolute bottom-6 left-8 text-3xl font-serif font-bold text-white drop-shadow-md">
                                {viewingService.name}
                            </h2>
                        </div>

                        <div className="space-y-4 px-2">
                            <p className="text-amber-900/80 font-body leading-relaxed text-lg">
                                {viewingService.description}
                            </p>
                            
                            {/* Additional details to match Services modal look */}
                             <div className="flex items-center justify-between text-sm py-4 border-t border-amber-100 mt-4">
                                <div>
                                    <span className="text-amber-900/50">Duration:</span>
                                    <span className="ml-2 font-medium text-amber-900">{viewingService.durationMinutes} mins</span>
                                </div>
                                <div>
                                    <span className="text-amber-900/50">Price:</span>
                                    <span className="ml-2 font-bold text-amber-700 text-lg">₹ {viewingService.price}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-amber-200 text-amber-800 hover:bg-amber-50"
                                    onClick={() => setViewingService(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-orange-900/20"
                                    onClick={() => {
                                        onSelect(viewingService.id);
                                        setViewingService(null);
                                    }}
                                >
                                    Select This Therapy
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
