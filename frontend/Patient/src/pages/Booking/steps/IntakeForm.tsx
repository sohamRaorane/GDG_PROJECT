import React from 'react';

interface IntakeData {
    name?: string;
    email?: string;
    phone?: string;
    symptoms?: string;
}

interface IntakeFormProps {
    data: IntakeData;
    onChange: (data: IntakeData) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ data, onChange }) => {
    const handleChange = (field: keyof IntakeData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h3 className="text-xl font-display font-medium text-text mb-8">Details</h3>

            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    {/* Name */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="w-32 text-sm font-medium text-primary font-display">Name</label>
                        <input
                            type="text"
                            value={data.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="flex-1 bg-transparent border-b border-primary/30 py-2 focus:border-primary focus:outline-none transition-colors placeholder-gray-400/50"
                            placeholder=""
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="w-32 text-sm font-medium text-primary font-display">Email</label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="flex-1 bg-transparent border-b border-primary/30 py-2 focus:border-primary focus:outline-none transition-colors placeholder-gray-400/50"
                            placeholder=""
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="w-32 text-sm font-medium text-primary font-display">Phone number</label>
                        <input
                            type="tel"
                            value={data.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="flex-1 bg-transparent border-b border-primary/30 py-2 focus:border-primary focus:outline-none transition-colors placeholder-gray-400/50"
                            placeholder=""
                        />
                    </div>

                    {/* Symptoms */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <label className="w-32 text-sm font-medium text-primary font-display pt-2">Symptoms</label>
                        <textarea
                            value={data.symptoms || ''}
                            onChange={(e) => handleChange('symptoms', e.target.value)}
                            className="flex-1 bg-transparent border-b border-primary/30 py-2 focus:border-primary focus:outline-none transition-colors min-h-[40px] resize-y placeholder-gray-400/50"
                            placeholder=""
                        />
                    </div>
                </div>
            </div>

            {/* Note: The 'Proceed to payment' button will be handled by the parent Wizard component for consistency */}
        </div>
    );
};
