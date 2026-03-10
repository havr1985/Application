import { type FC } from 'react';
import * as React from 'react';

interface EventActionButtonProps {
  isJoined: boolean;
  isFull: boolean;
  onJoin: (e: React.MouseEvent) => void;
  onLeave: (e: React.MouseEvent) => void;
}

export const EventActionButton: FC<EventActionButtonProps> = ({
  isJoined,
  isFull,
  onJoin,
  onLeave,
}) => {
  if (isFull && !isJoined) {
    return (
      <button className="btn-full w-full" disabled>
        Event is Full
      </button>
    );
  }

  if (isJoined) {
    return (
      <button
        className="btn-outline w-full hover:border-danger-500 hover:text-danger-500"
        onClick={onLeave}
      >
        Leave Event
      </button>
    );
  }

  return (
    <button className="btn-primary w-full" onClick={onJoin}>
      Join Event
    </button>
  );
};
