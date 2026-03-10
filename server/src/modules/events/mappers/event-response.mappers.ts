import { EventsItemResponseDto } from '../dto/events-list-response.dto';
import { Event } from '../entities/event.entity';
import { EventDetailsResponseDto } from '../dto/event-detail-respons.dto';
import { UserEventsDto } from '../dto/user-events.dto';
import { AiEvent } from '../../ai/interfaces/ai.interfaces';

export function mapToListItem(events: Event[]): EventsItemResponseDto[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    dateTime: event.dateTime,
    location: event.location,
    capacity: event.capacity ?? null,
    participantCount: event.participants.length,
    organizer: { id: event.organizer.id, name: event.organizer.name },
    participants: event.participants.map((p) => ({ id: p.id })),
    tags: event.tags.map((tag) => ({ id: tag.id, name: tag.name })),
  }));
}

export function mapToEventDetail(event: Event): EventDetailsResponseDto {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    dateTime: event.dateTime,
    location: event.location,
    capacity: event.capacity ?? null,
    visibility: event.visibility,
    organizer: {
      id: event.organizer.id,
      name: event.organizer.name,
      email: event.organizer.email,
    },
    participants: event.participants.map((p) => ({ id: p.id, name: p.name })),
    tags: event.tags.map((tag) => ({ id: tag.id, name: tag.name })),
  };
}

export function mapToUserEvents(events: Event[]): UserEventsDto[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    dateTime: event.dateTime,
    tags: event.tags.map((tag) => ({ id: tag.id, name: tag.name })),
  }));
}

export function mapToEventsForAi(events: Event[], userId?: string): AiEvent[] {
  return events.map((event) => ({
    title: event.title,
    date: event.dateTime,
    location: event.location,
    tags: event.tags.map((tag) => tag.name),
    participants: event.participants.map((p) => p.name),
    participantCount: event.participants.length,
    capacity: event.capacity,
    organizer: event.organizer.name,
    isOrganizer: event.organizer.id === userId,
  }));
}
