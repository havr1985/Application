import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { EventsItemResponseDto } from '../dto/events-list-response.dto';
import { EventDetailsResponseDto } from '../dto/event-detail-respons.dto';
import { CreateEventDto } from '../dto/create-event.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateEventDto } from '../dto/update-event.dto';
import { UserEventsDto } from '../dto/user-events.dto';
import {
  mapToEventDetail,
  mapToListItem,
  mapToUserEvents,
} from '../mappers/event-response.mappers';
import { TagsService } from '../../tags/tags.service';
import { Tag } from '../../tags/entities/tag.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(
    userId?: string,
    tagIds?: string[],
  ): Promise<EventsItemResponseDto[]> {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.tags', 'tags')
      .orderBy('event.dateTime', 'ASC')
      .addOrderBy('tags.name', 'ASC');

    if (userId) {
      qb.where('event.visibility IN (:...vis)', { vis: ['public', 'private'] });
    } else {
      qb.where('event.visibility = :vis', { vis: 'public' });
    }

    if (tagIds?.length) {
      qb.andWhere('tags.id IN (:...tagIds)', { tagIds });
    }

    const events = await qb.getMany();

    return mapToListItem(events);
  }

  async findOne(id: string): Promise<EventDetailsResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: id },
      relations: ['participants', 'organizer', 'tags'],
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (createEventDto.dateTime < tomorrow) {
      throw new BadRequestException('Event must start from tomorrow or later');
    }
    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      organizer: user,
    });
    newEvent.tags = await this.resolveTags(createEventDto.tagIds);

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
    event.tags = await this.resolveTags(updateEventDto.tagIds);

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
      .leftJoinAndSelect('events.tags', 'tags')
      .where('events.organizer_id = :userId', { userId: user.id })
      .orWhere('participants.id = :userId', { userId: user.id })
      .orderBy('events.dateTime', 'ASC')
      .addOrderBy('tags.name', 'ASC')
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

  private resolveTags(tagIds?: string[]): Promise<Tag[]> | [] {
    if (!tagIds?.length) return [];
    return this.tagsService.findByIds(tagIds);
  }
}
