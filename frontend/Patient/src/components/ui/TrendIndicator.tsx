import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
    current: number;
    previous: number;
    label?: string;
    inverse?: boolean; // If true, lower is better (e.g., pain level)
}

export const TrendIndicator = ({ current, previous, label, inverse = false }: TrendIndicatorProps) => {
    const change = current - previous;
    const isImproving = inverse ? change < 0 : change > 0;
    const isStable = change === 0;

    const getColor = () => {
        if (isStable) return 'text-slate-400';
        return isImproving ? 'text-emerald-600' : 'text-red-500';
    };

    const getIcon = () => {
        if (isStable) return <Minus size={16} />;
        if (isImproving) return <TrendingDown size={16} className="rotate-180" />;
        return <TrendingUp size={16} />;
    };

    const getLabel = () => {
        if (isStable) return 'Stable';
        return isImproving ? 'Improving' : 'Worsening';
    };

    return (
        <div className={`inline-flex items-center gap-1 ${getColor()}`}>
            {getIcon()}
            <span className="text-xs font-semibold">{label || getLabel()}</span>
        </div>
    );
};
