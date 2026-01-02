import { Star, Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Doctor Portraits
import drAnjali from '../../../assets/doctors/dr_anjali.png';
import drRajesh from '../../../assets/doctors/dr_rajesh.png';
import drPriyanshu from '../../../assets/doctors/dr_priyanshu.png';

export interface DoctorResource {
    id: string;
    name: string;
    specialization: string;
    experience: string;
    image: string;
    rating: number;
}

const DOCTORS: DoctorResource[] = [
    {
        id: 'dr-sharma',
        name: 'Dr. Anjali Sharma',
        specialization: 'Panchakarma Specialist',
        experience: '12 Years',
        image: drAnjali,
        rating: 4.8
    },
    {
        id: 'dr-verma',
        name: 'Dr. Rajesh Verma',
        specialization: 'Ayurvedic Medicine',
        experience: '20 Years',
        image: drRajesh,
        rating: 4.9
    },
    {
        id: 'dr-gupta',
        name: 'Dr. Priyanshu Gupta',
        specialization: 'Nadi Pariksha Expert',
        experience: '8 Years',
        image: drPriyanshu,
        rating: 4.6
    },
];

interface SelectDoctorProps {
    selectedDoctorId: string;
    onSelect: (doctorId: string) => void;
}

export const SelectDoctor: React.FC<SelectDoctorProps> = ({ selectedDoctorId, onSelect }) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-10">
                <h3 className="text-2xl font-display font-bold text-text mb-2 italic">Choose Your Healer</h3>
                <p className="text-slate-400 max-w-md">Select an expert practitioner to guide your personal wellness journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DOCTORS.map((doctor) => (
                    <div
                        key={doctor.id}
                        onClick={() => onSelect(doctor.id)}
                        className={cn(
                            "group cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden bg-white flex flex-col",
                            selectedDoctorId === doctor.id
                                ? "border-primary shadow-2xl shadow-primary/10 -translate-y-2"
                                : "border-slate-100 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
                        )}
                    >
                        {/* Portrait Section */}
                        <div className="h-72 relative bg-slate-50 overflow-hidden">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />

                            {/* Floating Stats */}
                            <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                <div className="bg-secondary/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 border border-primary/10">
                                    <Star size={10} className="fill-primary" />
                                    {doctor.rating}
                                </div>
                                <div className="bg-white/90 backdrop-blur-md text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-slate-100">
                                    {doctor.experience} Exp
                                </div>
                            </div>

                            {selectedDoctorId === doctor.id && (
                                <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg animate-in zoom-in-50 duration-300">
                                    <CheckCircle2 size={16} />
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-6 flex flex-col items-center text-center">
                            <h4 className="font-display font-bold text-xl text-text mb-1 italic group-hover:text-primary transition-colors">
                                {doctor.name}
                            </h4>
                            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">
                                {doctor.specialization}
                            </p>

                            <div className="w-full h-px bg-slate-50 mb-4" />

                            <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 italic">
                                Dedicated to holistic healing and restoring your body's natural balance through ancient wisdom.
                            </p>
                        </div>

                        {selectedDoctorId === doctor.id && (
                            <div className="h-1.5 bg-primary w-full" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
