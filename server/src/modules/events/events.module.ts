import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { TagsModule } from '../tags/tags.module';
import { EventsAIService } from './services/events-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), TagsModule],
  providers: [EventsService, EventsAIService],
  controllers: [EventsController],
  exports: [EventsService, EventsAIService],
})
export class EventsModule {}
