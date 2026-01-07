import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface VedicMarqueeProps {
    painLevel?: number;
}

export const VedicMarquee = ({ painLevel = 0 }: VedicMarqueeProps) => {
    // Dynamic wisdom based on pain level
    const getWisdom = () => {
        if (painLevel > 7) return [
            "Pain is a signal to rest. Honor your body's need for stillness.",
            "Apply warm sesame oil to soothe the Vata aggravation causing pain.",
            "Deep breathing (Pranayama) calms the nervous system and reduces pain perception."
        ];
        if (painLevel > 3) return [
            "Gentle movement helps circulate Prana and reduce stagnation.",
            "Warm water is the nectar of digestion and healing.",
            "Sleep is the nurse of the world – prioritize rest tonight."
        ];
        return [
            "Vitality flows when the mind is calm and the body is active.",
            "Maintain your balance with consistent Dinacharya.",
            "Gratitude is the healthiest of all human emotions."
        ];
    };

    const messages = getWisdom();

    return (
        <div className="w-full bg-amber-50/90 backdrop-blur-sm border-y border-amber-100/50 py-3 overflow-hidden relative group shadow-sm z-30">
            <div className="flex gap-16 whitespace-nowrap">
                <motion.div
                    className="flex gap-16 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear"
                    }}
                >
                    {[...messages, ...messages, ...messages].map((msg, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-amber-900 font-serif text-lg italic font-medium">
                                "{msg}"
                            </span>
                            <Sparkles size={16} className="text-amber-500" />
                        </div>
                    ))}
                </motion.div>
                {/* Duplicate for seamless loop */}
                <motion.div
                    className="flex gap-16 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear"
                    }}
                >
                    {[...messages, ...messages, ...messages].map((msg, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-amber-900 font-serif text-lg italic font-medium">
                                "{msg}"
                            </span>
                            <Sparkles size={16} className="text-amber-500" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-amber-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-amber-50 to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};
