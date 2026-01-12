import React, { useMemo } from 'react';

interface SmartSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    type: 'pain' | 'appetite' | 'sleep';
    icon?: React.ReactNode;
}

const getContext = (value: number, type: 'pain' | 'appetite' | 'sleep', max: number) => {
    const percentage = value / max;

    if (type === 'pain') {
        if (value <= 3) return { text: "Mild discomfort, manageable", emoji: "😊", color: "text-emerald-500", bg: "bg-emerald-500" };
        if (value <= 6) return { text: "Moderate pain, take care", emoji: "😐", color: "text-amber-500", bg: "bg-amber-500" };
        return { text: "Severe pain, rest needed", emoji: "😣", color: "text-red-500", bg: "bg-red-500" };
    }
    if (type === 'appetite') {
        if (value <= 3) return { text: "Low appetite, try light meals", emoji: "😶", color: "text-amber-500", bg: "bg-amber-500" };
        if (value <= 7) return { text: "Healthy appetite", emoji: "😋", color: "text-emerald-500", bg: "bg-emerald-500" };
        return { text: "Very high appetite", emoji: "🍽️", color: "text-blue-500", bg: "bg-blue-500" };
    }
    if (type === 'sleep') {
        if (value <= 4) return { text: "Poor sleep, rest more today", emoji: "😴", color: "text-amber-600", bg: "bg-amber-600" };
        if (value <= 7) return { text: "Moderate rest", emoji: "😌", color: "text-blue-400", bg: "bg-blue-400" };
        return { text: "Deep restorative sleep", emoji: "🤩", color: "text-indigo-600", bg: "bg-indigo-600" };
    }
    return { text: "", emoji: "", color: "", bg: "" };
};

export const SmartSlider: React.FC<SmartSliderProps> = ({
    label,
    value,
    onChange,
    min = 1,
    max = 10,
    type,
    icon
}) => {
    const { text, emoji, color, bg } = useMemo(() => getContext(value, type, max), [value, type, max]);

    // Dynamic background gradient based on value percentage
    const getBackgroundStyle = () => {
        const percentage = ((value - min) / (max - min)) * 100;
        return {
            background: `linear-gradient(to right, currentColor 0%, currentColor ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
        };
    };

    return (
        <div className="space-y-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                    <span className={`p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-${color.split('-')[1]}-50 group-hover:${color} transition-colors`}>
                        {icon}
                    </span>
                    {label}
                </label>
                <div className="flex items-center gap-3">
                    <span className="text-2xl animate-bounce-short filter drop-shadow-sm transform transition-transform hover:scale-110 cursor-default" title="Mood">{emoji}</span>
                    <span className={`font-display font-bold text-2xl ${color} tabular-nums transition-colors`}>{value}</span>
                </div>
            </div>

            <div className="relative py-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${color}`}
                    style={getBackgroundStyle()}
                />

                {/* Custom Thumb Glow Effect (Visual only, CSS handles actual thumb) */}
                <style>{`
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: white;
                        border: 2px solid currentColor;
                        box-shadow: 0 0 0 4px rgba(255, 255, 255, 1), 0 4px 6px rgba(0,0,0,0.1);
                        margin-top: -8px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                        transition: transform 0.1s;
                    }
                    input[type=range]::-webkit-slider-thumb:hover {
                        transform: scale(1.2);
                        cursor: grab;
                    }
                    input[type=range]:active::-webkit-slider-thumb {
                        cursor: grabbing;
                        transform: scale(1.1);
                    }
                `}</style>

                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-wider">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>

            <div className={`text-xs font-semibold text-center py-1 px-3 rounded-full bg-slate-50 mx-auto w-max border border-slate-100 ${color}`}>
                {text}
            </div>
        </div>
    );
};
