import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Check, Clock, CalendarDays, Plus, Trash2 } from "lucide-react";

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
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="text-emerald-400" />
                            Weekly Availability
                        </h2>
                        <p className="text-indigo-200 mt-1 text-sm max-w-md">
                            Define your standard working hours. These settings will repeat weekly and determine generally available slots for booking.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                        <span className="text-2xl font-bold text-emerald-400">{schedule.filter(d => d.enabled).length}</span>
                        <span className="text-xs text-indigo-200 ml-2 font-medium uppercase tracking-wide">Active Days</span>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="divide-y divide-slate-100">
                    {schedule.map((day, dayIndex) => (
                        <div
                            key={day.day}
                            className={`p-4 transition-all duration-300 hover:bg-slate-50 ${day.enabled ? 'opacity-100' : 'opacity-60 grayscale-[0.5]'}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Day Toggle */}
                                <div className="w-40 flex items-center gap-3">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`toggle-${day.day}`}
                                            checked={day.enabled}
                                            onChange={() => toggleDay(dayIndex)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <label
                                        htmlFor={`toggle-${day.day}`}
                                        className={`font-semibold cursor-pointer select-none transition-colors ${day.enabled ? "text-slate-800" : "text-slate-400"}`}
                                    >
                                        {day.day}
                                    </label>
                                </div>

                                {/* Slots */}
                                <div className="flex-1">
                                    {day.enabled ? (
                                        <div className="space-y-3">
                                            {day.slots.map((slot, slotIndex) => (
                                                <div key={slotIndex} className="flex items-center gap-3 group">
                                                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                                                        <input
                                                            type="time"
                                                            value={slot.start}
                                                            onChange={(e) => updateSlot(dayIndex, slotIndex, "start", e.target.value)}
                                                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                                                        />
                                                        <span className="text-slate-400 px-1 text-xs font-medium">TO</span>
                                                        <input
                                                            type="time"
                                                            value={slot.end}
                                                            onChange={(e) => updateSlot(dayIndex, slotIndex, "end", e.target.value)}
                                                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                                                        />
                                                    </div>

                                                    {/* Add/Remove Slot Actions (Placeholder UI) */}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                        <button className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors" title="Remove Slot">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Add Slot">
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400 italic text-sm py-2">
                                            <CalendarDays className="h-4 w-4" />
                                            Unavailable
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end rounded-b-xl">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 text-white font-medium px-8">
                        Save Schedule Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ScheduleManager;
