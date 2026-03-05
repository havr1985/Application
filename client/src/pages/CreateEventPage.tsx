import { EventForm } from '../features/events/components/EventForm.tsx';
import type { EventFormData } from '../features/events/schemas/event.schemas.ts';
import { useNavigate } from 'react-router-dom';
import {
  useCurrentEvent,
  useEventsActions,
} from '../features/events/store/events.selectors.ts';
import { ArrowLeft } from 'lucide-react';

const EventCreatePage = () => {
  const navigate = useNavigate();
  const currentEvent = useCurrentEvent();
  const { createEvent } = useEventsActions();

  const handleCreate = async (data: EventFormData) => {
    try {
      createEvent({ ...data, capacity: data.capacity ?? null });
      navigate(`/events/${currentEvent?.id}`);
    } catch {
      //
    }
  };
  return (
    <div className="mx-auto max-w-2xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="card p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Create New Event
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          Fill in the details to create an amazing event
        </p>
        <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
      </div>
    </div>
  );
};

export default EventCreatePage;
