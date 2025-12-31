
import { Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Service {
    id: string;
    name: string;
    description: string;
    duration: string;
    price: string;
    imageColor: string;
    features: string[];
}

const SERVICES: Service[] = [
    {
        id: 'abhyanga',
        name: 'Abhyanga (Oil Massage)',
        description: 'Full body massage with warm medicated herbal oils to improve circulation and remove toxins.',
        duration: '60 Mins',
        price: '₹1,500',
        imageColor: 'bg-orange-100',
        features: ['Improves circulation', 'Relieves fatigue', 'Enhances sleep quality']
    },
    {
        id: 'shirodhara',
        name: 'Shirodhara',
        description: 'Continuous pouring of warm medicated oil on the forehead to relieve stress and improve sleep.',
        duration: '45 Mins',
        price: '₹2,200',
        imageColor: 'bg-blue-100',
        features: ['Relieves anxiety', 'Treats insomnia', 'Improves focus']
    },
    {
        id: 'nasya',
        name: 'Nasya',
        description: 'Administration of herbal oils through the nasal passage for head and neck ailments.',
        duration: '30 Mins',
        price: '₹800',
        imageColor: 'bg-green-100',
        features: ['Clears nasal passages', 'Relieves headaches', 'Improves sensory perception']
    },
    {
        id: 'panchakarma-full',
        name: 'Full Panchakarma Detox',
        description: 'A complete 7-day detoxification program personalized to your body type.',
        duration: '7 Days',
        price: '₹15,000',
        imageColor: 'bg-purple-100',
        features: ['Deep detoxification', 'Weight management', 'Rejuvenation']
    },
];

export const Services = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-text mb-4">Our Therapies</h1>
                <p className="text-gray-500 text-lg">
                    Discover our range of authentic Ayurvedic treatments designed to restore balance and harmony to your body and mind.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SERVICES.map((service) => (
                    <div key={service.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row h-full">
                            <div className={cn("w-full md:w-1/3 min-h-[200px] md:min-h-full flex items-center justify-center transition-colors", service.imageColor)}>
                                <span className="text-6xl opacity-20 font-display font-bold text-gray-900">
                                    {service.name.charAt(0)}
                                </span>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">{service.name}</h2>
                                        <span className="font-bold text-lg text-primary">{service.price}</span>
                                    </div>

                                    <p className="text-gray-600 mb-4">{service.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Clock size={16} />
                                        <span>{service.duration}</span>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle size={14} className="text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button
                                    className="w-full md:w-auto"
                                    onClick={() => navigate('/book')}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
