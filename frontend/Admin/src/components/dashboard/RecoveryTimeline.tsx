
import type { ActiveTherapy } from "../../types/db";
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface RecoveryTimelineProps {
    therapy: ActiveTherapy;
}

export const RecoveryTimeline = ({ therapy }: RecoveryTimelineProps) => {
    const { totalDays, currentDay } = therapy;

    // Generate timeline items
    const items = Array.from({ length: totalDays }, (_, i) => {
        const dayNum = i + 1;
        const isCompleted = dayNum < currentDay;
        const isCurrent = dayNum === currentDay;

        // Titles and Descriptions
        let title = `Day ${dayNum}`;
        let subTitle = "Standard Treatment";
        let description = "Follow the standard diet and rest protocols today to ensure maximum benefit.";

        if (dayNum === 1) {
            subTitle = "Initial Phase";
            description = "Beginning of the treatment cycle. Follow prescribed protocols.";
        } else if (dayNum === Math.floor(totalDays / 2)) {
            subTitle = "Core Treatment";
            description = "Mid-point of the therapy. Ensure all parameters are within normal range.";
        } else if (dayNum === totalDays) {
            subTitle = "Completion Phase";
            description = "Final day of treatment. Review progress and plan next steps.";
        }

        return { dayNum, title, subTitle, description, isCompleted, isCurrent };
    });

    return (
        <div className="relative pl-4 sm:pl-0">
            {items.map((item, idx) => (
                <div key={item.dayNum} className="relative pl-8 sm:pl-32 py-6 group">
                    {/* Vertical Line */}
                    {idx !== items.length - 1 && (
                        <div
                            className={`absolute left-8 sm:left-32 top-8 w-[2px] h-full -ml-[1px] 
                            ${item.isCompleted ? 'bg-teal-600' : 'bg-slate-200'}`}
                            aria-hidden="true"
                        />
                    )}

                    {/* Timeline Date/Day Label (Desktop: Left, Mobile: Hidden/Integrated) */}
                    <div className="hidden sm:flex absolute left-0 top-6 w-24 justify-end items-center pr-4">
                        <span className={`text-sm font-bold tracking-wider uppercase
                            ${item.isCurrent ? 'text-teal-700' : 'text-slate-400'}`}>
                            {item.title}
                        </span>
                    </div>

                    {/* Icon / Dot */}
                    <div className={`absolute left-8 sm:left-32 top-6 flex items-center justify-center w-8 h-8 rounded-full -translate-x-1/2 ring-4 ring-white z-10
                        ${item.isCompleted ? 'bg-teal-600 text-white' :
                            item.isCurrent ? 'bg-white border-2 border-teal-600 text-teal-600' :
                                'bg-slate-100 border-2 border-slate-200 text-slate-300'}
                    `}>
                        {item.isCompleted ? <CheckCircle size={16} /> :
                            item.isCurrent ? <Clock size={16} className="animate-pulse" /> :
                                <Circle size={14} />}
                    </div>

                    {/* Content Card */}
                    <div className={`rounded-xl border p-5 transition-all duration-300
                        ${item.isCurrent
                            ? 'bg-white border-teal-200 shadow-md scale-[1.02]'
                            : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}
                    `}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-serif text-lg font-bold
                                ${item.isCurrent ? 'text-teal-900' : 'text-slate-700'}
                            `}>
                                <span className="sm:hidden mr-2">{item.title}:</span>
                                {item.subTitle}
                            </h3>
                            {item.isCurrent && (
                                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                    Today
                                </span>
                            )}
                        </div>
                        <p className={`text-sm leading-relaxed
                            ${item.isCurrent ? 'text-slate-600' : 'text-slate-500'}
                        `}>
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
