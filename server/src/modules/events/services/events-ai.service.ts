import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { AiEvent } from '../../ai/interfaces/ai.interfaces';
import { mapToEventsForAi } from '../mappers/event-response.mappers';

@Injectable()
export class EventsAIService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async getEventsForAi(params: {
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    publicOnly?: boolean;
    eventName?: string;
    tag?: string;
  }): Promise<AiEvent[]> {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tags', 'tags')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .orderBy('event.dateTime', 'ASC');

    if (params.userId) {
      qb.andWhere(
        '(event.organizer_id = :userId OR participants.id = :userId)',
        { userId: params.userId },
      );
    }
    if (params.publicOnly) {
      qb.andWhere('event.visibility = :vis', { vis: 'public' });
    }
    if (params.dateFrom) {
      qb.andWhere('event.dateTime >= :dateFrom', { dateFrom: params.dateFrom });
    }
    if (params.dateTo) {
      const dateTo = new Date(params.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      qb.andWhere('event.dateTime <= :dateTo', {
        dateTo: dateTo.toISOString(),
      });
    }
    if (params.tag) {
      qb.andWhere('tags.name ILIKE :tag', { tag: params.tag });
    }
    if (params.eventName) {
      qb.andWhere('event.title ILIKE :name', { name: `%${params.eventName}%` });
    }

    const events = await qb.getMany();

    return mapToEventsForAi(events, params.userId);
  }
}
