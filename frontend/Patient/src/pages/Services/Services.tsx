import { useState } from 'react';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { OrbitalTherapies } from '../../components/OrbitalTherapies';

// Import images
import shirodharaTexture from '../../assets/textures/shirodhara.png';
import panchakarmaTexture from '../../assets/textures/panchakarma.png';
import ayurvedaBg from '../../assets/ayurveda_bg.png';

interface Service {
    id: string;
    name: string;
    description: string;
    detailedDescription: string;
    duration: string;
    price: string;
    image: string;
    tags: string[];
    features: string[];
    intensity: 1 | 2 | 3;
    recommended?: boolean;
}

const ADDITIONAL_SERVICES: Service[] = [];

const IntensityDots = ({ level }: { level: number }) => (
    <div className="flex gap-1" title={`Intensity: ${level === 1 ? 'Mild' : level === 2 ? 'Moderate' : 'Intense'}`}>
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className={cn(
                    "w-2 h-2 rounded-full",
                    i <= level ? "bg-primary" : "bg-gray-200"
                )}
            />
        ))}
    </div>
);

export const Services = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 h-full w-full">
                <img src={ayurvedaBg} alt="Background" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background/20 to-background/50 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-8 text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl font-display font-bold text-amber-900 mb-4">Our Ayurvedic Therapies</h1>
                        <p className="text-gray-600 font-serif text-xl">
                            Experience authentic healing through time-tested Ayurvedic treatments designed to restore balance and harmony.
                        </p>
                    </div>
                </div>

                {/* Orbital Therapies Section */}
                <OrbitalTherapies />

                {/* Additional Services Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-display font-bold text-amber-900 mb-4">Featured Treatments</h2>
                        <p className="text-gray-600 font-serif text-lg">
                            Specialized programs for comprehensive wellness
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {ADDITIONAL_SERVICES.map((service) => (
                            <div
                                key={service.id}
                                className={cn(
                                    "group bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden",
                                    service.recommended
                                        ? "border-amber-400 shadow-lg ring-2 ring-amber-300"
                                        : "border-slate-200 hover:shadow-xl hover:-translate-y-1"
                                )}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="relative overflow-hidden h-56 w-full">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {service.recommended && (
                                            <div className="absolute top-4 left-4 z-20 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                RECOMMENDED
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-2xl font-serif font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                                                    {service.name}
                                                </h2>
                                                <span className="font-bold text-lg text-amber-700">{service.price}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {service.tags.map(tag => (
                                                    <span key={tag} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed mb-4 font-body">
                                                {service.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{service.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs uppercase tracking-wider">Intensity</span>
                                                    <IntensityDots level={service.intensity} />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-amber-600 text-amber-900 hover:bg-amber-50"
                                                    onClick={() => setSelectedService(service)}
                                                >
                                                    Details
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                                                    onClick={() => navigate('/book')}
                                                >
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Modal */}
                <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)}>
                    {selectedService && (
                        <div className="space-y-6">
                            <div className="relative h-48 -mx-6 -mt-6 mb-6">
                                <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <h2 className="absolute bottom-4 left-6 text-3xl font-serif font-bold text-white">
                                    {selectedService.name}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700 font-body leading-relaxed">
                                    {selectedService.detailedDescription}
                                </p>

                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-amber-600" />
                                        Key Benefits
                                    </h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedService.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between text-sm py-2">
                                    <div>
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="ml-2 font-medium text-gray-900">{selectedService.duration}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Price:</span>
                                        <span className="ml-2 font-bold text-amber-700 text-lg">{selectedService.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedService(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="flex-1 group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                    onClick={() => {
                                        setSelectedService(null);
                                        navigate('/book');
                                    }}
                                >
                                    Book Appointment
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};
