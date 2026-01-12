import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { CheckCircle2, Star, MapPin } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Fix for default marker icon in React Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Clinic {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating: number;
    isOpen: boolean;
    waitTime: number; // in minutes
    phone: string;
}

const MUMBAI_CENTER: [number, number] = [19.0760, 72.8777];

// Augmented Mock Clinics List
export const MOCK_CLINICS: Clinic[] = [
    {
        id: '1',
        name: 'AyurSutra Wellness Center',
        address: '123, Marine Drive, Churchgate, Mumbai',
        lat: 18.9220,
        lng: 72.8230,
        rating: 4.8,
        isOpen: true,
        waitTime: 15,
        phone: '+91 98765 43210'
    },
    {
        id: '2',
        name: 'Prakriti Ayurvedic Care',
        address: '45, Linking Road, Bandra West, Mumbai',
        lat: 19.0600,
        lng: 72.8360,
        rating: 4.6,
        isOpen: true,
        waitTime: 30,
        phone: '+91 98765 43211'
    },
    {
        id: '3',
        name: 'Dhanvantari Kerala Ayurved',
        address: '78, Juhu Tara Road, Juhu, Mumbai',
        lat: 19.0880,
        lng: 72.8250,
        rating: 4.9,
        isOpen: false,
        waitTime: 0,
        phone: '+91 98765 43212'
    },
    {
        id: '4',
        name: 'VedaLife Clinic',
        address: 'Powai Plaza, Hiranandani Gardens, Powai, Mumbai',
        lat: 19.1197,
        lng: 72.9050,
        rating: 4.7,
        isOpen: true,
        waitTime: 10,
        phone: '+91 98765 43213'
    },
    {
        id: '5',
        name: 'Sushruta Holistic Healing',
        address: 'Ghatkopar East, Mumbai',
        lat: 19.0860,
        lng: 72.9180,
        rating: 4.5,
        isOpen: true,
        waitTime: 45,
        phone: '+91 98765 43214'
    },
    // New Clinics Added
    {
        id: '6',
        name: 'NavJivan Ayurved',
        address: 'Dadar West, Mumbai',
        lat: 19.0213,
        lng: 72.8424,
        rating: 4.4,
        isOpen: true,
        waitTime: 20,
        phone: '+91 98765 43215'
    },
    {
        id: '7',
        name: 'Ojas Wellness',
        address: 'Andheri West, Mumbai',
        lat: 19.1136,
        lng: 72.8697,
        rating: 4.9,
        isOpen: true,
        waitTime: 5,
        phone: '+91 98765 43216'
    }
];

interface SelectClinicProps {
    selectedClinicId: string;
    onSelect: (clinicId: string) => void;
}

