import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SentimentSlider } from '../ui/SentimentSlider';
import { Thermometer, CheckCircle2 } from 'lucide-react';

interface MicroSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    therapyName: string;
}

export const MicroSurveyModal: React.FC<MicroSurveyModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    therapyName
}) => {
    const [oilTemp, setOilTemp] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        onSubmit({ oilTemp, therapyName, timestamp: new Date() });
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`p-6 transition-all duration-500 ${submitted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Thermometer size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Quick Feedback</h3>
                        <p className="text-xs text-slate-500">Post-{therapyName} micro-survey</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <SentimentSlider
                        label="How was the oil temperature today?"
                        value={oilTemp}
                        onChange={setOilTemp}
                        min={1}
                        max={10}
                        colorClass="text-primary"
                    />

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">Skip</Button>
                        <Button onClick={handleSubmit} className="flex-1 shadow-lg shadow-primary/20">Submit</Button>
                    </div>
                </div>
            </div>

            {submitted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
                    <p className="text-slate-500 text-sm">Your feedback helps us personalize your healing journey.</p>
                </div>
            )}
        </Modal>
    );
};
