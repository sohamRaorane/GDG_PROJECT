import { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
    isToday
} from 'date-fns';
import { cn } from '../../../utils/cn';
import { ChevronLeft, ChevronRight, Minus, Plus, Clock, Calendar as CalendarIcon, Users, RefreshCw } from 'lucide-react';
import { getAvailableSlotsForService } from '../../../services/scheduling'; // Check path

interface SelectSlotProps {
    bookingData: {
        date: string;
        slot: string;
        peopleCount?: number;
        serviceId?: string;
    };
    onChange: (data: { date?: string; slot?: string; peopleCount?: number; roomId?: string }) => void;
}

// Default fallback slots
const DEFAULT_TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30'
];

export const SelectSlot: React.FC<SelectSlotProps> = ({ bookingData, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [peopleCount, setPeopleCount] = useState(bookingData.peopleCount || 1);

    // Availability State
    const [availableSlots, setAvailableSlots] = useState<{ time: string; roomId: string }[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch slots when Date or Service changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (!bookingData.date || !bookingData.serviceId) return;

            setIsLoadingSlots(true);
            try {
                // If serviceId is present, use smart scheduling
                const slots = await getAvailableSlotsForService(
                    bookingData.serviceId,
                    bookingData.date,
                    bookingData.doctorId
                );
                setAvailableSlots(slots.map(s => ({ time: s.time, roomId: s.availableRoomId })));
            } catch (error) {
                console.error("Error fetching slots:", error);
                // Fallback (no room info, might fail later if checks are strict)
                setAvailableSlots(DEFAULT_TIME_SLOTS.map(t => ({ time: t, roomId: 'default' })));
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [bookingData.date, bookingData.serviceId]);

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

    const selectedDateObj = bookingData.date ? new Date(bookingData.date) : null;

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
            {/* Left: Date Picker (Calendar) */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-xl mb-4">
                    <CalendarIcon size={22} />
                    <span>Select Date</span>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <h4 className="text-2xl font-display font-bold text-text">
                                {format(currentMonth, 'MMMM')}
                            </h4>
                            <span className="text-slate-400 text-sm">{format(currentMonth, 'yyyy')}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                                <ChevronLeft size={20} className="text-slate-600" />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                                <ChevronRight size={20} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                        {['Sun', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat'].map(day => (
                            <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isSelected = bookingData.date === dateStr;
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const today = isToday(day);

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => handleDateClick(day)}
                                    className={cn(
                                        "h-12 w-full rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all relative overflow-hidden",
                                        !isCurrentMonth && "text-slate-300 opacity-40 hover:opacity-100",
                                        isCurrentMonth && !isSelected && "text-slate-600 hover:bg-secondary/30",
                                        isSelected && "bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10",
                                        today && !isSelected && "text-primary ring-1 ring-inset ring-primary/30"
                                    )}
                                >
                                    {format(day, 'd')}
                                    {today && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Date Indicator */}
                {selectedDateObj && (
                    <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                                <CalendarIcon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Selected Date</p>
                                <p className="font-display font-bold text-text">{format(selectedDateObj, 'EEEE, MMMM do, yyyy')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Slots & Capacity */}
            <div className="lg:col-span-5 space-y-10">
                {/* Slots */}
                <div>
                    <div className="flex items-center gap-2 text-primary font-display font-bold text-xl mb-6">
                        <Clock size={22} />
                        <span>Select Time</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {isLoadingSlots ? (
                            <div className="col-span-3 py-8 flex justify-center text-slate-400">
                                <RefreshCw className="animate-spin" />
                            </div>
                        ) : availableSlots.length > 0 ? (
                            availableSlots.map((slotObj) => {
                                const isSelected = bookingData.slot === slotObj.time;
                                return (
                                    <button
                                        key={slotObj.time}
                                        onClick={() => onChange({ slot: slotObj.time, roomId: slotObj.roomId })}
                                        className={cn(
                                            "py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all",
                                            isSelected
                                                ? "border-primary bg-primary text-white shadow-md"
                                                : "border-slate-100 bg-white text-slate-600 hover:border-primary/30 hover:bg-slate-50"
                                        )}
                                    >
                                        {slotObj.time}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-3 text-center text-slate-400 py-4 text-sm">
                                No slots available for this date.
                            </div>
                        )}
                    </div>
                </div>

                {/* Capacity Counter */}
                <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-primary font-display font-bold text-xl mb-6">
                        <Users size={22} />
                        <span>Attendees</span>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-text">Number of people</p>
                            <p className="text-xs text-slate-400">Total participants for this session</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => handlePeopleChange(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-all shadow-sm disabled:opacity-50"
                                disabled={peopleCount <= 1}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-8 text-center font-bold text-xl text-primary">{peopleCount}</span>
                            <button
                                onClick={() => handlePeopleChange(1)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-all shadow-sm"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
