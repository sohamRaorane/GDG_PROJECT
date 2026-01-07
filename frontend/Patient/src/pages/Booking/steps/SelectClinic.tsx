import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { CheckCircle2, Star, MapPin, Navigation } from 'lucide-react';

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
const MOCK_CLINICS: Clinic[] = [
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
                <h3 className="text-2xl font-display font-bold text-text mb-2 italic">Select a Clinic</h3>
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <p className="text-sm">Realtime Availability • Choose a location</p>
                </div>
            </div>

            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-2xl group isolate bg-slate-900">
                <MapContainer
                    center={MUMBAI_CENTER}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0 h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                                <div className="p-1">
                                    <span className="font-bold text-slate-800">{clinic.name}</span>
                                    <div className="max-w-[150px] text-xs text-slate-500 truncate">{clinic.address}</div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Overlays */}
                {/* 1. Selection List Sidebar (Desktop) */}
                <div className="absolute top-4 left-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden z-[400] flex flex-col border border-slate-700 hidden md:flex">
                    <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                        <h4 className="font-bold text-slate-100 flex items-center gap-2">
                            <MapPin size={16} className="text-emerald-400" /> Nearby Clinics ({MOCK_CLINICS.length})
                        </h4>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
                        {MOCK_CLINICS.map(clinic => (
                            <div
                                key={clinic.id}
                                onClick={() => handleClinicClick(clinic)}
                                className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedClinicId === clinic.id
                                        ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg shadow-emerald-900/20'
                                        : 'bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <h5 className={`font-semibold text-sm leading-tight ${selectedClinicId === clinic.id ? 'text-emerald-300' : 'text-slate-200'}`}>
                                        {clinic.name}
                                    </h5>
                                    {selectedClinicId === clinic.id && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{clinic.address}</p>
                                <div className="flex items-center justify-between text-[10px]">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-0.5 text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                            <Star size={10} fill="currentColor" /> {clinic.rating}
                                        </span>
                                        {clinic.isOpen ? (
                                            <span className="text-emerald-400">Open</span>
                                        ) : (
                                            <span className="text-red-400">Closed</span>
                                        )}
                                    </div>
                                    <span className="text-slate-500">{clinic.waitTime}m wait</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Floating Card for Selected Clinic */}
                {activeClinic && (
                    <div className="absolute bottom-4 left-4 right-4 md:hidden bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-[400] border border-slate-700 animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-100">{activeClinic.name}</h4>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{activeClinic.address}</p>
                            </div>
                            {selectedClinicId === activeClinic.id && (
                                <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg shadow-emerald-500/20">SELECTED</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star size={12} fill="currentColor" /> {activeClinic.rating}
                            </div>
                            <div className="w-px h-3 bg-slate-700"></div>
                            <div>{activeClinic.waitTime} min wait</div>
                        </div>

                        {selectedClinicId !== activeClinic.id && (
                            <button
                                onClick={() => onSelect(activeClinic.id)}
                                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                            >
                                Select This Location
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
