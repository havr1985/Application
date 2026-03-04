import { useNavigate, useParams } from 'react-router-dom';
import {
  useCurrentEvent,
  useEventsActions,
} from '../features/events/store/events.selectors.ts';
import type { EventFormData } from '../features/events/schemas/event.schemas.ts';
import { EventForm } from '../features/events/components/EventForm.tsx';
import type { FC } from 'react';
import { ArrowLeft } from 'lucide-react';

const EditEventPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateEvent } = useEventsActions();
  const currentEvent = useCurrentEvent();

  if (!id || !currentEvent) return null;

  const handleEdit = async (data: EventFormData) => {
    try {
      updateEvent(id, { ...data, capacity: data.capacity ?? null });
      navigate(`/events/${id}`);
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
          Edit Your Event
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          Fill in the details to create an amazing event
        </p>
        <EventForm
          onSubmit={handleEdit}
          submitLabel="Edit Event"
          initialData={currentEvent}
          minCapacity={currentEvent.participants.length}
        />
      </div>
    </div>
  );
};

export default EditEventPage;
