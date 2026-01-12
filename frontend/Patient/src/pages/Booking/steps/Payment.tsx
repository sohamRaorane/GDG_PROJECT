import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { CreditCard, Smartphone, Globe, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentProps {
    bookingData: any;
    onPaymentComplete: () => void;
    isProcessing?: boolean;
}

const PAYMENT_METHODS = [
    { id: 'credit-card', label: 'Card Payment', icon: CreditCard, subtitle: 'Visa, Mastercard, Amex' },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Bhim' },
    { id: 'paypal', label: 'PayPal', icon: Globe, subtitle: 'Worldwide payment' },
];

export const Payment: React.FC<PaymentProps> = ({ bookingData, onPaymentComplete, isProcessing = false }) => {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 py-4">
            {/* Left: Payment Method Selection */}
            <div className="lg:col-span-7 space-y-10">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-display font-medium text-text mb-2 italic">Select Payment</h3>
                    <p className="text-text/60 font-serif italic">Choose your preferred way to secure your session.</p>
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
                                    "group cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center gap-6 relative overflow-hidden",
                                    isSelected
                                        ? "border-primary bg-secondary/10 shadow-xl shadow-primary/5"
                                        : "border-secondary/20 bg-white hover:border-secondary/40 hover:shadow-lg"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                    isSelected ? "bg-primary text-white" : "bg-secondary/10 text-secondary group-hover:bg-secondary/20 group-hover:text-primary"
                                )}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <p className={cn("font-bold text-lg", isSelected ? "text-primary" : "text-text")}>{method.label}</p>
                                    <p className="text-xs text-text/50 font-medium mt-0.5">{method.subtitle}</p>
                                </div>
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10",
                                    isSelected ? "border-primary bg-primary" : "border-secondary/30"
                                )}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>

                                {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent skew-x-12" />}
                            </div>
                        );
                    })}
                </div>

                {/* Secure Badge */}
                <div className="flex items-center gap-3 text-primary/60 text-sm font-medium bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                    <ShieldCheck size={18} className="text-primary" />
                    <span>Your transaction is encrypted and secured with modern SSL standards.</span>
                </div>
            </div>

            {/* Right: Order Details & Summary */}
            <div className="lg:col-span-5">
                <div className="bg-white rounded-[2.5rem] border-2 border-secondary/20 p-8 shadow-xl shadow-secondary/5 sticky top-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-bl-[100px] -mr-10 -mt-10" />

                    <h4 className="text-xl font-display font-medium text-text mb-8 italic border-b-2 border-dashed border-secondary/20 pb-4 relative z-10">Order Summary</h4>

                    <div className="space-y-6 mb-10 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-bold text-text">Healing Session</p>
                                <p className="text-xs text-secondary/60 italic">Therapy & Consultation</p>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-text">
                                <IndianRupee size={14} />
                                <span>{bookingData.servicePrice?.toLocaleString() || '0'}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-start pt-4 border-t border-dashed border-secondary/20">
                            <div>
                                <p className="text-sm text-secondary/60 font-medium mb-1 uppercase tracking-wider text-[10px]">Date & Time</p>
                                <p className="font-bold text-text text-base">{bookingData.date ? format(new Date(bookingData.date), 'MMM do, yyyy') : 'Date not set'}</p>
                                <p className="text-xs text-text/50 mt-0.5">{bookingData.slot || 'Time not set'}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-secondary/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-text/60 font-medium">Subtotal</span>
                                <div className="flex items-center gap-1 font-bold text-text/80">
                                    <IndianRupee size={12} />
                                    <span>{bookingData.servicePrice?.toLocaleString() || '0'}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text/60 font-medium">Service Fee</span>
                                <div className="flex items-center gap-1 font-bold text-text/80">
                                    <IndianRupee size={12} />
                                    <span>50</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-secondary/20 flex justify-between items-center">
                            <span className="text-lg font-display font-bold text-primary italic uppercase tracking-wider">Total Amount</span>
                            <div className="flex items-center gap-1 text-2xl font-display font-bold text-primary">
                                <IndianRupee size={20} />
                                <span>{((bookingData.servicePrice || 0) + 50).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onPaymentComplete}
                        disabled={isProcessing}
                        className={cn(
                            "w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 border-b-4 border-primary/20 active:border-b-0 active:translate-y-1",
                            "hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group relative overflow-hidden",
                            isProcessing && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <span className="relative z-10">{isProcessing ? "Processing..." : "Complete Booking"}</span>
                        {!isProcessing && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>

                    <p className="text-center text-[10px] text-text/30 font-bold mt-6 uppercase tracking-widest relative z-10">
                        Prices are inclusive of all healing ritual taxes
                    </p>
                </div>
            </div>
        </div>
    );
};
