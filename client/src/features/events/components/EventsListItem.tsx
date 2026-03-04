import type { EventsItem } from '../types/events.types.ts';
import { formatDate, formatTime } from '../../../shared/utils/formatDate.ts';
import { Calendar, Clock1, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../auth/store/auth.selectors.ts';
import { useEventsActions } from '../store/events.selectors.ts';
import { EventActionButton } from './EventActionButton.tsx';

export const EventsListItem = ({ event }: { event: EventsItem }) => {
  const user = useUser();
  const { joinEvent: join, leaveEvent: leave } = useEventsActions();
  const isJoined = event.participants.some((p) => p.id === user?.id);
  const isFull =
    event.capacity !== null && event.participantCount >= event.capacity;

  const leaveEvent = (id: string) => {
    leave(id);
  };

  const joinEvent = (id: string) => {
    console.log('join event', id);
    join(id);
  };

  return (
    <Link to={`/events/${event.id}`} className="flex flex-col w-full ">
      <div className="card flex flex-1 flex-col p-8 text-text-secondary">
        <div className="mb-4">
          <h2 className="text-text-primary text-xl font-bold mb-1">
            {event.title}
          </h2>
          <p>{event.description}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock1 size={20} />
            <span>{formatTime(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>
              {event.participantCount} / {event.capacity} participants
            </span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="border-t border-border my-4 " />
          <EventActionButton
            isJoined={isJoined}
            isFull={isFull}
            onJoin={(e) => {
              e.preventDefault();
              e.stopPropagation();
              joinEvent(event.id);
            }}
            onLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              leaveEvent(event.id);
            }}
          />
        </div>
      </div>
    </Link>
  );
};
