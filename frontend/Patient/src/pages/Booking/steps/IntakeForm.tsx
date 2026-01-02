import React from 'react';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { cn } from '../../../utils/cn';

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

    const FormInput = ({ label, icon: Icon, type, value, field, placeholder }: any) => (
        <div className="space-y-2 group">
            <label className="text-xs font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
                <Icon size={12} />
                {label}
            </label>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-50/50 border-b-2 border-slate-100 py-3 px-1 focus:border-primary focus:bg-transparent outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
            />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-12 py-4">
            <div className="text-center">
                <h3 className="text-3xl font-display font-bold text-text mb-2 italic">Personal Details</h3>
                <p className="text-slate-400">Please provide your contact information and health concerns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <FormInput
                    label="Full Name"
                    icon={User}
                    type="text"
                    value={data.name}
                    field="name"
                    placeholder="Aditya Raorane"
                />
                <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={data.email}
                    field="email"
                    placeholder="aditya@example.com"
                />
                <FormInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={data.phone}
                    field="phone"
                    placeholder="+91 98765 43210"
                />

                <div className="md:col-span-2 space-y-2 group">
                    <label className="text-xs font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={12} />
                        Symptoms / Concerns
                    </label>
                    <textarea
                        value={data.symptoms || ''}
                        onChange={(e) => handleChange('symptoms', e.target.value)}
                        placeholder="Describe your health concerns or what you'd like to focus on during the session..."
                        className="w-full bg-slate-50/50 border-b-2 border-slate-100 py-3 px-1 focus:border-primary focus:bg-transparent outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300 min-h-[100px] resize-none"
                    />
                </div>
            </div>

            <div className="bg-secondary/20 rounded-2xl p-6 border border-primary/10">
                <p className="text-xs text-primary/70 leading-relaxed italic text-center">
                    "Your health information is secure and managed with absolute confidentiality as per Ayurvedic practice standards."
                </p>
            </div>
        </div>
    );
};
