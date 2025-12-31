import { useState } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
    isToday
} from 'date-fns';
import { cn } from '../../../utils/cn';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

interface SelectSlotProps {
    bookingData: {
        date: string;
        slot: string;
        peopleCount?: number;
    };
    onChange: (data: { date?: string; slot?: string; peopleCount?: number }) => void;
}

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30'
];

export const SelectSlot: React.FC<SelectSlotProps> = ({ bookingData, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [peopleCount, setPeopleCount] = useState(bookingData.peopleCount || 1);

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDateClick = (date: Date) => {
        onChange({ date: format(date, 'yyyy-MM-dd') });
    };

    const handlePeopleChange = (delta: number) => {
        const newCount = Math.max(1, peopleCount + delta);
        setPeopleCount(newCount);
        onChange({ peopleCount: newCount });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Date Picker (Calendar) */}
            <div className="flex-1 max-w-md">
                <h3 className="text-xl font-display font-medium mb-6 text-primary">Date picker</h3>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <span className="font-bold text-gray-700">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-xs font-medium text-gray-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isSelected = bookingData.date === dateStr;
                            const isCurrentMonth = isSameMonth(day, currentMonth);

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => handleDateClick(day)}
                                    disabled={!isCurrentMonth} // Disable functionality for simpler logic/demo
                                    className={cn(
                                        "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all",
                                        !isCurrentMonth && "text-gray-300 pointer-events-none",
                                        isCurrentMonth && !isSelected && "text-text hover:bg-gray-100",
                                        isSelected && "bg-dark-slate text-white hover:bg-dark-slate/90 shadow-md",
                                        isToday(day) && !isSelected && "border border-primary text-primary"
                                    )}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: Slots & Capacity */}
            <div className="flex-1 max-w-md">
                <h3 className="text-xl font-display font-medium mb-6 text-primary">Slots</h3>

                <div className="bg-white p-6 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="grid grid-cols-2 gap-4">
                        {TIME_SLOTS.map((slot) => {
                            const isSelected = bookingData.slot === slot;
                            return (
                                <button
                                    key={slot}
                                    onClick={() => onChange({ slot })}
                                    className={cn(
                                        "py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                                        isSelected
                                            ? "border-primary bg-primary text-white shadow-sm"
                                            : "border-primary/30 bg-white text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Manage Capacity */}
                <div className="mt-8 flex flex-col items-center">
                    <label className="text-sm font-display text-primary mb-3">Number of people</label>
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <button
                            onClick={() => handlePeopleChange(-1)}
                            className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-text">{peopleCount}</span>
                        <button
                            onClick={() => handlePeopleChange(1)}
                            className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <p className="text-[10px] text-primary/60 mt-2 text-center">
                        Limit this according to manage capacity value
                    </p>
                </div>
            </div>
        </div>
    );
};
