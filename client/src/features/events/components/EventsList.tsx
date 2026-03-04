import type { FC } from 'react';
import { useEvents } from '../store/events.selectors.ts';
import { EventsListItem } from './EventsListItem.tsx';

export const EventsList: FC = () => {
  const events = useEvents();

  if (events.length === 0) {
    return (
      <p className="text-center text-text-secondary py-12">
        No events available yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id} className="flex">
          <EventsListItem event={event} />
        </li>
      ))}
    </ul>
  );
};
