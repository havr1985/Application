import { type FC, useState } from 'react';
import { useEvents } from '../store/events.selectors.ts';
import { EventsListItem } from './EventsListItem.tsx';
import { SearchInput } from '../../../shared/components/SearchInput.tsx';

export const EventsList: FC = () => {
  const events = useEvents();
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search events..."
      />
      {filteredEvents.length === 0 ? (
        <p className="text-center text-text-secondary py-12">
          No events available yet.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <li key={event.id} className="flex">
              <EventsListItem event={event} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
