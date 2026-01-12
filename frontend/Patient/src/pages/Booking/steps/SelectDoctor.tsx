import { Star, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

import { DOCTORS } from '../../../utils/doctors';

interface SelectDoctorProps {
    selectedDoctorId: string;
    onSelect: (doctorId: string) => void;
    clinicId?: string; // Optional for backward compatibility, but should be passed
}

export const SelectDoctor: React.FC<SelectDoctorProps> = ({ selectedDoctorId, onSelect, clinicId }) => {

    const filteredDoctors = clinicId
        ? DOCTORS.filter(doc => doc.clinicIds.includes(clinicId))
        : DOCTORS;

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-10">
                <h3 className="text-2xl font-display font-medium text-text mb-2 italic">Choose Your Healer</h3>
                <p className="text-text/60 max-w-md font-serif italic">
                    {clinicId ? "Experts available at this sanctuary." : "Select an expert practitioner to guide your personal wellness journey."}
                </p>
            </div>

            {filteredDoctors.length === 0 ? (
                <div className="text-center py-12 bg-secondary/10 rounded-[2rem] border border-primary/5">
                    <p className="text-text/60 italic">No healers available at this sanctuary based on current roster.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            onClick={() => onSelect(doctor.id)}
                            className={cn(
                                "group cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden bg-white flex flex-col relative",
                                selectedDoctorId === doctor.id
                                    ? "border-primary shadow-2xl shadow-primary/20 -translate-y-2 from-white to-secondary/10 bg-gradient-to-b"
                                    : "border-secondary/20 shadow-sm hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/5 hover:-translate-y-1"
                            )}
                        >
                            {/* Portrait Section */}
                            <div className="h-80 relative bg-secondary/10 overflow-hidden">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-1000 grayscale-[0%] group-hover:contrast-125"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />

                                {/* Floating Stats */}
                                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                    <div className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 border border-primary/20">
                                        <Star size={10} className="fill-current" />
                                        {doctor.rating}
                                    </div>
                                    <div className="bg-white/90 backdrop-blur-md text-secondary px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-secondary/20">
                                        {doctor.experience} Exp
                                    </div>
                                </div>

                                {selectedDoctorId === doctor.id && (
                                    <div className="absolute top-4 right-4 bg-primary text-white p-2.5 rounded-full shadow-lg animate-in zoom-in-50 duration-300">
                                        <CheckCircle2 size={18} />
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="p-8 flex flex-col items-center text-center -mt-6 relative z-10">
                                <h4 className="font-display font-bold text-xl text-text mb-1 italic group-hover:text-primary transition-colors">
                                    {doctor.name}
                                </h4>
                                <p className="text-secondary/70 font-bold text-xs uppercase tracking-widest mb-6">
                                    {doctor.specialization}
                                </p>

                                <div className="w-12 h-1 bg-secondary/20 rounded-full mb-6" />

                                <p className="text-text/60 text-[11px] leading-relaxed line-clamp-2 italic font-serif">
                                    Dedicated to holistic healing and restoring your body's natural balance through ancient wisdom.
                                </p>
                            </div>

                            {selectedDoctorId === doctor.id && (
                                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
