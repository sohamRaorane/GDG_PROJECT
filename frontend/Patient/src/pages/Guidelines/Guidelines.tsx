
import { useState } from 'react';
import { Shield, Book, Heart, Lock, AlertCircle, FileText, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Guidelines = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('rights');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-12">
            {/* Header */}
            <div className="bg-primary-dark/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-xs font-semibold uppercase tracking-wider mb-3">
                                <Shield size={14} />
                                Official Policy
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
                                Guidelines & Protocols
                            </h1>
                            <p className="text-slate-600 max-w-2xl text-lg">
                                Standard operating procedures, patient rights, and care protocols for your Ayurvedic journey with AyurSutra.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Contents</h3>
                            <button
                                onClick={() => scrollToSection('rights')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${activeSection === 'rights' ? 'bg-white shadow-md text-primary' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Heart size={16} /> Patient Rights
                                </span>
                                {activeSection === 'rights' && <ChevronRight size={14} />}
                            </button>
                            <button
                                onClick={() => scrollToSection('protocols')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${activeSection === 'protocols' ? 'bg-white shadow-md text-primary' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Book size={16} /> Treatment Protocols
                                </span>
                                {activeSection === 'protocols' && <ChevronRight size={14} />}
                            </button>
                            <button
                                onClick={() => scrollToSection('privacy')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${activeSection === 'privacy' ? 'bg-white shadow-md text-primary' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Lock size={16} /> Privacy & Data
                                </span>
                                {activeSection === 'privacy' && <ChevronRight size={14} />}
                            </button>
                            <button
                                onClick={() => scrollToSection('safety')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${activeSection === 'safety' ? 'bg-white shadow-md text-primary' : 'text-slate-600 hover:bg-white/50'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <AlertCircle size={16} /> Safety Policies
                                </span>
                                {activeSection === 'safety' && <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* Patient Rights Section */}
                        <section id="rights" className="scroll-mt-24">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-slate-900">Patient Rights & Responsibilities</h2>
                                        <p className="text-slate-500 text-sm">Last updated: Jan 1, 2024</p>
                                    </div>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        At AyurSutra, we believe in a partnership between the healer and the healed. Understanding your rights helps us provide the best care possible.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Check size={18} className="text-green-500" /> Your Rights
                                            </h3>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To be treated with dignity and respect regardless of background.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To receive clear information about your diagnosis and treatment.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To refuse treatment and be informed of the medical consequences.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To privacy and confidentiality of your medical records.
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <FileText size={18} className="text-blue-500" /> Your Responsibilities
                                            </h3>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To provide accurate health history and current medication details.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To follow the prescribed diet (Pathya) and lifestyle adjustments.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                                                    To respect the clinic staff and other patients' privacy.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Treatment Protocols */}
                        <section id="protocols" className="scroll-mt-24">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Book size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-slate-900">Standard Treatment Protocols</h2>
                                        <p className="text-slate-500 text-sm">Adhering to Ministry of AYUSH Standards</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="border-l-4 border-primary pl-6 py-2">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Panchakarma Preparation (Purvakarma)</h3>
                                        <p className="text-slate-600 mb-4">
                                            All Panchakarma procedures require mandatory preparation including Snehana (Oleation) and Swedana (Sudation). Duration varies from 3-7 days based on patient constitution.
                                        </p>
                                        <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100 flex gap-3">
                                            <AlertCircle size={18} className="shrink-0" />
                                            Failure to follow Purvakarma guidelines may result in cancellation of the main procedure for patient safety.
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-blue-500 pl-6 py-2">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Dietary Restrictions (Pathya-Apathya)</h3>
                                        <p className="text-slate-600">
                                            During active treatment, patients must adhere strictly to the prescribed diet. Outside food is strictly prohibited within clinic premises to prevent adverse interactions with ongoing herbal medication.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Privacy Policy */}
                        <section id="privacy" className="scroll-mt-24">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-slate-900">Privacy & Data Protection</h2>
                                        <p className="text-slate-500 text-sm">Your health data is secure</p>
                                    </div>
                                </div>
                                <div className="prose prose-slate max-w-none text-slate-600">
                                    <p>
                                        We adhere to strict data protection standards. Your medical records are encrypted and accessible only to your treating physicians and authorized medical staff.
                                    </p>
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li>We do not sell your personal or medical data to third parties.</li>
                                        <li>You have the right to request a copy of your medical records at any time.</li>
                                        <li>Anonymized data may be used for research purposes with your explicit consent.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Safety Protocol */}
                        <section id="safety" className="scroll-mt-24">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-slate-900">Safety & Emergency</h2>
                                        <p className="text-slate-500 text-sm">Emergency protocols and contacts</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                    <p className="text-slate-700 font-medium mb-4">
                                        In case of any adverse reaction to medication or therapy:
                                    </p>
                                    <ol className="list-decimal pl-5 space-y-3 text-slate-600">
                                        <li><strong>Stop</strong> the medication/therapy immediately.</li>
                                        <li><strong>Contact</strong> our 24/7 Helpline: <span className="text-primary font-bold">1800-AYU-HELP</span></li>
                                        <li>Visit the nearest emergency healthcare facility if symptoms are severe.</li>
                                    </ol>
                                    <div className="mt-6 pt-6 border-t border-slate-200">
                                        <p className="text-xs text-slate-400">
                                            AyurSutra is a registered Ayurvedic clinic. Our doctors are certified by the National Commission for Indian System of Medicine.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
