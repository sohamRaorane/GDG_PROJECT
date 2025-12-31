
import { Button } from '../../components/ui/Button';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-12 pb-12">
            {/* Hero Section */}
            <section className="relative bg-secondary/30 py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Sparkles size={16} />
                        <span>Rediscover Ancient Healing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-text leading-tight">
                        Your Journey to <span className="text-primary">Holistic Wellness</span> Starts Here
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience authentic Panchakarma therapies tailored to your body type. Book your consultation today and begin your path to rejuvenation.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button size="lg" onClick={() => navigate('/book')}>
                            Book Appointment
                        </Button>
                        <Button variant="outline" size="lg">
                            View Services
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-display text-text">Popular Therapies</h2>
                    <Button variant="ghost" className="hidden md:flex gap-2">View all <ArrowRight size={16} /></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mock Cards */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="aspect-video bg-gray-100 group-hover:bg-gray-200 transition-colors relative">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    Image Placeholder
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Detox</span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> 7 Days</span>
                                </div>
                                <h3 className="text-lg font-bold text-text">Abhyanga & Swedana</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">A full-body massage with warm herbal oils followed by herbal steam bath to flush out toxins.</p>
                                <div className="pt-2 flex items-center justify-between">
                                    <span className="font-bold text-text">$120</span>
                                    <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">Book</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
