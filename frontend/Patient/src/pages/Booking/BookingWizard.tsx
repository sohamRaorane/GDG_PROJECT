import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { SelectService } from './steps/SelectService';
import { SelectDoctor } from './steps/SelectDoctor';
import { SelectSlot } from './steps/SelectSlot';
import { IntakeForm } from './steps/IntakeForm';
import { Payment } from './steps/Payment';
import { Confirmation } from './steps/Confirmation';

// Steps definition
const STEPS = [
    { id: 'service', label: 'Select Therapy' },
    { id: 'provider', label: 'Choose Doctor' },
    { id: 'slot', label: 'Date & Time' },
    { id: 'intake', label: 'Details' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
] as const;

type StepId = typeof STEPS[number]['id'];

export const BookingWizard = () => {
    const [currentStep, setCurrentStep] = useState<StepId>('service');
    const [bookingData, setBookingData] = useState({
        serviceId: '',
        doctorId: '',
        date: '',
        slot: '',
        peopleCount: 1,
        intakeValues: {}
    });

    // Helper to get step index
    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentStepIndex + 1].id);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(STEPS[currentStepIndex - 1].id);
        }
    };

    // Explicit handler for "Proceed to Payment" from Intake
    const handleProceedToPayment = () => {
        setCurrentStep('payment');
    };

    // Explicit handler for "Pay Now" from Payment
    const handlePaymentComplete = () => {
        setCurrentStep('confirm');
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="relative flex justify-between">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                        ></div>

                        {STEPS.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted ? "bg-primary border-primary text-white" :
                                            isCurrent ? "bg-white border-primary text-primary" :
                                                "bg-white border-gray-300 text-gray-400"
                                    )}>
                                        {isCompleted ? <Check size={20} /> : <span className="font-semibold">{index + 1}</span>}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium uppercase tracking-wider hidden md:block",
                                        isCurrent ? "text-primary" : "text-gray-400"
                                    )}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold font-display text-text">{STEPS[currentStepIndex].label}</h2>
                        {currentStep !== 'confirm' && (
                            <p className="text-gray-500">Please provide the details below.</p>
                        )}
                    </div>

                    {/* Step Content */}
                    <div className="py-4">
                        {currentStep === 'service' && (
                            <SelectService
                                selectedServiceId={bookingData.serviceId}
                                onSelect={(id) => setBookingData(prev => ({ ...prev, serviceId: id }))}
                            />
                        )}
                        {currentStep === 'provider' && (
                            <SelectDoctor
                                selectedDoctorId={bookingData.doctorId}
                                onSelect={(id) => setBookingData(prev => ({ ...prev, doctorId: id }))}
                            />
                        )}
                        {currentStep === 'slot' && (
                            <SelectSlot
                                bookingData={{ date: bookingData.date, slot: bookingData.slot }}
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
                            />
                        )}
                        {currentStep === 'confirm' && (
                            <Confirmation bookingData={bookingData} />
                        )}
                    </div>
                </div>

                {/* Navigation Actions */}
                {currentStep !== 'confirm' && (
                    <div className="mt-8 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStepIndex === 0}
                        >
                            Back
                        </Button>

                        {/* Custom Buttons for specific steps, otherwise default Continue */}
                        {currentStep === 'intake' ? (
                            <Button onClick={handleProceedToPayment} className="gap-2">
                                Proceed to payment
                            </Button>
                        ) : currentStep === 'payment' ? (
                            <div /> /* Managed within Component */
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={currentStepIndex === STEPS.length - 1} // Should allow moving to next step
                                className="gap-2"
                            >
                                Continue <ChevronRight size={16} />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

