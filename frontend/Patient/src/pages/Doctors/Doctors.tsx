import { useState } from 'react';
import { Star, Calendar, ArrowRight, Award, GraduationCap, Languages, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

// Import images
import drAnjali from '../../assets/doctors/dr_anjali.png';
import drRajesh from '../../assets/doctors/dr_rajesh.png';
import drPriyanshu from '../../assets/doctors/dr_priyanshu.png';

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    experience: string;
    image: string;
    available: boolean;
    bio: string;
    detailedBio: string;
    education: string[];
    languages: string[];
    expertise: string[];
}

const DOCTORS: Doctor[] = [
    {
        id: 'dr-sharma',
        name: 'Dr. Anjali Sharma',
        specialization: 'Panchakarma Specialist',
        rating: 4.8,
        experience: '12 Years',
        image: drAnjali,
        available: true,
        bio: 'Expert in detoxification therapies and lifestyle management.',
        detailedBio: 'Dr. Anjali Sharma is a renowned Panchakarma specialist with over a decade of clinical experience. She has successfully treated thousands of patients suffering from chronic lifestyle disorders through authentic Ayurvedic detoxification protocols. Her approach combines deep pulse diagnosis with personalized diet and lifestyle modifications.',
        education: ['BAMS - Gujarat Ayurved University', 'MD (Panchakarma) - Kerala Ayurveda Academy'],
        languages: ['English', 'Hindi', 'Gujarati'],
        expertise: ['Detoxification', 'Women\'s Health', 'Skin Disorders', 'Stress Management']
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        rating: 4.9,
        experience: '20 Years',
        image: drRajesh,
        available: true,
        bio: 'Specializes in chronic disease management and preventive care.',
        detailedBio: 'With 20 years of experience, Dr. Rajesh Verma is a veteran in the field of Ayurvedic medicine. He specializes in managing chronic conditions such as arthritis, diabetes, and hypertension using purely herbal remedies. He is a strong advocate of preventive healthcare and teaches yoga and meditation as part of his holistic treatment plans.',
        education: ['BAMS - Banaras Hindu University', 'PhD (Ayurveda) - NIA Jaipur'],
        languages: ['English', 'Hindi', 'Sanskrit'],
        expertise: ['Chronic Pain', 'Metabolic Disorders', 'Arthritis', 'Preventive Cardiology']
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        rating: 4.6,
        experience: '8 Years',
        image: drPriyanshu,
        available: true,
        bio: 'Focuses on pulse diagnosis and personalized dietary planning.',
        detailedBio: 'Dr. Priyanshu Gupta is known for his exceptional skill in Nadi Pariksha (Pulse Diagnosis). By simply reading the pulse, he can identify deep-seated imbalances in the body long before they manifest as diseases. He is passionate about bringing Ayurveda to the modern world and specializes in gut health and mental wellness.',
        education: ['BAMS', 'Certificate in Pulse Diagnosis'],
        languages: ['English', 'Hindi'],
        expertise: ['Pulse Diagnosis', 'Gut Health', 'Mental Wellness', 'Dietary Planning']
    },
];

export const Doctors = () => {
    const navigate = useNavigate();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF9F2] min-h-screen">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-amber-900 mb-4">Our Expert Healers</h1>
                <p className="text-amber-800 font-serif text-lg">
                    Meet our team of witnessed Ayurvedic practitioners dedicated to guiding you on your path to wellness.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DOCTORS.map((doctor) => (
                    <div key={doctor.id} className="group bg-white rounded-2xl border border-amber-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col hover:border-amber-400">
                        {/* Image Section */}
                        <div className="h-64 overflow-hidden relative bg-amber-50">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div className="text-white">
                                    <p className="font-semibold text-sm opacity-90">{doctor.specialization}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-1 rounded-md shadow-sm border border-amber-200">
                                    <Star size={12} className="fill-amber-600 text-amber-600" />
                                    <span className="text-xs font-bold">{doctor.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="mb-4">
                                <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                                    {doctor.name}
                                </h2>
                                <p className="text-amber-800/80 text-sm leading-relaxed font-body">
                                    {doctor.bio}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-amber-700 mb-6 font-medium uppercase tracking-wider">
                                <span className='flex items-center gap-1'>
                                    <Award size={14} className="text-amber-600" />
                                    {doctor.experience} Exp
                                </span>
                                <span className="w-1 h-1 bg-stone-300 rounded-full" />
                                <span className={doctor.available ? "text-green-600" : "text-red-500"}>
                                    {doctor.available ? "Available Today" : "Unavailable"}
                                </span>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-amber-300 text-amber-800 hover:bg-amber-50"
                                    onClick={() => setSelectedDoctor(doctor)}
                                >
                                    View Profile
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                                    onClick={() => navigate('/book')}
                                >
                                    Book
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Doctor Details Modal */}
            <Modal isOpen={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
                {selectedDoctor && (
                    <div className="flex flex-col md:flex-row h-full max-h-[80vh] bg-[#FFF9F2] rounded-3xl overflow-hidden">
                        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-amber-100 shrink-0">
                            <img
                                src={selectedDoctor.image}
                                alt={selectedDoctor.name}
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                            <div className="absolute bottom-4 left-4 md:hidden text-white">
                                <h2 className="text-2xl font-serif font-bold">{selectedDoctor.name}</h2>
                                <p className="opacity-90">{selectedDoctor.specialization}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                            <div className="hidden md:block mb-6">
                                <h2 className="text-3xl font-serif font-bold text-amber-900 mb-1">{selectedDoctor.name}</h2>
                                <p className="text-amber-700 font-medium">{selectedDoctor.specialization}</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">About</h3>
                                    <p className="text-amber-900/80 font-body leading-relaxed">
                                        {selectedDoctor.detailedBio}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                                            <Award size={16} /> Specialties
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedDoctor.expertise.map((exp, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-amber-800">
                                                    <CheckCircle size={14} className="text-amber-600 shrink-0" />
                                                    {exp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                                            <GraduationCap size={16} /> Education
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedDoctor.education.map((edu, idx) => (
                                                <li key={idx} className="text-sm text-amber-800 border-l-2 border-amber-200 pl-3">
                                                    {edu}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                                        <Languages size={16} /> Languages Spoken
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDoctor.languages.map(lang => (
                                            <span key={lang} className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-md border border-amber-100">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-amber-100">
                                <Button
                                    className="w-full group text-lg h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                                    onClick={() => {
                                        setSelectedDoctor(null);
                                        navigate('/book');
                                    }}
                                >
                                    Book Appointment with {selectedDoctor.name.split(' ')[1]}
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
