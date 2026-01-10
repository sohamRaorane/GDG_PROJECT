import React from 'react';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';


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

interface FormInputProps {
    label: string;
    icon: any;
    type: string;
    value: string | undefined;
    field: keyof IntakeData;
    placeholder: string;
    onChange: (field: keyof IntakeData, value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, type, value, field, placeholder, onChange }) => (
    <div className="space-y-3 group">
        <label className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
            <Icon size={14} className="text-accent" />
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-secondary/20 rounded-2xl py-4 px-5 focus:border-primary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-text font-medium placeholder:text-text/30 placeholder:italic shadow-sm"
            />
        </div>
    </div>
);

export const IntakeForm: React.FC<IntakeFormProps> = ({ data, onChange }) => {
    const handleChange = (field: keyof IntakeData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-12 py-4">
            <div className="text-center">
                <h3 className="text-3xl font-display font-medium text-text mb-2 italic">Personal Details</h3>
                <p className="text-text/60 font-serif italic">Please provide your contact information and health concerns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <FormInput
                    label="Full Name"
                    icon={User}
                    type="text"
                    value={data.name}
                    field="name"
                    placeholder="Write your name"
                    onChange={handleChange}
                />
                <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={data.email}
                    field="email"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                />
                <FormInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={data.phone}
                    field="phone"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                />

                <div className="md:col-span-2 space-y-3 group">
                    <label className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={14} className="text-accent" />
                        Symptoms / Concerns
                    </label>
                    <textarea
                        value={data.symptoms || ''}
                        onChange={(e) => handleChange('symptoms', e.target.value)}
                        placeholder="Describe your health concerns or what you'd like to focus on during the session..."
                        className="w-full bg-white border border-secondary/20 rounded-3xl py-4 px-5 focus:border-primary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-text font-medium placeholder:text-text/30 placeholder:italic min-h-[120px] resize-none shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-secondary/20 rounded-3xl p-8 border border-primary/5 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                <p className="text-sm text-primary/80 leading-relaxed italic text-center font-serif relative z-10">
                    "Your health information is secure and managed with absolute confidentiality as per Ayurvedic practice standards."
                </p>
            </div>
        </div>
    );
};
