import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Clock, Navigation, Phone, Star } from 'lucide-react';

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
    }
];

const ClinicLocator = () => {
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

    return (
        <div className="h-[calc(100vh-4rem)] w-full relative flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
            {/* Sidebar List */}
            <div className="w-full md:w-96 bg-white dark:bg-slate-800 shadow-xl z-10 flex flex-col h-1/3 md:h-full overflow-hidden border-r border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Clinic Locator</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        Realtime Availability
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {MOCK_CLINICS.map((clinic) => (
                        <div
                            key={clinic.id}
                            onClick={() => setSelectedClinic(clinic)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md ${selectedClinic?.id === clinic.id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{clinic.name}</h3>
                                {clinic.isOpen ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        Open
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                        Closed
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{clinic.address}</p>

                            <div className="mt-3 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="font-medium">{clinic.rating}</span>
                                </div>
                                {clinic.isOpen && (
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                        <Clock size={14} />
                                        <span className="text-xs font-medium">{clinic.waitTime} min wait</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative h-2/3 md:h-full">
                <MapContainer
                    center={MUMBAI_CENTER}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* Map Updater to fly to selected clinic */}
                    <MapUpdater selectedClinic={selectedClinic} />

                    {MOCK_CLINICS.map((clinic) => (
                        <Marker
                            key={clinic.id}
                            position={[clinic.lat, clinic.lng]}
                            eventHandlers={{
                                click: () => setSelectedClinic(clinic),
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[200px]">
                                    <h3 className="font-bold text-slate-800">{clinic.name}</h3>
                                    <p className="text-xs text-slate-600 mt-1">{clinic.address}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="flex-1 bg-emerald-600 text-white text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                                            <Navigation size={12} /> Directions
                                        </button>
                                        <a href={`tel:${clinic.phone}`} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                                            <Phone size={14} />
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Floating Info Overlay for Mobile/Quick View */}
                {selectedClinic && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-6 w-[90%] md:w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 z-[400] transition-all duration-300 animate-in slide-in-from-bottom-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white">{selectedClinic.name}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{selectedClinic.address}</p>
                            </div>
                            <button
                                onClick={() => setSelectedClinic(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                                <Navigation size={16} /> Navigate
                            </button>
                            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <Phone size={16} /> Call
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// component to handle map movement
const MapUpdater = ({ selectedClinic }: { selectedClinic: Clinic | null }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedClinic) {
            map.flyTo([selectedClinic.lat, selectedClinic.lng], 15, {
                duration: 1.5
            });
        }
    }, [selectedClinic, map]);

    return null;
};

export default ClinicLocator;
