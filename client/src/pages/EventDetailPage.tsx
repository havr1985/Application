import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useEventsActions } from '../features/events/store/events.selectors.ts';
import { EventDetailsCard } from '../features/events/components/EventDetailsCard.tsx';
import { ArrowLeft } from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();
  const { fetchEventById } = useEventsActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchEventById(id);
  }, [fetchEventById, id]);

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className=" flex items-center gap-2 mb-4 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <EventDetailsCard />
    </div>
  );
};

export default EventDetailPage;
