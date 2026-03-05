import { useEffect } from 'react';
import { EventsList } from '../features/events/components/EventsList.tsx';
import { useEventsActions } from '../features/events/store/events.selectors.ts';

const EventsListPage = () => {
  const { fetchEvents } = useEventsActions();
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-text-primary font-bold text-2xl">Discover Events</h1>
      <p className="text-text-secondary ">
        Find and join existing events happening around you
      </p>
      <EventsList />
    </div>
  );
};

export default EventsListPage;
