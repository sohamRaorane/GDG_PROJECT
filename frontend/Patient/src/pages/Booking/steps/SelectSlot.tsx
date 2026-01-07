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
        doctorId?: string;
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
                <div className="flex items-center gap-2 text-primary font-display font-medium text-xl mb-4 italic">
                    <CalendarIcon size={20} />
                    <span>Select Date</span>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border-4 border-secondary/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-[100px] -mr-8 -mt-8" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex flex-col">
                            <h4 className="text-2xl font-display font-bold text-text mb-0.5">
                                {format(currentMonth, 'MMMM')}
                            </h4>
                            <span className="text-secondary/60 text-sm font-bold tracking-widest uppercase">{format(currentMonth, 'yyyy')}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrevMonth} className="p-3 hover:bg-secondary/20 rounded-full border border-secondary/20 transition-colors text-primary">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleNextMonth} className="p-3 hover:bg-secondary/20 rounded-full border border-secondary/20 transition-colors text-primary">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                        {['Sun', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat'].map(day => (
                            <div key={day} className="text-xs font-bold text-text/40 uppercase tracking-widest pb-2">
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
                                        !isCurrentMonth && "text-text/10",
                                        isCurrentMonth && !isSelected && "text-text/70 hover:bg-secondary/10 hover:text-primary hover:border hover:border-secondary/20",
                                        isSelected && "bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10",
                                        today && !isSelected && "text-primary ring-2 ring-inset ring-primary/30 bg-primary/5"
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
                    <div className="bg-secondary/10 border-2 border-primary/20 rounded-3xl p-6 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-secondary/20">
                                <CalendarIcon size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-secondary/60 uppercase tracking-widest mb-0.5">Selected Date</p>
                                <p className="font-display font-bold text-text text-lg">{format(selectedDateObj, 'EEEE, MMMM do, yyyy')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Slots & Capacity */}
            <div className="lg:col-span-5 space-y-10">
                {/* Slots */}
                <div>
                    <div className="flex items-center gap-2 text-primary font-display font-medium text-xl mb-6 italic">
                        <Clock size={20} />
                        <span>Select Time</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {isLoadingSlots ? (
                            <div className="col-span-3 py-12 flex justify-center text-primary/40">
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
                                            "py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all",
                                            isSelected
                                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                                : "border-secondary/20 bg-white text-text/60 hover:border-secondary/40 hover:bg-secondary/5 hover:text-primary"
                                        )}
                                    >
                                        {slotObj.time}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-3 text-center text-text/40 py-8 text-sm italic border-2 border-dashed border-secondary/20 rounded-2xl">
                                No slots available for this date.
                            </div>
                        )}
                    </div>
                </div>

                {/* Capacity Counter */}
                <div className="pt-8 border-t-2 border-secondary/10">
                    <div className="flex items-center gap-2 text-primary font-display font-medium text-xl mb-6 italic">
                        <Users size={20} />
                        <span>Attendees</span>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border-2 border-secondary/20 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="font-bold text-text">Number of people</p>
                            <p className="text-xs text-text/40 mt-1">Total participants for this session</p>
                        </div>
                        <div className="flex items-center gap-4 bg-secondary/10 p-1.5 rounded-2xl border border-secondary/20">
                            <button
                                onClick={() => handlePeopleChange(-1)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-white/80 rounded-xl text-primary transition-all shadow-sm disabled:opacity-50 disabled:shadow-none border border-secondary/10"
                                disabled={peopleCount <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-xl text-primary font-display">{peopleCount}</span>
                            <button
                                onClick={() => handlePeopleChange(1)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-white/80 rounded-xl text-primary transition-all shadow-sm border border-secondary/10"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
