import { useState } from 'react';
import { Clock, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

// Import images
import oilTexture from '../../assets/textures/oil_massage.png';
import shirodharaTexture from '../../assets/textures/shirodhara.png';
import herbsTexture from '../../assets/textures/herbs.png';
import panchakarmaTexture from '../../assets/textures/panchakarma.png';

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
    intensity: 1 | 2 | 3; // 1: Mild, 2: Moderate, 3: Intense
    recommended?: boolean;
}

const SERVICES: Service[] = [
    {
        id: 'abhyanga',
        name: 'Abhyanga',
        description: 'Full body massage with warm medicated herbal oils to improve circulation.',
        detailedDescription: 'Abhyanga is a traditional Ayurvedic therapy that involves a full-body massage using warm, herb-infused oils tailored to your dosha. It aids in detoxification, improves skin health, reduces muscle stiffness, and promotes deep relaxation.',
        duration: '60 Mins',
        price: '₹1,500',
        image: oilTexture,
        tags: ['Stress Relief', 'Circulation', 'Relaxation'],
        features: ['Improves circulation', 'Relieves fatigue', 'Enhances sleep quality'],
        intensity: 2
    },
    {
        id: 'shirodhara',
        name: 'Shirodhara',
        description: 'Continuous pouring of warm medicated oil on the forehead to relieve stress.',
        detailedDescription: 'Shirodhara involves a continuous, rhythmic pouring of warm herbal oil over the forehead (the "third eye"). This therapy is deeply meditative and is highly effective for treating anxiety, insomnia, migraines, and enhancing mental clarity.',
        duration: '45 Mins',
        price: '₹2,200',
        image: shirodharaTexture,
        tags: ['Mental Health', 'Insomnia', 'Focus'],
        features: ['Relieves anxiety', 'Treats insomnia', 'Improves focus'],
        intensity: 1
    },
    {
        id: 'nasya',
        name: 'Nasya',
        description: 'Administration of herbal oils through the nasal passage for head ailments.',
        detailedDescription: 'Nasya is the administration of medicated oil or powder through the nostrils. It clears the head and neck channels, making it effective for sinus congestion, headaches, allergies, and improving sensory perception.',
        duration: '30 Mins',
        price: '₹800',
        image: herbsTexture,
        tags: ['Detox', 'Sinus Relief', 'Headache'],
        features: ['Clears nasal passages', 'Relieves headaches', 'Improves sensory perception'],
        intensity: 2
    },
    {
        id: 'panchakarma-full',
        name: 'Full Panchakarma Detox',
        description: 'A complete 7-day detoxification program personalized to your body type.',
        detailedDescription: 'Panchakarma is the ultimate Ayurvedic detoxification and rejuvenation program. Over 7 days, you will undergo a series of five therapies ("Pancha Karma") designed to purge toxins from the deep tissues, reset your digestion, and restore your body’s natural balance.',
        duration: '7 Days',
        price: '₹15,000',
        image: panchakarmaTexture,
        tags: ['Deep Detox', 'Weight Loss', 'Rejuvenation', 'Holistic'],
        features: ['Deep detoxification', 'Weight management', 'Rejuvenation', 'Dosha balance'],
        intensity: 3,
        recommended: true
    },
];

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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-text mb-4">Our Therapies</h1>
                <p className="text-gray-500 font-serif text-lg">
                    Discover our range of authentic Ayurvedic treatments designed to restore balance and harmony.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SERVICES.map((service) => (
                    <div
                        key={service.id}
                        className={cn(
                            "group bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden",
                            service.recommended
                                ? "md:col-span-2 lg:col-span-2 border-primary/30 shadow-md ring-1 ring-primary/20"
                                : "border-slate-200 hover:shadow-xl hover:-translate-y-1"
                        )}
                    >
                        <div className={cn("flex flex-col h-full", service.recommended ? "md:flex-row" : "")}>
                            {/* Image Section */}
                            <div className={cn(
                                "relative overflow-hidden",
                                service.recommended ? "w-full md:w-2/5 h-64 md:h-auto" : "h-56 w-full"
                            )}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {service.recommended && (
                                    <div className="absolute top-4 left-4 z-20 bg-secondary/90 backdrop-blur-md text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/10 shadow-sm">
                                        RECOMMENDED
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-serif font-bold text-text group-hover:text-primary transition-colors">
                                            {service.name}
                                        </h2>
                                        <span className="font-bold text-lg text-primary">{service.price}</span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {service.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full border border-stone-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 font-body">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Features & Details */}
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
                                            className="flex-1 border-stone-300 text-stone-600 hover:bg-stone-50"
                                            onClick={() => setSelectedService(service)}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            className="flex-1 bg-primary text-white hover:bg-primary/90"
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

                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-primary" />
                                    Key Benefits
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {selectedService.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
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
                                    <span className="ml-2 font-bold text-primary text-lg">{selectedService.price}</span>
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
                                className="flex-1 group"
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
    );
};
