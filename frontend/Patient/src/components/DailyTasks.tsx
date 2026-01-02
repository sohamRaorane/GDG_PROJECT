
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDailyTasks, seedDailyTasks, toggleTaskStatus } from '../services/db';
import type { DailyTask } from '../types/db';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const DailyTasks = () => {
    const { currentUser: user } = useAuth();
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const date = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const loadTasks = async () => {
            if (!user) return;
            try {
                // Try to get tasks, if empty seed them
                let currentTasks = await getDailyTasks(user.uid, date);
                if (currentTasks.length === 0) {
                    currentTasks = await seedDailyTasks(user.uid, date);
                }
                setTasks(currentTasks);
            } catch (error) {
                console.error("Error loading daily tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, [user, date]);

    const handleToggle = async (taskId: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !currentStatus } : t));
        try {
            await toggleTaskStatus(taskId, !currentStatus);
        } catch (error) {
            // Revert on error
            console.error("Error updating task:", error);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: currentStatus } : t));
        }
    };

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    if (loading) return <div className="p-4 text-center text-gray-500">Loading routine...</div>;

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-text">Dinacharya</h3>
                    <p className="text-sm text-gray-500">Your Daily Routine</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-bold text-sm">
                    <Trophy size={16} />
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full mb-6 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                />
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => handleToggle(task.id, task.isCompleted)}
                        className={`
                            group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                            ${task.isCompleted
                                ? 'bg-primary/5 border-primary/20'
                                : 'bg-white/50 border-transparent hover:bg-white hover:shadow-sm'
                            }
                        `}
                    >
                        <div className={`transition-colors ${task.isCompleted ? 'text-primary' : 'text-gray-300 group-hover:text-primary/50'}`}>
                            {task.isCompleted ? <CheckCircle2 size={22} className="fill-current text-primary" /> : <Circle size={22} />}
                        </div>
                        <span className={`flex-1 font-medium transition-colors ${task.isCompleted ? 'text-gray-500 line-through' : 'text-text'}`}>
                            {task.title}
                        </span>
                        {task.category && (
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                {task.category}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
