import { useEffect, useState } from 'react';
import { EventsList } from '../features/events/components/EventsList.tsx';
import { useEventsActions } from '../features/events/store/events.selectors.ts';
import { TagFilter } from '../features/tags/components/TagFilter.tsx';

const EventsListPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { fetchEvents } = useEventsActions();
  useEffect(() => {
    fetchEvents(selectedTags);
  }, [fetchEvents, selectedTags]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-text-primary font-bold text-2xl">Discover Events</h1>
      <p className="text-text-secondary ">
        Find and join existing events happening around you
      </p>
      <div className="mt-4 mb-6">
        <TagFilter selected={selectedTags} onChange={setSelectedTags} />
      </div>
      <EventsList />
    </div>
  );
};

export default EventsListPage;
