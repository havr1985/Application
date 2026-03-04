import { MyEventsCalendar } from '../features/events/components/MyEventsCalendar.tsx';
import { Link } from 'react-router-dom';
import {
  useEventsActions,
  useEventsLoading,
  useMyEvents,
} from '../features/events/store/events.selectors.ts';
import { useEffect } from 'react';
import { CalendarOff } from 'lucide-react';

const MyEventsPage = () => {
  const myEvents = useMyEvents();
  const isLoading = useEventsLoading();
  const { fetchMyEvents } = useEventsActions();

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-secondary">Loading your events...</p>
      </div>
    );
  }

  if (myEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-tertiary">
          <CalendarOff size={32} />
        </div>
        <p className="text-text-secondary mb-2">
          You are not part of any events yet.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          Explore public events and join
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Events</h1>
          <p className="text-sm text-text-secondary">
            View and manage your event calendar
          </p>
        </div>
        <Link to="/events/create" className="btn-accent text-sm text-center">
          + Create Event
        </Link>
      </div>

      <MyEventsCalendar />
    </>
  );
};

export default MyEventsPage;
