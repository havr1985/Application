import type { EventsItem } from '../types/events.types.ts';
import type { EventDetail } from '../types/event-detail.types.ts';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { eventsApi } from '../api/events.api.ts';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage.ts';
import type { UserEvent } from '../types/user-events.types.ts';
import toast from 'react-hot-toast';
import type {
  CreateEventType,
  UpdateEventType,
} from '../types/create-event.types.ts';

interface EventsState {
  events: EventsItem[] | [];
  currentEvent: EventDetail | null;
  myEvents: UserEvent[];
  isLoading: boolean;

  fetchEvents: (tagIds?: string[]) => void;
  fetchEventById: (id: string) => void;
  fetchMyEvents: () => void;
  joinEvent: (id: string) => void;
  leaveEvent: (id: string) => void;
  deleteEvent: (id: string) => void;
  createEvent: (data: CreateEventType) => void;
  updateEvent: (id: string, data: UpdateEventType) => void;
}

export const useEventsStore = create<EventsState>()(
  devtools((set, get) => {
    console.log('events store init');

    return {
      events: [],
      currentEvent: null,
      myEvents: [],
      isLoading: false,

      fetchEvents: async (tagIds?: string[]) => {
        try {
          set({ isLoading: true });
          const params = tagIds?.length ? { tagIds } : {};
          const data = await eventsApi.getAllEvents(params);
          set({ events: data });
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Fetch events failed');
          set({ isLoading: false });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchEventById: async (id: string) => {
        try {
          set({ isLoading: true });
          const data = await eventsApi.getEventById(id);
          set({ currentEvent: data });
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Fetch event details failed');
          set({ isLoading: false });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMyEvents: async () => {
        try {
          set({ isLoading: true });
          const data = await eventsApi.getMyEvents();
          set({ myEvents: data });
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Fetch your events failed');
          set({ isLoading: false });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      joinEvent: async (id: string) => {
        try {
          const data = await eventsApi.joinEvent(id);
          set({ currentEvent: data });
          get().fetchEvents();
          toast.success('Joined event!');
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Failed to join event');
          throw e;
        }
      },

      leaveEvent: async (id: string) => {
        try {
          const data = await eventsApi.leaveEvent(id);
          set({ currentEvent: data });
          get().fetchEvents();
          toast.success('Leave event!');
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Failed to leave event');
          throw e;
        }
      },

      deleteEvent: async (id: string) => {
        try {
          await eventsApi.deleteEvent(id);
          get().fetchEvents();
          toast.success('Deleted event!');
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Failed to delete event');
          throw e;
        }
      },

      createEvent: async (data: CreateEventType) => {
        try {
          const res = await eventsApi.createEvent(data);
          set({ currentEvent: res });
          toast.success('Created event!');
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Failed to create event');
          throw e;
        }
      },

      updateEvent: async (id: string, data: UpdateEventType) => {
        try {
          const res = await eventsApi.updateEvent(id, data);
          set({ currentEvent: res });
          toast.success('Updated event!');
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Failed to update event');
          throw e;
        }
      },
    };
  }),
);
