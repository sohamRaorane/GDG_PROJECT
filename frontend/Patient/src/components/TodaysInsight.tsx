import { Sparkles } from 'lucide-react';
import { generateInsight } from '../utils/wellness';

interface TodaysInsightProps {
    painLevel?: number;
    sleepQuality?: number;
    taskCompletion?: number;
}

export const TodaysInsight = ({ painLevel, sleepQuality, taskCompletion }: TodaysInsightProps) => {
    const insight = generateInsight({ painLevel, sleepQuality, taskCompletion });

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-[2.5rem] p-8 border border-amber-100/50 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-500 h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Sparkles size={100} className="text-amber-600 rotate-12" />
            </div>
            <div className="relative z-10">
                <h3 className="text-amber-800/80 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-amber-100 pb-2 w-fit">
                    <Sparkles size={14} />
                    Daily Wisdom
                </h3>
                <p className="text-amber-900 font-serif text-xl leading-relaxed italic">
                    "{insight}"
                </p>
                <div className="mt-4 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                </div>
            </div>
        </div>
    );
};
