import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Check } from "lucide-react";

interface DaySchedule {
    day: string;
    enabled: boolean;
    slots: { start: string; end: string }[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ScheduleManager = () => {
    const [schedule, setSchedule] = useState<DaySchedule[]>(
        DAYS.map((day) => ({
            day,
            enabled: ["Saturday", "Sunday"].includes(day) ? false : true,
            slots: [{ start: "09:00", end: "17:00" }],
        }))
    );

    const toggleDay = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].enabled = !newSchedule[index].enabled;
        setSchedule(newSchedule);
    };

    const updateSlot = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].slots[slotIndex] = {
            ...newSchedule[dayIndex].slots[slotIndex],
            [field]: value,
        };
        setSchedule(newSchedule);
    };

    return (
        <Card title="Weekly Schedule & Working Hours" description="Define your availability for bookings.">
            <div className="space-y-4">
                {schedule.map((day, dayIndex) => (
                    <div key={day.day} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="w-32 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={day.enabled}
                                onChange={() => toggleDay(dayIndex)}
                                className="h-4 w-4 rounded border-gray-300 text-deep-forest focus:ring-deep-forest"
                            />
                            <span className={`font-medium ${day.enabled ? "text-dark-slate" : "text-slate-400"}`}>
                                {day.day}
                            </span>
                        </div>

                        <div className="flex-1">
                            {day.enabled ? (
                                <div className="space-y-2">
                                    {day.slots.map((slot, slotIndex) => (
                                        <div key={slotIndex} className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={slot.start}
                                                onChange={(e) => updateSlot(dayIndex, slotIndex, "start", e.target.value)}
                                                className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-deep-forest focus:outline-none"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="time"
                                                value={slot.end}
                                                onChange={(e) => updateSlot(dayIndex, slotIndex, "end", e.target.value)}
                                                className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-deep-forest focus:outline-none"
                                            />
                                            {/* Placeholder for adding/removing slots logic if needed */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400">Unavailable</span>
                            )}
                        </div>

                        <div className="w-24 text-right">
                            {day.enabled && <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Check className="h-4 w-4" /></Button>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <Button>Save Settings</Button>
            </div>
        </Card>
    );
};

export default ScheduleManager;
