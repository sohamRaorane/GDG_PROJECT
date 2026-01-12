import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Users, Download, Share2, Home } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { format } from 'date-fns';
import { MOCK_CLINICS } from './SelectClinic';

interface ConfirmationProps {
    bookingData: {
        serviceId: string;
        clinicId: string;
        doctorId: string;
        date: string;
        slot: string;
        peopleCount: number;
    };
}

export const Confirmation: React.FC<ConfirmationProps> = ({ bookingData }) => {
    const navigate = useNavigate();
    const selectedClinic = MOCK_CLINICS.find(c => c.id === bookingData.clinicId);

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Success Animation / Banner */}
            <div className="flex flex-col items-center text-center space-y-6 mb-16">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white relative z-10 shadow-2xl shadow-primary/30">
                        <CheckCircle size={48} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-display font-medium text-text italic">Booking Confirmed!</h2>
                    <p className="text-text/60 font-serif italic">Your healing journey has been officially scheduled.</p>
                </div>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-[2.5rem] border-2 border-secondary/20 shadow-xl shadow-secondary/5 overflow-hidden mb-12 animate-in slide-in-from-bottom-6 duration-700 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

                <div className="bg-secondary/10 p-8 border-b border-secondary/10 flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Appointment ID</p>
                        <p className="font-display font-bold text-text text-lg italic">#AYR-2026-9921</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white rounded-xl border border-secondary/20 text-secondary hover:text-primary transition-colors shadow-sm">
                            <Download size={18} />
                        </button>
                        <button className="p-2 bg-white rounded-xl border border-secondary/20 text-secondary hover:text-primary transition-colors shadow-sm">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-10 space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-secondary/20">
                                <Calendar size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">Date</p>
                                <p className="font-display font-bold text-text italic text-lg">
                                    {bookingData.date ? format(new Date(bookingData.date), 'EEEE, MMMM do') : 'TBD'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-secondary/20">
                                <Clock size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">Time</p>
                                <p className="font-display font-bold text-text italic text-lg">{bookingData.slot || 'TBD'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-secondary/20">
                                <Users size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">Attendees</p>
                                <p className="font-display font-bold text-text italic text-lg">{bookingData.peopleCount} Person(s)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-secondary/20">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">Location</p>
                                <p className="font-display font-bold text-text italic text-lg">{selectedClinic?.name || 'AyurSutra Center'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/5 p-6 rounded-3xl border border-secondary/20">
                        <p className="text-sm text-primary/70 text-center italic font-serif">
                            "Please arrive 15 minutes before your session for the introductory cleansing ritual. We look forward to seeing you."
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                    onClick={() => navigate('/home')}
                    className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 font-bold transition-transform hover:-translate-y-1"
                >
                    <Home size={18} />
                    Go to Dashboard
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/services')}
                    className="w-full sm:w-auto px-10 py-5 rounded-3xl border-2 border-secondary/20 text-secondary hover:text-primary hover:bg-secondary/10 font-bold transition-all"
                >
                    Book Another Session
                </Button>
            </div>
        </div>
    );
};
