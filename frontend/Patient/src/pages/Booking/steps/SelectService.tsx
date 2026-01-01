import { useEffect, useState } from 'react';
import { Search, MapPin, Users, Info } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAllServices, servicesCollection } from '../../../services/db';
import type { Service } from '../../../types/db';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

const DEFAULT_SERVICES: Partial<Service>[] = [
    {
        id: 'dental-care',
        name: 'Dental Care',
        type: 'Paid',
        users: ['Dr. A1', 'Dr. A2'],
        location: "Doctor's Office",
        resources: ['Chair 1', 'Chair 2'],
        intro: 'Comprehensive dental checkup and cleaning services.',
        imageColor: 'bg-orange-100',
        price: 50,
        currency: 'USD',
        description: 'Comprehensive dental checkup and cleaning services.',
        durationMinutes: 60,
        isActive: true,
        providerId: 'admin_1',
        workingHours: [],
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 24, requiresManualConfirmation: false }
    },
    {
        id: 'tennis-court',
        name: 'Tennis Court',
        type: 'Free',
        users: [],
        location: 'Tennis Court',
        resources: ['Court A', 'Court B'],
        intro: 'Book a slot for a recreational tennis match.',
        imageColor: 'bg-green-100',
        price: 0,
        currency: 'USD',
        description: 'Book a slot for a recreational tennis match.',
        durationMinutes: 60,
        isActive: true,
        providerId: 'admin_1',
        workingHours: [],
        bookingRules: { maxAdvanceBookingDays: 14, minAdvanceBookingHours: 1, requiresManualConfirmation: false }
    },
    {
        id: 'abhyanga',
        name: 'Abhyanga Therapy',
        type: 'Paid',
        users: ['Therapist A1'],
        location: 'Room 101',
        resources: ['Message Table'],
        intro: 'Traditional Ayurvedic oil massage for relaxation.',
        imageColor: 'bg-blue-100',
        price: 120,
        currency: 'USD',
        description: 'Traditional Ayurvedic oil massage for relaxation.',
        durationMinutes: 90,
        isActive: true,
        providerId: 'admin_1',
        workingHours: [],
        bookingRules: { maxAdvanceBookingDays: 30, minAdvanceBookingHours: 48, requiresManualConfirmation: true }
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

                // Check if our default/demo services are present
                const existingIds = new Set(fetchedServices.map(s => s.id));
                const servicesToCreate = DEFAULT_SERVICES.filter(ds => ds.id && !existingIds.has(ds.id));

                if (servicesToCreate.length > 0) {
                    console.log(`Creating ${servicesToCreate.length} missing default services...`);

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

                    // Update local state with both existing and newly created services
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
        return <div className="text-center py-10">Loading services...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header: Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                {/* Search */}
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2 border border-primary/20 rounded-lg p-1 bg-primary/5">
                    {['Free', 'Paid'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(prev => prev === type ? 'All' : type as 'Free' | 'Paid')}
                            className={cn(
                                "px-6 py-1.5 rounded-md text-sm font-medium transition-all",
                                filterType === type
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-primary hover:bg-white/50"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => onSelect(service.id)}
                        className={cn(
                            "group cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden hover:shadow-md",
                            selectedServiceId === service.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-200 bg-white hover:border-primary/50"
                        )}
                    >
                        <div className="p-5 flex gap-5">
                            {/* Picture Box */}
                            <div className={cn("w-32 h-32 shrink-0 rounded-lg flex items-center justify-center text-primary/40 font-bold bg-opacity-20", service.imageColor || 'bg-gray-100')}>
                                Picture
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-display font-bold text-lg text-text group-hover:text-primary transition-colors">
                                        {service.name}
                                    </h3>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-medium",
                                        service.type === 'Free' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                    )}>
                                        {service.type}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-sm text-gray-500">
                                    {service.users && service.users.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Users size={14} className="mt-0.5 shrink-0" />
                                            <span>
                                                <span className="font-medium text-gray-700">Users:</span> {service.users.join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="mt-0.5 shrink-0" />
                                        <span>
                                            <span className="font-medium text-gray-700">Location:</span> {service.location || 'N/A'}
                                        </span>
                                    </div>
                                    {service.resources && service.resources.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Info size={14} className="mt-0.5 shrink-0" />
                                            <span>
                                                <span className="font-medium text-gray-700">Resource:</span> {service.resources.join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Introduction Message - Footer */}
                        <div className="px-5 pb-4">
                            <p className="text-sm text-gray-500 italic border-l-2 border-primary/30 pl-3">
                                "{service.intro || service.description}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
