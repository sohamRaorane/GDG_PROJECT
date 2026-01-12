import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';

// Import existing images
import oilTexture from '../assets/textures/oil_massage.png';

interface Therapy {
    id: string;
    name: string;
    image: string;
    price: string;
    description: string;
    detailedDescription?: string;
    benefits?: string[];
    angle: number;
}

const THERAPIES: Therapy[] = [
    {
        id: 'nasya',
        name: 'Nasya',
        image: '/nasya_therapy.png',
        price: 'Rs. 800',
        description: 'Administration of herbal oils through the nasal passage for head ailments.',
        detailedDescription: 'Nasya involves the controlled administration of medicated oils or powders through the nostrils. It clears the head region, improves voice quality, and is highly effective for sinus congestion, migraines, and neck stiffness.',
        benefits: ['Clears sinus congestion', 'Relieves headaches & migraines', 'Improves voice quality', 'Enhances mental clarity'],
        angle: 0
    },
    {
        id: 'snehapan',
        name: 'Snehapan',
        image: oilTexture,
        price: 'Rs. 1,200',
        description: 'Internal oleation therapy with medicated ghee for deep tissue nourishment.',
        detailedDescription: 'Snehapan is a preparatory procedure where medicated ghee is consumed in increasing doses. This internal oleation lubricates body channels, loosens toxins, and prepares the body for main detox treatments like Vamana or Virechana.',
        benefits: ['Lubricates body channels', 'Loosens deep-seated toxins', 'Improves digestive fire', 'Nourishes internal organs'],
        angle: 51.43
    },
    {
        id: 'abhyang',
        name: 'Abhyang',
        image: '/abhyanga_therapy.jpg',
        price: 'Rs. 1,500',
        description: 'Full body massage with warm medicated herbal oils to improve circulation.',
        detailedDescription: 'Abhyanga is a traditional synchronized full-body massage using warm herbal oils. It is designed to deeply penetrate the skin, relax muscles, improve lymphatic drainage, and restore energy flow throughout the body.',
        benefits: ['Relieves muscle fatigue', 'Improves blood circulation', 'Promotes deep sleep', 'Anti-aging effects on skin'],
        angle: 102.86
    },
    {
        id: 'swedan',
        name: 'Swedan',
        image: '/swedan_therapy.jpg',
        price: 'Rs. 1,000',
        description: 'Herbal steam therapy to open channels and eliminate toxins.',
        detailedDescription: 'Swedan is a therapeutic herbal steam bath that induces sweating. It dilates the channels of the body (srotas), allowing liquefied toxins (ama) to move towards the digestive tract for elimination. It is excellent for stiffness and pain.',
        benefits: ['Eliminates toxins through sweat', 'Relieves joint stiffness', 'Reduces body aches', 'Improves skin texture'],
        angle: 154.29
    },
    {
        id: 'shirodhara',
        name: 'Shirodhara',
        image: '/shirodhara_therapy.webp',
        price: 'Rs. 2,200',
        description: 'Continuous pouring of warm medicated oil on the forehead to relieve stress.',
        detailedDescription: 'Shirodhara involves gently pouring liquids over the forehead (the third eye). The name comes from "Shiro" (head) and "Dhara" (flow). It creates a profound state of relaxation and is a premier treatment for mental stress and neurological conditions.',
        benefits: ['Reduces anxiety & stress', 'Treats insomnia', 'Improves concentration', 'Relieves hypertension'],
        angle: 205.71
    },
    {
        id: 'virechan',
        name: 'Virechan',
        image: '/virechan_therapy.jpg',
        price: 'Rs. 2,800',
        description: 'Therapeutic purgation to eliminate excess Pitta dosha.',
        detailedDescription: 'Virechan is a controlled purgation therapy that eliminates Pitta-related toxins from the liver and gallbladder. It cleanses the gastrointestinal tract and is highly effective for skin disorders, acidity, and digestive issues.',
        benefits: ['Detoxifies liver & blood', 'Treats skin disorders', 'Relieves acidity & heartburn', 'Boosts metabolism'],
        angle: 257.14
    },
    {
        id: 'vasti',
        name: 'Vasti',
        image: '/vasti_therapy.jpg',
        price: 'Rs. 1,200',
        description: 'Medicated enema therapy to eliminate toxins and balance Vata dosha.',
        detailedDescription: 'Vasti involves introducing medicated decoctions or oils into the colon. Considered the "Mother of all treatments" in Ayurveda, it is the primary remedy for Vata disorders and affects the overall health of the body significantly.',
        benefits: ['Balances Vata dosha', 'Treats chronic constipation', 'Relieves lower back pain', 'Rejuvenates the body'],
        angle: 308.57
    }
];

