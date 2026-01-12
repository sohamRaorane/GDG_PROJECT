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
        <div className="h-[calc(100vh-4rem)] w-full relative flex flex-col md:flex-row bg-[#FFF9F2]">
            {/* Sidebar List */}
            <div className="w-full md:w-96 bg-[#FFF9F2] shadow-xl z-10 flex flex-col h-1/3 md:h-full overflow-hidden border-r border-amber-200">
                <div className="p-4 border-b border-amber-200 bg-[#FFF9F2]">
                    <h1 className="text-2xl font-bold text-amber-900">Clinic Locator</h1>
                    <p className="text-sm text-amber-800/70 flex items-center gap-2 mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        Realtime Availability
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF9F2]">
                    {MOCK_CLINICS.map((clinic) => (
                        <div
                            key={clinic.id}
                            onClick={() => setSelectedClinic(clinic)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md ${selectedClinic?.id === clinic.id
                                ? 'border-amber-500 bg-amber-100'
                                : 'border-amber-200 bg-white hover:border-amber-300'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-amber-900">{clinic.name}</h3>
                                {clinic.isOpen ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Open
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                        Closed
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-amber-800/70 mt-1 line-clamp-2">{clinic.address}</p>

                            <div className="mt-3 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-amber-600">
                                    <Star size={14} fill="currentColor" />
                                    <span className="font-medium">{clinic.rating}</span>
                                </div>
                                {clinic.isOpen && (
                                    <div className="flex items-center gap-1 text-orange-600">
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
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
                                    <h3 className="font-bold text-amber-900">{clinic.name}</h3>
                                    <p className="text-xs text-amber-800/80 mt-1">{clinic.address}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="flex-1 bg-amber-600 text-white text-xs py-1.5 px-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-1">
                                            <Navigation size={12} /> Directions
                                        </button>
                                        <a href={`tel:${clinic.phone}`} className="p-1.5 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100">
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
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-6 w-[90%] md:w-80 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-amber-100 z-[400] transition-all duration-300 animate-in slide-in-from-bottom-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg text-amber-900">{selectedClinic.name}</h2>
                                <p className="text-amber-800/80 text-sm mt-0.5">{selectedClinic.address}</p>
                            </div>
                            <button
                                onClick={() => setSelectedClinic(null)}
                                className="text-amber-400 hover:text-amber-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-600/20">
                                <Navigation size={16} /> Navigate
                            </button>
                            <button className="bg-amber-50 hover:bg-amber-100 text-amber-900 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-amber-200">
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
