import type { FC } from 'react';

interface DeleteEventModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteEventModal: FC<DeleteEventModalProps> = ({
  onClose,
  onConfirm,
}: DeleteEventModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="card w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-text-primary">Delete Event</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button className="btn-outline flex-1" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger flex-1" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
