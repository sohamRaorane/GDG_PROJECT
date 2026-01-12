import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MessageSquare, Loader2, Info } from 'lucide-react';
import { getIntakeForm } from '../../../services/db';
import type { IntakeFormField } from '../../../types/db';

interface IntakeData {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
}

interface IntakeFormProps {
    data: IntakeData;
    onChange: (data: IntakeData) => void;
    onValidityChange?: (isValid: boolean) => void;
}

interface FormInputProps {
    label: string;
    icon: any;
    type: string;
    value: string | undefined;
    field: string;
    placeholder: string;
    required?: boolean;
    onChange: (field: string, value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, type, value, field, placeholder, required, onChange }) => (
    <div className="space-y-3 group">
        <label className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
            <Icon size={14} className="text-accent" />
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full bg-white border border-secondary/20 rounded-2xl py-4 px-5 focus:border-primary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-text font-medium placeholder:text-text/30 placeholder:italic shadow-sm"
            />
        </div>
    </div>
);

export const IntakeForm: React.FC<IntakeFormProps> = ({ data, onChange, onValidityChange }) => {
    const [dynamicFields, setDynamicFields] = useState<IntakeFormField[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const fields = await getIntakeForm();
                if (fields) {
                    setDynamicFields(fields);
                }
            } catch (error) {
                console.error("Failed to load intake questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFields();
    }, []);

    // Validation Effect
    useEffect(() => {
        if (!onValidityChange) return;

        const isPersonalDetailsValid = !!data.name && !!data.email && !!data.phone;
        if (!isPersonalDetailsValid) {
            onValidityChange(false);
            return;
        }

        const areDynamicFieldsValid = dynamicFields.every(field => {
            if (!field.required) return true;
            const val = data[field.label];
            return val && val.toString().trim() !== '';
        });

        onValidityChange(areDynamicFieldsValid);
    }, [data, dynamicFields, onValidityChange]);

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const renderDynamicField = (field: IntakeFormField) => {
        const value = data[field.label] || ''; // Use label as key for simplicity, or generate a safe key

        // Common wrapper style
        const wrapperClass = "space-y-3 group";
        const labelClass = "text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2";

        if (field.type === 'select') {
            return (
                <div key={field.id} className={wrapperClass}>
                    <label className={labelClass}>
                        <Info size={14} className="text-accent" />
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <div className="relative">
                        <select
                            value={value}
                            onChange={(e) => handleChange(field.label, e.target.value)}
                            className="w-full bg-white border border-secondary/20 rounded-2xl py-4 px-5 focus:border-primary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-text font-medium shadow-sm appearance-none cursor-pointer"
                            required={field.required}
                        >
                            <option value="" disabled>Select an option</option>
                            {field.options?.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <div key={field.id} className={`${wrapperClass} md:col-span-2`}>
                    <label className={labelClass}>
                        <MessageSquare size={14} className="text-accent" />
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <textarea
                        value={value}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full bg-white border border-secondary/20 rounded-3xl py-4 px-5 focus:border-primary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-text font-medium placeholder:text-text/30 placeholder:italic min-h-[100px] resize-none shadow-sm"
                        required={field.required}
                    />
                </div>
            );
        }

        if (field.type === 'checkbox') {
            return (
                <div key={field.id} className={`${wrapperClass} md:col-span-2 flex items-center gap-4`}>
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => handleChange(field.label, e.target.checked)}
                        className="w-6 h-6 rounded-md border-secondary/30 text-primary focus:ring-primary/20"
                    />
                    <label className="text-sm font-bold text-primary/80 cursor-pointer select-none">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                </div>
            );
        }

        // Default Text
        return (
            <FormInput
                key={field.id}
                label={field.label}
                icon={Info}
                type="text"
                value={value}
                field={field.label}
                placeholder="Type here..."
                required={field.required}
                onChange={(f, v) => handleChange(field.label, v)}
            />
        );
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
                    required
                />
                <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={data.email}
                    field="email"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={data.phone}
                    field="phone"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    required
                />

                {/* Render Dynamic Fields */}
                {loading ? (
                    <div className="md:col-span-2 flex justify-center py-8">
                        <Loader2 className="animate-spin text-primary/50" />
                    </div>
                ) : (
                    dynamicFields.map(field => renderDynamicField(field))
                )}
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
