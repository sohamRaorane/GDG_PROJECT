interface WellnessData {
    painLevel: number; // 0-10
    sleepQuality: number; // 0-10
    taskCompletion: number; // 0-100 percentage
    appointmentAdherence: number; // 0-100 percentage
}

export const calculateWellnessScore = (data: Partial<WellnessData>): number => {
    const {
        painLevel = 5,
        sleepQuality = 5,
        taskCompletion = 50,
        appointmentAdherence = 100
    } = data;

    // Normalize pain (inverse: 0 = best, 10 = worst) to 0-100
    const painScore = ((10 - painLevel) / 10) * 100;

    // Normalize sleep (0 = worst, 10 = best) to 0-100
    const sleepScore = (sleepQuality / 10) * 100;

    // Task and appointment are already 0-100

    // Weighted average
    const weightedScore = (
        painScore * 0.3 +
        sleepScore * 0.25 +
        taskCompletion * 0.25 +
        appointmentAdherence * 0.2
    );

    return Math.round(weightedScore);
};

export const getWellnessColor = (score: number): string => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
};

export const getWellnessLabel = (score: number): string => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Needs Attention';
};

export const generateInsight = (data: Partial<WellnessData>): string => {
    const insights: string[] = [];

    if (data.painLevel && data.painLevel <= 3) {
        insights.push("Your pain levels are well-managed! 🎉");
    } else if (data.painLevel && data.painLevel >= 7) {
        insights.push("Consider discussing pain management with your doctor.");
    }

    if (data.taskCompletion && data.taskCompletion >= 90) {
        insights.push("Amazing consistency with your daily tasks!");
    } else if (data.taskCompletion && data.taskCompletion < 50) {
        insights.push("Try to complete more daily tasks for better recovery.");
    }

    if (data.sleepQuality && data.sleepQuality >= 8) {
        insights.push("Great sleep quality supports healing!");
    }

    return insights[0] || "Keep following your treatment plan consistently.";
};
