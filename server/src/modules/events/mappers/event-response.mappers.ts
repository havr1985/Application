import { EventsItemResponseDto } from '../dto/events-list-response.dto';
import { Event } from '../entities/event.entity';
import { EventDetailsResponseDto } from '../dto/event-detail-respons.dto';
import { UserEventsDto } from '../dto/user-events.dto';

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
  }));
}
