import React from 'react';

interface SentimentSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    icon?: React.ReactNode;
    colorClass?: string;
}

const getEmoji = (value: number, max: number) => {
    const percentage = value / max;
    if (percentage <= 0.3) return '😊';
    if (percentage <= 0.7) return '😐';
    return '😢';
};

export const SentimentSlider: React.FC<SentimentSliderProps> = ({
    label,
    value,
    onChange,
    min = 1,
    max = 10,
    icon,
    colorClass = "text-primary"
}) => {
    return (
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    {icon} {label}
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-bounce-short">{getEmoji(value, max)}</span>
                    <span className={`font-bold text-lg ${colorClass}`}>{value}</span>
                </div>
            </div>
            <div className="relative pt-1">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};
