import { useEffect, useState } from 'react';
import { Search, MapPin, Users, Info, Sparkles, Clock, IndianRupee } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAllServices, servicesCollection } from '../../../services/db';
import type { Service } from '../../../types/db';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

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

export const SelectService: React.FC<SelectServiceProps> = ({ selectedServiceId, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Free' | 'Paid'>('All');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndSeedServices = async () => {
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
        fetchAndSeedServices();
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search for a healing treatment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all text-slate-700 shadow-inner"
                    />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-sm self-stretch md:self-auto">
                    {['All', 'Free', 'Paid'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={cn(
                                "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                filterType === type
                                    ? "bg-white text-primary shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
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
                            "group cursor-pointer rounded-[2rem] border-2 transition-all duration-500 overflow-hidden flex flex-col relative",
                            selectedServiceId === service.id
                                ? "border-primary bg-secondary/20 shadow-2xl shadow-primary/10 -translate-y-2"
                                : "border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
                        )}
                    >
                        {/* Image Header */}
                        <div className="h-48 relative overflow-hidden">
                            <img
                                src={SERVICE_IMAGES[service.id] || shirodharaTexture}
                                alt={service.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            {selectedServiceId === service.id && (
                                <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg animate-in zoom-in-50 duration-300">
                                    <Sparkles size={16} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-display font-bold text-2xl text-text mb-1 italic">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <IndianRupee size={16} />
                                        <span>{service.price}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold",
                                    service.type === 'Free' ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                                )}>
                                    {service.type}
                                </span>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                {service.intro || service.description}
                            </p>

                            <div className="mt-auto grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight">{service.durationMinutes} mins</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight truncate">{service.location || 'Wellness Ctr'}</span>
                                </div>
                            </div>
                        </div>

                        {selectedServiceId === service.id && (
                            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
