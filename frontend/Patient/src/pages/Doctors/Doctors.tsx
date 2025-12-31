
import { Star, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    experience: string;
    image: string;
    available: boolean;
    bio: string;
}

const DOCTORS: Doctor[] = [
    {
        id: 'dr-sharma',
        name: 'Dr. Anjali Sharma',
        specialization: 'Panchakarma Specialist',
        rating: 4.8,
        experience: '12 Years',
        image: 'bg-emerald-200',
        available: true,
        bio: 'Expert in detoxification therapies and lifestyle management.'
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        rating: 4.9,
        experience: '20 Years',
        image: 'bg-blue-200',
        available: true,
        bio: 'Specializes in chronic disease management and preventive care.'
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        rating: 4.6,
        experience: '8 Years',
        image: 'bg-amber-200',
        available: true,
        bio: 'Focuses on pulse diagnosis and personalized dietary planning.'
    }
];

export const Doctors = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-display font-bold text-text mb-2">Our Expert Doctors</h1>
                <p className="text-gray-500">Meet our team of experienced Ayurvedic practitioners dedicated to your wellness.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DOCTORS.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className={cn("h-32 flex items-center justify-center", doctor.image)}>
                            <span className="text-4xl font-bold text-gray-700 opacity-50">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-xl font-bold text-text">{doctor.name}</h2>
                                    <p className="text-primary font-medium text-sm">{doctor.specialization}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-yellow-700">{doctor.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{doctor.bio}</p>

                            <div className="flex items-center text-xs text-gray-400 mb-6 gap-3">
                                <span>{doctor.experience} Experience</span>
                                <span>•</span>
                                <span className={doctor.available ? "text-green-600 font-medium" : "text-red-500"}>
                                    {doctor.available ? "Available Today" : "Unavailable"}
                                </span>
                            </div>

                            <Button
                                className="w-full gap-2"
                                onClick={() => navigate('/book')} // In future, pass doctor ID
                            >
                                <Calendar size={16} />
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
