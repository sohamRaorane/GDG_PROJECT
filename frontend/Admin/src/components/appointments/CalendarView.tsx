import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css"; // We will create this for overrides
import { getAllAppointments } from "../../services/db";

const localizer = momentLocalizer(moment);

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resourceId?: number;
}

const CalendarView = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const appts = await getAllAppointments();
                if (!mounted) return;
                const mapped: Event[] = appts.map((a, idx) => ({
                    id: idx + 1,
                    title: `${a.serviceName} - ${a.customerName}`,
                    start: a.startAt.toDate(),
                    end: a.endAt.toDate(),
                }));
                setEvents(mapped);
            } catch (err) {
                console.error("Failed to load appointments", err);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    return (
        <div className="h-[600px] rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                defaultView={Views.WEEK}
                views={['month', 'week', 'day', 'agenda']}
                step={30}
                timeslots={2}
            />
        </div>
    );
};

export default CalendarView;
