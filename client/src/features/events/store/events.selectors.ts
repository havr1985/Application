import { useEventsStore } from './events.store.ts';
import { useShallow } from 'zustand/react/shallow';

export const useEvents = () => useEventsStore((state) => state.events);
export const useCurrentEvent = () =>
  useEventsStore((state) => state.currentEvent);
export const useMyEvents = () => useEventsStore((state) => state.myEvents);
export const useEventsLoading = () =>
  useEventsStore((state) => state.isLoading);
export const useEventsActions = () =>
  useEventsStore(
    useShallow((state) => ({
      fetchEvents: state.fetchEvents,
      fetchEventById: state.fetchEventById,
      fetchMyEvents: state.fetchMyEvents,
      joinEvent: state.joinEvent,
      leaveEvent: state.leaveEvent,
      deleteEvent: state.deleteEvent,
      createEvent: state.createEvent,
      updateEvent: state.updateEvent,
    })),
  );