// Component to handle map invalidation on mount to ensure correct rendering
const MapHandler = ({ selectedClinic }: { selectedClinic: Clinic | null }) => {
    const map = useMap();

    useEffect(() => {
        // Force map resize calculation after mount
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);

    useEffect(() => {
        if (selectedClinic) {
            map.flyTo([selectedClinic.lat, selectedClinic.lng], 14, {
                duration: 1.2
            });
        }
    }, [selectedClinic, map]);

    return null;
};

export const SelectClinic = ({ selectedClinicId, onSelect }: SelectClinicProps) => {
    // Local state to track which clinic is "active" (focused/clicked) on the map even if not fully "selected" to proceed
    const [activeClinic, setActiveClinic] = useState<Clinic | null>(
        MOCK_CLINICS.find(c => c.id === selectedClinicId) || null
    );

    const handleClinicClick = (clinic: Clinic) => {
        setActiveClinic(clinic);
        onSelect(clinic.id);
    };

    return (
        <div className="space-y-6 h-full flex flex-col w-full">
            <div className="flex flex-col items-center text-center mb-6">
                <h3 className="text-2xl font-display font-medium text-text mb-2 italic">Select a Clinic</h3>
                <div className="flex items-center gap-2 text-primary/60">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                    <p className="text-sm font-serif italic">Realtime Availability • Choose a location</p>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden border-4 border-secondary/20 shadow-xl shadow-secondary/10 group isolate bg-secondary/5">
                <MapContainer
                    center={MUMBAI_CENTER}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0 h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapHandler selectedClinic={activeClinic} />

                    {MOCK_CLINICS.map((clinic) => (
                        <Marker
                            key={clinic.id}
                            position={[clinic.lat, clinic.lng]}
                            eventHandlers={{
                                click: () => handleClinicClick(clinic),
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2 font-sans">
                                    <span className="font-bold text-primary block mb-1">{clinic.name}</span>
                                    <div className="text-xs text-text/70">{clinic.address}</div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Overlays */}
                {/* 1. Selection List Sidebar (Desktop) */}
                <div className="absolute top-4 left-4 bottom-4 w-80 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl overflow-hidden z-[400] flex flex-col border border-secondary/10 hidden md:flex">
                    <div className="p-6 border-b border-secondary/10 bg-secondary/5">
                        <h4 className="font-display font-bold text-primary flex items-center gap-2 text-lg">
                            <MapPin size={18} className="text-accent" /> Nearby Centers
                        </h4>
                        <p className="text-xs text-secondary/60 mt-1 ml-6 font-bold">{MOCK_CLINICS.length} locations available</p>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-3 no-scrollbar">
                        {MOCK_CLINICS.map(clinic => (
                            <div
                                key={clinic.id}
                                onClick={() => handleClinicClick(clinic)}
                                className={cn(
                                    "p-4 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden",
                                    selectedClinicId === clinic.id
                                        ? "bg-secondary/10 border-primary shadow-none"
                                        : "bg-surface border-secondary/10 hover:border-secondary/30 hover:shadow-sm"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 gap-2 relative z-10">
                                    <h5 className={cn("font-bold text-sm leading-tight transition-colors", selectedClinicId === clinic.id ? "text-primary" : "text-text")}>
                                        {clinic.name}
                                    </h5>
                                    {selectedClinicId === clinic.id && <CheckCircle2 size={16} className="text-primary shrink-0" />}
                                </div>
                                <p className="text-[11px] text-text/60 line-clamp-2 mb-3 font-medium relative z-10">{clinic.address}</p>
                                <div className="flex items-center justify-between text-[10px] relative z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-primary font-bold bg-white px-2 py-1 rounded-full border border-secondary/10">
                                            <Star size={10} className="fill-current" /> {clinic.rating}
                                        </span>
                                        {clinic.isOpen ? (
                                            <span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">Open</span>
                                        ) : (
                                            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded-full border border-rose-100">Closed</span>
                                        )}
                                    </div>
                                    <span className="text-secondary/60 font-bold">{clinic.waitTime}m wait</span>
                                </div>

                                {selectedClinicId === clinic.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Floating Card for Selected Clinic */}
                {activeClinic && (
                    <div className="absolute bottom-4 left-4 right-4 md:hidden bg-white/95 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl z-[400] border border-white animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-text text-lg">{activeClinic.name}</h4>
                                <p className="text-xs text-text/50 mt-1 line-clamp-1 font-medium">{activeClinic.address}</p>
                            </div>
                            {selectedClinicId === activeClinic.id && (
                                <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold">SELECTED</span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-text/40">
                            <div className="flex items-center gap-1 text-primary">
                                <Star size={14} className="fill-current" /> {activeClinic.rating}
                            </div>
                            <div className="w-px h-3 bg-slate-200"></div>
                            <div>{activeClinic.waitTime} min wait</div>
                        </div>

                        {selectedClinicId !== activeClinic.id && (
                            <button
                                onClick={() => onSelect(activeClinic.id)}
                                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-primary/10"
                            >
                                Select This Clinic
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
