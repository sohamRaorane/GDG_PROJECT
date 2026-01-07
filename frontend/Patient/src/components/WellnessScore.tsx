import { ProgressRing } from './ui/ProgressRing';
import { calculateWellnessScore, getWellnessColor, getWellnessLabel } from '../utils/wellness';

interface WellnessScoreProps {
    painLevel?: number;
    sleepQuality?: number;
    taskCompletion?: number;
    appointmentAdherence?: number;
}

export const WellnessScore = ({
    painLevel = 5,
    sleepQuality = 7,
    taskCompletion = 75,
    appointmentAdherence = 100
}: WellnessScoreProps) => {
    const score = calculateWellnessScore({ painLevel, sleepQuality, taskCompletion, appointmentAdherence });
    const color = getWellnessColor(score);
    const label = getWellnessLabel(score);

    return (
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg flex items-center gap-6 relative overflow-hidden group">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50"></div>

            <div className="relative z-10">
                <ProgressRing
                    progress={score}
                    size={100}
                    color={color}
                    strokeWidth={10}
                    showPercentage={false}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
                        <span className="text-xs text-slate-500 font-semibold">Wellness</span>
                    </div>
                </ProgressRing>
            </div>

            <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {label} Health
                </h3>
                <p className="text-sm text-slate-500">
                    Your overall wellness score based on pain, sleep, and activity.
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                    <MetricPill label="Pain" value={10 - painLevel} />
                    <MetricPill label="Sleep" value={sleepQuality} />
                    <MetricPill label="Tasks" value={Math.round(taskCompletion / 10)} />
                </div>
            </div>
        </div>
    );
};

const MetricPill = ({ label, value }: { label: string; value: number }) => (
    <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
        {label}: {value}/10
    </div>
);
