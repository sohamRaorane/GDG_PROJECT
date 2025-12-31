import React from 'react';



interface BookingData {
    serviceId: string;
    doctorId: string; // resourceId
    date: string;
    slot: string;
    peopleCount?: number;
    intakeValues: {
        name?: string;
        email?: string; // Updated from Phone
        phone?: string;
        symptoms?: string;
        [key: string]: string | undefined;
    };
}

interface ConfirmationProps {
    bookingData: BookingData;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ bookingData }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Success Banner */}
            <div className="border border-primary rounded-2xl p-6 text-center bg-primary/5 relative overflow-hidden">
                <h2 className="text-2xl font-display font-medium text-text mb-2">Appointment Reserved</h2>
                <p className="text-primary/80 text-sm">
                    You will get a mail when organiser confirms your booking
                </p>
                {/* Decorative curved line could go here with SVG if needed */}
            </div>

            <div className="border border-primary/30 rounded-xl p-8 relative">
                <div className="absolute -top-4 left-8 bg-white px-4">
                    <span className="border border-primary/50 text-primary rounded-full px-4 py-1 text-sm font-medium">
                        Appointment confirmed
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mt-4">
                    {/* Time */}
                    <div className="space-y-1">
                        <label className="text-sm font-display text-primary">Time</label>
                        <div className="font-display text-xl text-text">
                            {bookingData.date}, {bookingData.slot}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button className="text-[10px] border border-gray-300 rounded px-2 py-0.5 text-gray-500 hover:border-primary hover:text-primary transition-colors">
                                Google calendar
                            </button>
                            <button className="text-[10px] border border-gray-300 rounded px-2 py-0.5 text-gray-500 hover:border-primary hover:text-primary transition-colors">
                                Outlook calendar
                            </button>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                        <label className="text-sm font-display text-primary">Duration</label>
                        <div className="font-display text-xl text-text">
                            30 min
                        </div>
                    </div>

                    {/* People Count */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-display text-primary">No of people</label>
                        <div className="font-display text-xl text-text">
                            {bookingData.peopleCount || 1}
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-display text-primary">Venue</label>
                        <div className="font-display text-lg text-text leading-relaxed">
                            Doctor's Office<br />
                            64 Doctor Street<br />
                            Springfield 380005<br />
                            Ahmedabad
                        </div>
                    </div>
                </div>

                {/* Footer Message & Cancel */}
                <div className="flex flex-col md:flex-row justify-between items-end mt-12 gap-6">
                    <div className="border border-primary/30 rounded-xl p-4 text-sm text-center md:text-left bg-primary/5 max-w-sm">
                        Thank you for your trust we look forward to meeting you
                    </div>

                    <button className="text-primary hover:text-red-500 underline underline-offset-4 text-sm font-medium transition-colors">
                        cancel your appointment
                    </button>
                </div>
            </div>
        </div>
    );
};
