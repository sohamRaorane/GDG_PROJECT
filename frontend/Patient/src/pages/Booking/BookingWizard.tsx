import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, User, Package, FileText, CreditCard, CheckCircle, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { SelectService } from './steps/SelectService';
import { SelectClinic } from './steps/SelectClinic';
import { SelectDoctor } from './steps/SelectDoctor';
import { SelectSlot } from './steps/SelectSlot';
import { IntakeForm } from './steps/IntakeForm';
import { Payment } from './steps/Payment';
import { Confirmation } from './steps/Confirmation';
import { useAuth } from '../../context/AuthContext';
import { getServiceById, getUserProfile } from '../../services/db';
import { bookMultiDayAppointment } from '../../services/booking';
import { sendAppointmentEmail } from '../../services/email';

// Steps definition with Icons
const STEPS = [
    { id: 'service', label: 'Therapy', icon: Package },
    { id: 'clinic', label: 'Location', icon: MapPin },
    { id: 'provider', label: 'Doctor', icon: User },
    { id: 'slot', label: 'Schedule', icon: CalendarIcon },
    { id: 'intake', label: 'Details', icon: FileText },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirm', label: 'Confirm', icon: CheckCircle },
] as const;

type StepId = typeof STEPS[number]['id'];

export const BookingWizard = () => {
    const [currentStep, setCurrentStep] = useState<StepId>('service');
    const [bookingData, setBookingData] = useState({
        serviceId: '',
        clinicId: '',
        doctorId: '',
        date: '',
        slot: '',
        roomId: '',
        peopleCount: 1,
        intakeValues: {}
    });

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

    const handleNext = () => {
        if (currentStep === 'service' && !bookingData.serviceId) {
            alert("Please select a service to continue.");
            return;
        }
        if (currentStep === 'clinic' && !bookingData.clinicId) {
            alert("Please select a clinic location to continue.");
            return;
        }
        if (currentStep === 'provider' && !bookingData.doctorId) {
            alert("Please select a doctor to continue.");
            return;
        }
        if (currentStep === 'slot' && (!bookingData.date || !bookingData.slot)) {
            alert("Please select a date and time slot.");
            return;
        }

        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentStepIndex + 1].id);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(STEPS[currentStepIndex - 1].id);
        }
    };

    const { currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentComplete = async () => {
        if (!currentUser) {
            alert("You must be logged in to book an appointment.");
            return;
        }

        setIsProcessing(true);
        try {
            if (!bookingData.serviceId) return;
            const service = await getServiceById(bookingData.serviceId);
            if (!service) return;

            // Use the atomic multi-day booking service
            const daysToBook = service.durationDays || 1;

            await bookMultiDayAppointment({
                customerId: currentUser.uid,
                customerName: currentUser.displayName || "Unknown Customer",
                customerEmail: currentUser.email || "",
                serviceId: bookingData.serviceId,
                serviceName: service.name,
                providerId: bookingData.doctorId,
                roomId: bookingData.roomId || 'auto-assigned', // Should come from SelectSlot
                startDate: bookingData.date,
                startTime: bookingData.slot,
                days: daysToBook,
                durationMinutes: service.durationMinutes
            });

            // Send Confirmation Email
            try {
                const doctorProfile = await getUserProfile(bookingData.doctorId);
                await sendAppointmentEmail({
                    customerName: currentUser.displayName || "Valued Customer",
                    customerEmail: currentUser.email || "",
                    date: bookingData.date,
                    time: bookingData.slot,
                    serviceName: service.name,
                    providerName: doctorProfile?.displayName || "AyurSutra Expert",
                    status: 'confirmed'
                });
            } catch (emailError) {
                console.error("Email sending failed (non-blocking):", emailError);
            }

            setCurrentStep('confirm');
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to confirm booking. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 transition-colors duration-500">
            <div className="container mx-auto max-w-6xl">
                {/* Brand / Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-medium text-primary mb-2 italic">AyurSutra Booking</h1>
                    <p className="text-text/60 font-serif">Follow the steps below to schedule your healing session.</p>
                </div>

                {/* Stepper container */}
                <div className="mb-12 flex justify-center">
                    <div className="inline-flex items-center bg-white/50 backdrop-blur-sm shadow-sm border border-primary/10 rounded-full p-2 md:p-4 gap-1 md:gap-4 overflow-x-auto max-w-full no-scrollbar">
                        {STEPS.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                                        isCurrent ? "bg-primary text-white shadow-lg shadow-primary/20" :
                                            isCompleted ? "text-primary opacity-80" : "text-text/40"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                                            isCurrent ? "bg-accent text-white border-transparent" :
                                                isCompleted ? "bg-secondary text-primary border-transparent" : "bg-white border-primary/10"
                                        )}>
                                            {isCompleted ? <Check size={14} /> : <StepIcon size={14} />}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-wider hidden sm:block whitespace-nowrap",
                                            isCurrent ? "text-white" : "",
                                            !isCurrent && !isCompleted && "text-text/40"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={cn(
                                            "mx-2 h-0.5 w-8 hidden sm:block transition-colors duration-300",
                                            index < currentStepIndex ? "bg-secondary" : "bg-primary/10"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area - Glassmorphism Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-secondary/10 border-2 border-secondary/20 p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10" />
                    <div className="flex-1">
                        {/* Step Content with basic fade-in (replace with framer if available) */}
                        <div className="animate-in fade-in duration-500">
                            {currentStep === 'service' && (
                                <SelectService
                                    selectedServiceId={bookingData.serviceId}
                                    onSelect={(id) => setBookingData(prev => ({ ...prev, serviceId: id }))}
                                />
                            )}
                            {currentStep === 'clinic' && (
                                <SelectClinic
                                    selectedClinicId={bookingData.clinicId}
                                    onSelect={(id) => setBookingData(prev => ({ ...prev, clinicId: id }))}
                                />
                            )}
                            {currentStep === 'provider' && (
                                <SelectDoctor
                                    selectedDoctorId={bookingData.doctorId}
                                    onSelect={(id) => setBookingData(prev => ({ ...prev, doctorId: id }))}
                                    clinicId={bookingData.clinicId}
                                />
                            )}
                            {currentStep === 'slot' && (
                                <SelectSlot
                                    bookingData={{
                                        date: bookingData.date,
                                        slot: bookingData.slot,
                                        peopleCount: bookingData.peopleCount,
                                        serviceId: bookingData.serviceId
                                    }}
                                    onChange={(data) => setBookingData(prev => ({ ...prev, ...data }))}
                                />
                            )}
                            {currentStep === 'intake' && (
                                <IntakeForm
                                    data={bookingData.intakeValues}
                                    onChange={(data) => setBookingData(prev => ({ ...prev, intakeValues: data }))}
                                />
                            )}
                            {currentStep === 'payment' && (
                                <Payment
                                    bookingData={bookingData}
                                    onPaymentComplete={handlePaymentComplete}
                                    isProcessing={isProcessing}
                                />
                            )}
                            {currentStep === 'confirm' && (
                                <Confirmation bookingData={bookingData} />
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {currentStep !== 'confirm' && (
                        <div className="mt-12 flex justify-between items-center pt-8 border-t-2 border-secondary/10">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStepIndex === 0}
                                className="px-8 rounded-xl border-secondary/20 hover:bg-secondary/10 gap-2 text-secondary font-bold"
                            >
                                <ChevronLeft size={18} /> Back
                            </Button>

                            <div className="flex items-center gap-6">
                                {currentStep !== 'payment' && (
                                    <Button
                                        onClick={handleNext}
                                        className="px-10 py-6 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 text-lg font-bold border-b-4 border-primary/20 active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        {currentStep === 'intake' ? "Go to Payment" : "Continue"}
                                        <ChevronRight size={20} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
