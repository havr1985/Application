import { type FC, useState } from 'react';
import {
  useCurrentEvent,
  useEventsActions,
  useEventsLoading,
} from '../store/events.selectors.ts';
import { useUser } from '../../auth/store/auth.selectors.ts';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock1, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import { formatDate, formatTime } from '../../../shared/utils/formatDate.ts';
import { DeleteEventModal } from './delete-event-modal/DeleteEventModal.tsx';
import { EventActionButton } from './event-action-button/EventActionButton.tsx';
import { TagChips } from '../../tags/components/tag-chips/TagChips.tsx';

export const EventDetailsCard: FC = () => {
  const event = useCurrentEvent();
  const user = useUser();
  const navigate = useNavigate();
  const isLoading = useEventsLoading();
  const { joinEvent, leaveEvent, deleteEvent } = useEventsActions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading || !event) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-secondary">Loading event...</p>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer.id;
  const isJoined = event.participants.some((p) => p.id === user?.id);
  const isFull =
    event.capacity !== null && event.participants.length >= event.capacity;

  const handleDelete = async () => {
    deleteEvent(event.id);
    navigate('/');
  };

  const handleJoin = async () => {
    joinEvent(event.id);
  };

  const handleLeave = async () => {
    leaveEvent(event.id);
  };
  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {event.title}
            </h1>
            <div>
              <span className="inline-block mb-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                {event.visibility}
              </span>
              <TagChips tags={event.tags} />
            </div>
          </div>

          {isOrganizer && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 rounded-md border border-danger-500 px-3 py-2 text-sm text-danger-500 hover:bg-danger-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-text-secondary leading-relaxed">
          {event.description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
              <Calendar size={18} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Date</p>
              <p className="text-sm font-medium text-text-primary">
                {formatDate(event.dateTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
              <Clock1 size={18} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Time</p>
              <p className="text-sm font-medium text-text-primary">
                {formatTime(event.dateTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
              <MapPin size={18} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Location</p>
              <p className="text-sm font-medium text-text-primary">
                {event.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
              <Users size={18} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Capacity</p>
              <p className="text-sm font-medium text-text-primary">
                {event.participants.length} / {event.capacity ?? 'Unlimited'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Organizer
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {event.organizer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {event.organizer.name}
              </p>
              <p className="text-xs text-text-tertiary">
                {event.organizer.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Participants ({event.participants.length})
          </h3>
          {event.participants.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full bg-surface-secondary px-3 py-1.5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-xs font-medium text-accent-700">
                    {p.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <span className="text-sm text-text-primary">{p.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">
              No participants yet. Be the first to join!
            </p>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <EventActionButton
            isJoined={isJoined}
            isFull={isFull}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        </div>
      </div>

      {showDeleteModal && (
        <DeleteEventModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};
