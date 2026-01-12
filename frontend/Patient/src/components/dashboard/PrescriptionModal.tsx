
import React from 'react';
import { Modal } from '../ui/Modal';
import { Pill, Clock, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export interface Medicine {
    id: string;
    name: string;
    dosage: string;
    frequency: string; // e.g. "1-0-1"
    timing: 'Before Food' | 'After Food';
    duration: string;
    type: 'Tablet' | 'Syrup' | 'Powder' | 'Capsule';
}

export interface PrescriptionData {
    doctorName: string;
    doctorSpecialization: string;
    date: string;
    diagnosis: string;
    medicines: Medicine[];
    advice: string[];
    followUpDate: string;
}

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PrescriptionData;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ isOpen, onClose, data }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl bg-white/95 backdrop-blur-xl border border-white/20">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-slate-800">Prescription Details</h2>
                            <p className="text-sm text-slate-500 font-medium">Dr. {data.doctorName} • {data.doctorSpecialization}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{data.date}</p>
                        </div>
                    </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                    <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Diagnosis</h3>
                    <p className="text-slate-700 font-medium">{data.diagnosis}</p>
                </div>

                {/* Medicines List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Pill size={16} className="text-primary" />
                        Prescribed Medications
                    </h3>
                    <div className="grid gap-3">
                        {data.medicines.map((med) => (
                            <div key={med.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                        <Pill size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{med.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100">{med.type}</span>
                                            <span>•</span>
                                            <span>{med.dosage}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-xs font-bold text-slate-700 bg-emerald-100/50 text-emerald-700 px-2 py-1 rounded inline-block">
                                        {med.frequency}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-1">
                                        <Clock size={10} />
                                        {med.timing}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advice & Lifestyle */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-primary" />
                        Lifestyle & Advice
                    </h3>
                    <ul className="grid gap-2">
                        {data.advice.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-50">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer with Follow-up */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={16} className="text-primary" />
                        <span className="font-medium">Follow up:</span>
                        <span className="font-bold text-slate-800">{data.followUpDate}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