export const OrbitalTherapies = () => {
    const navigate = useNavigate();
    const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    return (
        <>
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-reverse {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 20s linear infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>

            <div className="relative w-full py-16 bg-gradient-to-b from-amber-50 to-orange-50">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
                        Panchkarma Therapies
                    </h2>
                    <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                        Discover the ancient healing power of Ayurvedic treatments
                    </p>
                </div>

                {/* Orbital Container - Desktop Only */}
                <div className="hidden md:block relative w-full max-w-4xl mx-auto px-4">
                    <div
                        className="relative mx-auto aspect-square max-w-[600px]"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Central Circle - Full Panchakarma Detox */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-amber-600 shadow-2xl">
                                <img
                                    src="/panchakarma_center.jpg"
                                    alt="Full Panchakarma Detox - Central Therapy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Orbiting Therapies */}
                        <div
                            className={cn(
                                "absolute inset-0 transition-all duration-300",
                                isPaused ? "" : "animate-spin-slow"
                            )}
                        >
                            {THERAPIES.map((therapy) => {
                                const radius = 36; // percentage from center (moved closer from 45)
                                const angleRad = (therapy.angle * Math.PI) / 180;
                                const x = 50 + radius * Math.cos(angleRad);
                                const y = 50 + radius * Math.sin(angleRad);

                                return (
                                    <button
                                        key={therapy.id}
                                        onClick={() => setSelectedTherapy(therapy)}
                                        className="absolute group cursor-pointer"
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <div className={cn(
                                            "relative w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden",
                                            "border-4 border-amber-500 shadow-xl",
                                            "transition-all duration-300",
                                            "group-hover:scale-110 group-hover:border-amber-600 group-hover:shadow-2xl",
                                            isPaused ? "" : "animate-spin-reverse"
                                        )}>
                                            <img
                                                src={therapy.image}
                                                alt={therapy.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className={cn(
                                            "absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap",
                                            "bg-amber-900 text-amber-50 px-3 py-1 rounded-full text-xs md:text-sm font-semibold",
                                            "opacity-0 group-hover:opacity-100 transition-opacity shadow-lg",
                                            isPaused ? "" : "animate-spin-reverse"
                                        )}>
                                            {therapy.name}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile View - Grid Layout */}
                <div className="md:hidden mt-12 grid grid-cols-2 gap-4 px-4 max-w-md mx-auto">
                    {THERAPIES.map((therapy) => (
                        <button
                            key={therapy.id}
                            onClick={() => setSelectedTherapy(therapy)}
                            className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200 hover:border-amber-400 transition-all active:scale-95"
                        >
                            <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-amber-500 mb-2">
                                <img
                                    src={therapy.image}
                                    alt={therapy.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-amber-900 font-semibold text-center text-sm">{therapy.name}</h3>
                        </button>
                    ))}
                </div>

                {/* Modal */}
                {selectedTherapy && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
                        onClick={() => {
                            setSelectedTherapy(null);
                            setShowDetails(false);
                        }}
                    >
                        <div
                            className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-amber-600 animate-scale-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setSelectedTherapy(null);
                                    setShowDetails(false);
                                }}
                                className="absolute top-4 right-4 z-10 bg-amber-900 text-white rounded-full p-2 hover:bg-amber-800 transition-colors shadow-lg"
                            >
                                <X size={24} />
                            </button>

                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={selectedTherapy.image}
                                    alt={selectedTherapy.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <h2 className="absolute bottom-6 left-6 text-4xl font-serif font-bold text-white drop-shadow-lg">
                                    {selectedTherapy.name}
                                </h2>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-amber-800 font-semibold text-lg">Price:</span>
                                    <span className="text-3xl font-bold text-amber-900">{selectedTherapy.price}</span>
                                </div>

                                {showDetails && selectedTherapy.detailedDescription ? (
                                    <div className="animate-fade-in space-y-4">
                                        <p className="text-amber-900 leading-relaxed text-sm md:text-base font-medium">
                                            {selectedTherapy.detailedDescription}
                                        </p>
                                        {selectedTherapy.benefits && (
                                            <div>
                                                <h4 className="font-bold text-amber-800 mb-2 text-sm">Key Benefits:</h4>
                                                <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                    {selectedTherapy.benefits.map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-1.5 text-xs text-amber-900/80">
                                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-amber-900 leading-relaxed text-lg">
                                        {selectedTherapy.description}
                                    </p>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "flex-1 border-2 border-amber-700 text-amber-900 hover:bg-amber-100 font-semibold py-3 text-lg transition-colors",
                                            showDetails ? "bg-amber-100" : ""
                                        )}
                                        onClick={() => setShowDetails(!showDetails)}
                                    >
                                        {showDetails ? "Show Less" : "Details"}
                                    </Button>
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 text-lg shadow-lg"
                                        onClick={() => {
                                            setSelectedTherapy(null);
                                            setShowDetails(false);
                                            navigate('/book', { state: { serviceId: selectedTherapy.id } });
                                        }}
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
