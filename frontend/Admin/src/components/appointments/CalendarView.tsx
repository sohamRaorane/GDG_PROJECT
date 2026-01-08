import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css"; // We will create this for overrides
import { getAllAppointments } from "../../services/db";
import type { Appointment } from "../../types/db";

const localizer = momentLocalizer(moment);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status: Appointment['status'];
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
                const mapped: Event[] = appts.map((a) => ({
                    id: a.id,
                    title: `${a.serviceName} - ${a.customerName}`,
                    start: a.startAt.toDate(),
                    end: a.endAt.toDate(),
                    status: a.status,
                }));
                setEvents(mapped);
            } catch (err) {
                console.error("Failed to load appointments", err);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    // Custom event style based on status - Refined with pastel backgrounds
    const eventStyleGetter = (event: Event) => {
        let backgroundColor = '#FFFFFF'; // White base
        let borderLeftColor = '#0F766E'; // Default teal accent
        let textColor = '#0F766E'; // Darker text

        switch (event.status) {
            case 'confirmed':
                backgroundColor = '#D1FAE5'; // Light mint
                borderLeftColor = '#047857'; // Dark forest green
                textColor = '#065F46'; // Darker green for text
                break;
            case 'pending':
                backgroundColor = '#FEF3C7'; // Light amber
                borderLeftColor = '#B45309'; // Dark amber
                textColor = '#92400E'; // Darker amber for text
                break;
            case 'cancelled':
                backgroundColor = '#FEE2E2'; // Light red
                borderLeftColor = '#B91C1C'; // Dark red
                textColor = '#991B1B'; // Darker red for text
                break;
            case 'completed':
                backgroundColor = '#E0E7FF'; // Light indigo
                borderLeftColor = '#4F46E5'; // Dark indigo
                textColor = '#3730A3'; // Darker indigo for text
                break;
            case 'no-show':
                backgroundColor = '#F1F5F9'; // Light slate
                borderLeftColor = '#475569'; // Dark slate
                textColor = '#334155'; // Darker slate for text
                break;
        }

        return {
            style: {
                backgroundColor,
                borderLeft: `4px solid ${borderLeftColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '0.875rem',
                fontWeight: '600',
                padding: '4px 8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
            }
        };
    };

    return (
        <div className="h-[600px] rounded-xl bg-admin-surface p-6 shadow-sm border border-admin-border">
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
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default CalendarView;
