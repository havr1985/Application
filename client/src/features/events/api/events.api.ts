import { api } from '../../../shared/api/axios.ts';
import type { EventsItem } from '../types/events.types.ts';
import type { EventDetail } from '../types/event-detail.types.ts';
import type {
  CreateEventType,
  UpdateEventType,
} from '../types/create-event.types.ts';
import type { UserEvent } from '../types/user-events.types.ts';

export const eventsApi = {
  getAllEvents: async (): Promise<EventsItem[]> => {
    const res = await api.get('/events');
    return res.data.data;
  },
  getEventById: async (id: string): Promise<EventDetail> => {
    const res = await api.get(`/events/${id}`);
    return res.data.data;
  },
  joinEvent: async (id: string): Promise<EventDetail> => {
    const res = await api.post(`/events/${id}/join`);
    return res.data.data;
  },
  leaveEvent: async (id: string): Promise<EventDetail> => {
    const res = await api.post(`/events/${id}/leave`);
    return res.data.data;
  },
  deleteEvent: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/events/${id}`);
    return res.data.data;
  },
  createEvent: async (data: CreateEventType): Promise<EventDetail> => {
    const res = await api.post(`/events`, data);
    return res.data.data;
  },
  updateEvent: async (
    id: string,
    data: UpdateEventType,
  ): Promise<EventDetail> => {
    const res = await api.patch(`/events/${id}`, data);
    return res.data.data;
  },
  getMyEvents: async (): Promise<UserEvent[]> => {
    const res = await api.get(`/users/me/events`);
    return res.data.data;
  },
};
