import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PaymentProps {
    bookingData: any;
    onPaymentComplete: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ bookingData, onPaymentComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    // Mock processing using booking data
    console.log("Processing payment for:", bookingData);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Payment Method & Details */}
            <div className="flex-1 space-y-8 border border-primary/30 p-8 rounded-xl relative">
                <h3 className="text-lg font-display font-medium text-text mb-6">Choose a payment method</h3>

                <div className="space-y-4">
                    {/* Radio Options */}
                    <div className="space-y-3">
                        {['Credit Card', 'Debit Card', 'UPI Pay', 'Paypal'].map((method) => {
                            const id = method.toLowerCase().replace(' ', '-');
                            return (
                                <label key={id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                                        paymentMethod === id ? "border-primary" : "border-gray-400 group-hover:border-primary"
                                    )}>
                                        {paymentMethod === id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={id}
                                        checked={paymentMethod === id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className={cn(
                                        "text-sm font-medium",
                                        paymentMethod === id ? "text-primary" : "text-gray-600 group-hover:text-primary"
                                    )}>
                                        {method}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Card Form - Only show if Card selected (mocking 'Credit Card' as default visible) */}
                    <div className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-primary uppercase">Name on Card</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border border-primary/30 rounded-lg py-2.5 px-4 focus:border-primary focus:outline-none transition-colors"
                                placeholder="Placeholder"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-primary uppercase">Card Number</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border border-primary/30 rounded-lg py-2.5 px-4 focus:border-primary focus:outline-none transition-colors"
                                placeholder="....... ...... .... ...."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-primary uppercase">Expiration Date</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border border-primary/30 rounded-lg py-2.5 px-4 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="... / ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-primary uppercase">Security Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border border-primary/30 rounded-lg py-2.5 px-4 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="CVV"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="border border-primary/30 rounded-xl p-6 bg-primary/5">
                    <h3 className="text-lg font-display font-medium text-text mb-6 pb-4 border-b border-primary/20">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dental care</span>
                            <span className="font-medium text-text">1000</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-primary/10">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-text">1000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxes</span>
                            <span className="font-medium text-text">100</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-4 border-t border-primary/20">
                            <span className="text-primary">Total</span>
                            <span className="text-primary">1100</span>
                        </div>
                    </div>

                    <button
                        onClick={onPaymentComplete}
                        className="w-full bg-primary/80 hover:bg-primary text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};
