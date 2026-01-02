import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Star,
    Sparkles, Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for Therapists (Recycling DoctorResource structure)
const EXPERTS = [
    {
        id: '1',
        name: 'Dr. Ananya Sharma',
        role: 'Senior Ayurvedic Practitioner',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
    },
    {
        id: '2',
        name: 'Dr. Rajesh Verma',
        role: 'Panchakarma Specialist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
        rating: 4.8,
    },
    {
        id: '3',
        name: 'Dr. Priya Kapoor',
        role: 'Holistic Wellness Coach',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
    },
];

const FAQS = [
    {
        q: "What types of Ayurvedic treatments does AyurSutra provide?",
        a: "AyurSutra offers a wide range of traditional treatments including Panchakarma, Shirodhara, Abhyanga, and personalized diet consultation tailored to your Dosha."
    },
    {
        q: "How do I know which therapy is right for my Dosha?",
        a: "Our initial consultation typically includes a Prakriti analysis where our expert Vaidyas assess your body type and recommend the most suitable treatments."
    },
    {
        q: "What should I expect during my first session?",
        a: "Your first session involves a detailed health assessment, pulse diagnosis (Nadi Pariksha), and a relaxed discussion about your lifestyle and wellness goals."
    },
    {
        q: "Is AyurSutra suitable for chronic conditions?",
        a: "Yes, Ayurveda is highly effective for managing chronic conditions like arthritis, digestive issues, and stress. Our specialists create long-term care plans for sustainable healing."
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen font-sans">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="text-primary" size={24} />
                        <span className="font-display font-bold text-2xl text-text">AyurSutra</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['About', 'Services', 'How it Works', 'Our Team'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-text/70 hover:text-primary font-medium transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>

                    <a href="#contact" className="px-6 py-2.5 rounded-full border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all">
                        Contact
                    </a>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-32 md:pb-48 px-6 md:px-12 overflow-hidden flex items-center min-h-screen">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=2000"
                        alt="Ayurvedic Wellness"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-7xl text-text leading-[1.1]">
                            Wellness Starts with a <span className="italic text-primary">Single Ritual</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-text/70 max-w-lg leading-relaxed font-sans">
                            Compassionate Ayurvedic care, online and in-person. Short-term therapy, long-term results, and a lifetime of balance.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                Book a Session
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-text">Trusted by</p>
                                    <p className="text-primary">30,000+ Users</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Cards Steps (Bottom Hero) */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-10 left-0 right-0 hidden lg:block px-6 md:px-12 pointer-events-none"
                >
                    <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto pointer-events-auto">
                        {[
                            { num: '01', title: 'Free Consultation', desc: 'Complete a short assessment to help us understand your needs, goals, and Prakriti.' },
                            { num: '02', title: 'Match with a Vaidya', desc: 'We\'ll connect you with a licensed professional best suited to your situation.' },
                            { num: '03', title: 'Start Healing Journey', desc: 'Start your sessions online or in-person, track progress, and grow at your own pace.' },
                        ].map((step, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-md border border-white/40 p-8 rounded-[2rem] text-text hover:bg-white transition-all cursor-default shadow-lg shadow-slate-200/20">
                                <span className="block text-primary/30 font-display font-bold text-5xl mb-4">{step.num}</span>
                                <h3 className="font-serif text-2xl mb-2 text-text font-medium">{step.title}</h3>
                                <p className="text-sm text-text/60 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* About Section */}
            <section className="py-32 px-6 md:px-12 bg-white" id="about">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 h-[700px]"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000"
                            alt="Therapy Session"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Sparkles size={28} />
                                </div>
                                <div>
                                    <p className="font-bold text-text text-lg">Personalized Care</p>
                                    <p className="text-sm text-text/60">Support shaped around your unique needs.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-3 text-primary uppercase tracking-widest text-xs font-bold">
                            <span className="w-8 h-[2px] bg-primary" />
                            About Us
                        </div>
                        <h2 className="font-serif text-4xl md:text-6xl text-text leading-tight">
                            Feel supported as you regain <span className="text-primary italic">calm</span> and build confidence.
                        </h2>

                        <div className="border-l-4 border-primary/20 pl-8 py-2">
                            <p className="text-xl text-text/70 italic font-serif leading-relaxed">
                                "Our mission is to bring the ancient wisdom of Ayurveda to modern life, making holistic healing accessible, personalized, and effective for everyone."
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                            {[
                                { val: '250+', label: 'Certified Vaidyas' },
                                { val: '1M+', label: 'Community Members' },
                                { val: '24/7', label: 'Online Assistance' },
                                { val: '100%', label: 'Safe & Private' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <h3 className="font-display font-bold text-4xl md:text-5xl text-text mb-1">{stat.val}</h3>
                                    <p className="text-sm text-text/50 uppercase tracking-widest font-semibold">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-32 px-6 md:px-12 bg-secondary/5" id="our-team">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary uppercase tracking-widest text-xs font-bold">
                                <span className="w-8 h-[2px] bg-primary" />
                                Our Team
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl text-text">Meet Our Expert Vaidyas</h2>
                        </div>
                        <p className="text-text/60 max-w-xs text-left md:text-right">
                            Get guidance from an expert therapist who truly understands your needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {EXPERTS.map((expert, idx) => (
                            <motion.div
                                key={expert.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                                    <img
                                        src={expert.image}
                                        alt={expert.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-display font-bold text-2xl mb-1">{expert.name}</h3>
                                    <p className="text-white/80 font-medium mb-3">{expert.role}</p>
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 w-fit">
                                        <Star size={14} fill="currentColor" className="text-amber-400" />
                                        <span className="text-xs font-bold">{expert.rating} Rating</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-3 text-primary uppercase tracking-widest text-xs font-bold">
                            <span className="w-8 h-[2px] bg-primary" />
                            Testimonials
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl text-text leading-tight">Real Stories From Our Patients</h2>

                        <div className="space-y-8">
                            <blockquote className="text-3xl font-serif text-text/80 leading-relaxed">
                                "I struggled with chronic stress for two years. AyurSutra's program and <span className="text-primary bg-secondary/30 px-2 rounded-lg decoration-clone box-decoration-clone">incredible Vaidyas</span> guided me through a healing process and helped me feel whole again."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                    <img src="https://i.pravatar.cc/100?img=33" alt="Aaron" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text text-lg">Aaron Mitchell</h4>
                                    <p className="text-sm text-text/50 font-medium">Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="rounded-[3rem] overflow-hidden h-[600px] shadow-2xl shadow-primary/10">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
                                alt="Happy Patient"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-sm hidden md:block">
                            <p className="font-serif text-xl italic text-text mb-6">"The best decision I've made for my health."</p>
                            <div className="flex gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-32 px-6 md:px-12 bg-secondary/10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20 space-y-6">
                        <div className="flex items-center justify-center gap-3 text-primary uppercase tracking-widest text-xs font-bold">
                            <span className="w-8 h-[2px] bg-primary" />
                            FAQ
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl text-text">Frequently Asked Questions</h2>
                        <p className="text-text/60 max-w-lg mx-auto text-lg leading-relaxed">
                            Discover care that fits your needs, connects you with the right professional, and supports your growth every step of the way.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-2 transition-all shadow-sm hover:shadow-md">
                                <details className="group">
                                    <summary className="flex items-center justify-between cursor-pointer list-none p-6">
                                        <span className="font-display font-bold text-lg text-text pr-8">{faq.q}</span>
                                        <span className="bg-secondary/30 text-primary rounded-full p-2 transition-transform duration-300 group-open:rotate-180 shrink-0">
                                            <ArrowRight size={20} className="rotate-90" />
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-text/70 leading-relaxed font-body border-t border-slate-100/50 mt-2 pt-4">
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                            {faq.a}
                                        </motion.div>
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="relative py-40 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=2000"
                        alt="CTA Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-7xl mx-auto text-center text-white space-y-10"
                >
                    <h2 className="font-serif text-5xl md:text-7xl mb-6">One Decision Can Change Your Life</h2>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                        Take that one step today that can open doors to a brighter tomorrow. Join the AyurSutra family.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-12 py-6 bg-white text-text font-bold rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 text-lg"
                    >
                        Get Started Today
                    </button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-24 pb-12 px-6 md:px-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Leaf className="text-primary" size={24} />
                            <span className="font-display font-bold text-2xl text-text">AyurSutra</span>
                        </div>
                        <p className="text-text/60 leading-relaxed">
                            Your journey to mental and physical wellness starts here. Ancient wisdom, modern care.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons */}
                            {['tw', 'fb', 'ig', 'li'].map(social => (
                                <div key={social} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text/60 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                    <div className="w-4 h-4 bg-current rounded-sm" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-text/60">
                            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Services</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-6">Services</h4>
                        <ul className="space-y-4 text-text/60">
                            <li><a href="#" className="hover:text-primary transition-colors">Therapy Hub</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Support Groups</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Wellness Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Self-Care Tools</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-text mb-6">Subscribe</h4>
                        <p className="text-text/60">Join our newsletter to stay up to date on features and releases.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="bg-text text-white px-6 py-3 rounded-lg font-bold hover:bg-primary transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-text/40 text-sm">
                    <p>© 2026 AyurSutra. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Cookie Settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
