import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { CreditCard, Smartphone, Globe, ArrowRight, ShieldCheck, IndianRupee, Store } from 'lucide-react';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const STRIPE_PK = 'pk_test_51SorTn2HwmHF1z4id8ykNC2p4TDOSwRe1No6jJYb5QMkFt7aoumoBbHsK9zguye53R7Ds6iS5No8RwDBhVj4Uki400VYpN2Kq5';
const stripePromise = loadStripe(STRIPE_PK);

interface PaymentProps {
    bookingData: any;
    onPaymentComplete: () => void;
    isProcessing?: boolean;
}

const PAYMENT_METHODS = [
    { id: 'card', label: 'Card Payment', icon: CreditCard, subtitle: 'Secure online payment via Stripe' },
    { id: 'offline', label: 'Pay at Clinic', icon: Store, subtitle: 'Pay via Cash/Card upon arrival' },
];

const StripePaymentForm = ({ onComplete, isProcessing }: { onComplete: () => void, isProcessing: boolean }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message || 'Payment failed');
            console.error('[Stripe Error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setError(null);
            onComplete();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="p-4 border rounded-xl bg-white focus-within:ring-2 ring-primary/20 transition-all">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={cn(
                    "w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20",
                    "hover:bg-primary/90 transition-all flex items-center justify-center gap-3",
                    isProcessing && "opacity-70 cursor-not-allowed"
                )}
            >
                {isProcessing ? "Processing..." : "Pay & Book"} <ArrowRight size={20} />
            </button>
        </form>
    );
};

export const Payment: React.FC<PaymentProps> = ({ bookingData, onPaymentComplete, isProcessing = false }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');

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

            {/* Right: Order Details & Payment Form */}
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

                        <div className="pt-6 border-t-2 border-dashed border-secondary/20 flex justify-between items-center">
                            <span className="text-lg font-display font-bold text-primary italic uppercase tracking-wider">Total Amount</span>
                            <div className="flex items-center gap-1 text-2xl font-display font-bold text-primary">
                                <IndianRupee size={20} />
                                <span>{((bookingData.servicePrice || 0) + 50).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Payment Action */}
                    <div className="relative z-10">
                        {paymentMethod === 'card' ? (
                            <Elements stripe={stripePromise}>
                                <StripePaymentForm onComplete={onPaymentComplete} isProcessing={isProcessing} />
                            </Elements>
                        ) : (
                            <div className="space-y-4 text-center">
                                <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm border border-amber-100">
                                    You can pay the full amount at the clinic reception before your session begins.
                                </div>
                                <button
                                    onClick={onPaymentComplete}
                                    disabled={isProcessing}
                                    className={cn(
                                        "w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20",
                                        "hover:bg-primary/90 transition-all flex items-center justify-center gap-3",
                                        isProcessing && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    {isProcessing ? "Processing..." : "Boook Appointment"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
