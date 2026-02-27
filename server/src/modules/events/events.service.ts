import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, VisibilityEvent } from './entities/event.entity';
import { Repository } from 'typeorm';
import { EventsItemResponseDto } from './dto/events-list-response.dto';
import { EventDetailsResponseDto } from './dto/event-detail-respons.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/entities/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserEventsDto } from './dto/user-events.dto';
import {
  mapToEventDetail,
  mapToListItem,
  mapToUserEvents,
} from './mappers/event-response.mappers';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async findAllPublic(): Promise<EventsItemResponseDto[]> {
    const events = await this.eventsRepository.find({
      where: { visibility: VisibilityEvent.PUBLIC },
      relations: ['participants', 'organizer'],
      order: { dateTime: 'asc' },
    });
    if (events.length === 0) return [];
    return mapToListItem(events);
  }

  async findOne(id: string): Promise<EventDetailsResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: id },
      relations: ['participants', 'organizer'],
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return mapToEventDetail(event);
  }

  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<EventDetailsResponseDto> {
    const dateNow = new Date();
    if (createEventDto.dateTime <= dateNow) {
      throw new BadRequestException('Cannot create an event with a past date');
    }
    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      organizer: user,
    });
    await this.eventsRepository.save(newEvent);
    return this.findOne(newEvent.id);
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<EventDetailsResponseDto> {
    const event = await this.findEventOrFail(id, 'organizer');
    this.checkOwner(event.organizer.id, user.id);
    Object.assign(event, updateEventDto);
    await this.eventsRepository.save(event);

    return this.findOne(event.id);
  }

  async deleteEvent(id: string, user: User): Promise<{ message: string }> {
    const event = await this.findEventOrFail(id, 'organizer');
    this.checkOwner(event.organizer.id, user.id);
    await this.eventsRepository.delete(id);

    return { message: `Event ${id} deleted` };
  }

  async joinToEvent(id: string, user: User): Promise<EventDetailsResponseDto> {
    const event = await this.findEventOrFail(id, 'participants');
    const isExistingParticipant = event.participants.some(
      (p) => p.id === user.id,
    );
    if (isExistingParticipant) {
      throw new ForbiddenException(
        'You are already a participant of this event',
      );
    }
    if (event.capacity && event.capacity <= event.participants.length) {
      throw new ForbiddenException(
        'This event no longer has available capacity',
      );
    }
    event.participants.push(user);
    await this.eventsRepository.save(event);
    return this.findOne(event.id);
  }

  async leaveToEvent(id: string, user: User): Promise<EventDetailsResponseDto> {
    const event = await this.findEventOrFail(id, 'participants');
    const isExistingParticipant = event.participants.some(
      (p) => p.id === user.id,
    );
    if (!isExistingParticipant) {
      throw new ForbiddenException('You are not at this event.');
    }
    event.participants = event.participants.filter((p) => p.id !== user.id);
    await this.eventsRepository.save(event);
    return this.findOne(event.id);
  }

  async userEvents(user: User): Promise<UserEventsDto[]> {
    const events = await this.eventsRepository
      .createQueryBuilder('events')
      .leftJoinAndSelect('events.participants', 'participants')
      .leftJoinAndSelect('events.organizer', 'organizer')
      .where('events.organizer_id = :userId', { userId: user.id })
      .orWhere('participants.id = :userId', { userId: user.id })
      .orderBy('events.dateTime', 'ASC')
      .getMany();
    return mapToUserEvents(events);
  }

  private async findEventOrFail(id: string, relation: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id: id },
      relations: [relation],
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  private checkOwner(organizerId: string, userId: string): void {
    if (organizerId !== userId) {
      throw new ForbiddenException(
        'Only organizer can update or remove this event',
      );
    }
  }
}
