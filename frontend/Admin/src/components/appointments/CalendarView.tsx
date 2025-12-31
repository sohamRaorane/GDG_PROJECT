import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css"; // We will create this for overrides

const localizer = momentLocalizer(moment);

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resourceId?: number;
}

const CalendarView = () => {
    const [events] = useState<Event[]>([
        {
            id: 1,
            title: "General Consultation - John Doe",
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(11, 0, 0, 0)),
        },
        {
            id: 2,
            title: "Ayurvedic Massage - Jane Smith",
            start: new Date(new Date().setHours(14, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
        },
    ]);

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
