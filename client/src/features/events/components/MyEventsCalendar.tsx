import { type FC, useCallback, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useNavigate } from 'react-router-dom';
import { useMyEvents } from '../store/events.selectors';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export const MyEventsCalendar: FC = () => {
  const navigate = useNavigate();
  const myEvents = useMyEvents();

  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      myEvents.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.dateTime),
        end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000),
        allDay: false,
      })),
    [myEvents],
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      navigate(`/events/${event.id}`);
    },
    [navigate],
  );

  return (
    <div>
      {/* Calendar */}
      <div className="card p-4 sm:p-6">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          titleAccessor={(event) =>
            `${format(event.start, 'HH:mm')} - ${event.title}`
          }
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={['month', 'week']}
          onSelectEvent={handleSelectEvent}
          style={{ height: 600 }}
          popup
          eventPropGetter={() => ({
            style: {
              backgroundColor: 'var(--color-accent-500)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '0.8rem',
              padding: '2px 6px',
            },
          })}
          dayPropGetter={(date) => {
            const isToday = new Date().toDateString() === date.toDateString();
            return {
              style: isToday
                ? { backgroundColor: 'var(--color-accent-50)' }
                : {},
            };
          }}
        />
      </div>
    </div>
  );
};
