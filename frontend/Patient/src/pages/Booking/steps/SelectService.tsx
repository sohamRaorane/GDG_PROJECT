import { useEffect, useState } from 'react';
import { Search, Sparkles, Clock, IndianRupee } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAllServices, servicesCollection } from '../../../services/db';
import type { Service } from '../../../types/db';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { seedTreatmentRooms } from '../../../services/seedRooms';

// Textures
import oilTexture from '../../../assets/textures/oil_massage.png';
import shirodharaTexture from '../../../assets/textures/shirodhara.png';
import herbsTexture from '../../../assets/textures/herbs.png';
import panchakarmaTexture from '../../../assets/textures/panchakarma.png';

const SERVICE_IMAGES: Record<string, string> = {
    'dental-care': shirodharaTexture,
    'tennis-court': herbsTexture,
    'abhyanga': oilTexture,
    'panchakarma-full': panchakarmaTexture
};

const DEFAULT_SERVICES: Partial<Service>[] = [
    {
        id: 'abhyanga',
        name: 'Abhyanga Therapy',
        type: 'Paid',
        users: ['Therapist A1'],
        location: 'Room 101',
        resources: ['Massage Table'],
        intro: 'Traditional Ayurvedic oil massage for relaxation.',
        price: 1500,
        currency: 'INR',
        description: 'Traditional Ayurvedic oil massage for relaxation.',
        durationMinutes: 90,
        isActive: true,
        providerId: 'admin_1',
        workingHours: [],
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 48, requiresManualConfirmation: true }
    },
    {
        id: 'panchakarma-full',
        name: 'Full Panchakarma Detox',
        type: 'Paid',
        users: ['Dr. Sharma'],
        location: 'Wellness Wing',
        resources: ['Panchakarma Lounge'],
        intro: '7-day deep detoxification program.',
        price: 15000,
        currency: 'INR',
        description: 'The ultimate Ayurvedic rejuvenation program.',
        durationMinutes: 120,
        isActive: true,
        providerId: 'admin_1',
        workingHours: [],
        bookingRules: { maxAdvanceBookingDays: 60, minAdvanceBookingHours: 72, requiresManualConfirmation: true }
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
                        className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-primary/10 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-text font-serif shadow-sm placeholder:text-text/30 placeholder:italic"
                    />
                </div>

                <div className="flex bg-white p-1.5 rounded-full border border-primary/10 shadow-sm self-stretch md:self-auto gap-1">
                    {['All', 'Free', 'Paid'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={cn(
                                "px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                filterType === type
                                    ? "bg-secondary text-primary shadow-sm"
                                    : "text-text/50 hover:bg-secondary/20 hover:text-text"
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
                        onClick={() => onSelect(service.id)}
                        className={cn(
                            "group cursor-pointer rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col relative bg-white",
                            selectedServiceId === service.id
                                ? "border-primary/30 shadow-2xl shadow-primary/10 -translate-y-2"
                                : "border-primary/5 shadow-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                        )}
                    >
                        {/* Image Header */}
                        <div className="h-56 relative overflow-hidden">
                            <img
                                src={SERVICE_IMAGES[service.id] || shirodharaTexture}
                                alt={service.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                            {selectedServiceId === service.id && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary p-2.5 rounded-full shadow-lg animate-in zoom-in-50 duration-300">
                                    <Sparkles size={18} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-display font-medium text-2xl text-text mb-1 italic group-hover:text-primary transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-primary/80 font-bold font-serif">
                                        <IndianRupee size={14} />
                                        <span className="text-lg">{service.price}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold border",
                                    service.type === 'Free' ? "bg-green-50 text-green-700 border-green-100" : "bg-secondary/30 text-primary border-secondary/50"
                                )}>
                                    {service.type}
                                </span>
                            </div>

                            <p className="text-text/60 text-sm leading-relaxed mb-8 line-clamp-2 font-serif">
                                {service.intro || service.description}
                            </p>

                            <div className="mt-auto grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-text/50">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 text-primary">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight uppercase">{service.durationMinutes} mins</span>
                                </div>
                            </div>
                        </div>

                        {selectedServiceId === service.id && (
                            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
