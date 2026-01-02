import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { CreditCard, Smartphone, Globe, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';

interface PaymentProps {
    bookingData: any;
    onPaymentComplete: () => void;
}

const PAYMENT_METHODS = [
    { id: 'credit-card', label: 'Card Payment', icon: CreditCard, subtitle: 'Visa, Mastercard, Amex' },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Bhim' },
    { id: 'paypal', label: 'PayPal', icon: Globe, subtitle: 'Worldwide payment' },
];

export const Payment: React.FC<PaymentProps> = ({ bookingData, onPaymentComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 py-4">
            {/* Left: Payment Method Selection */}
            <div className="lg:col-span-7 space-y-10">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-display font-bold text-text mb-2 italic">Select Payment</h3>
                    <p className="text-slate-400">Choose your preferred way to secure your session.</p>
                </div>

                <div className="space-y-4">
                    {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.id;
                        return (
                            <div
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={cn(
                                    "group cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 flex items-center gap-6",
                                    isSelected
                                        ? "border-primary bg-secondary/20 shadow-xl shadow-primary/5"
                                        : "border-slate-100 bg-white hover:border-primary/20"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                    isSelected ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className={cn("font-bold text-lg", isSelected ? "text-primary" : "text-text")}>{method.label}</p>
                                    <p className="text-xs text-slate-400 font-medium">{method.subtitle}</p>
                                </div>
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    isSelected ? "border-primary bg-primary" : "border-slate-200"
                                )}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Secure Badge */}
                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <ShieldCheck size={18} className="text-primary" />
                    <span>Your transaction is encrypted and secured with modern SSL standards.</span>
                </div>
            </div>

            {/* Right: Order Details & Summary */}
            <div className="lg:col-span-5">
                <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-xl shadow-slate-200/50 sticky top-8">
                    <h4 className="text-xl font-display font-bold text-text mb-8 italic border-b border-slate-50 pb-4">Order Summary</h4>

                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-bold text-text">Healing Session</p>
                                <p className="text-xs text-slate-400">Therapy & Consultation</p>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-text">
                                <IndianRupee size={14} />
                                <span>1,500</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-50">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <div className="flex items-center gap-1 font-bold text-slate-700">
                                    <IndianRupee size={12} />
                                    <span>1,500</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Service Fee</span>
                                <div className="flex items-center gap-1 font-bold text-slate-700">
                                    <IndianRupee size={12} />
                                    <span>50</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                            <span className="text-lg font-display font-bold text-primary italic uppercase tracking-wider">Total Amount</span>
                            <div className="flex items-center gap-1 text-2xl font-display font-bold text-primary">
                                <IndianRupee size={20} />
                                <span>1,550</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onPaymentComplete}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group"
                    >
                        Complete Booking
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center text-[10px] text-slate-400 font-medium mt-6 uppercase tracking-widest">
                        Prices are inclusive of all healing ritual taxes
                    </p>
                </div>
            </div>
        </div>
    );
};
