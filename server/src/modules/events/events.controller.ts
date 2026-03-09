import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './services/events.service';
import { Public } from '../auth/decorators/public.decorator';
import { EventsItemResponseDto } from './dto/events-list-response.dto';
import { EventDetailsResponseDto } from './dto/event-detail-respons.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { FilterEventsDto } from './dto/filter-events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @UseGuards(OptionalJwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'tagIds', required: false, type: [String] })
  @ApiResponse({
    status: 200,
    description: 'List of public events',
    type: [EventsItemResponseDto],
  })
  async getAll(
    @Query() filter: FilterEventsDto,
    @CurrentUser() user?: User,
  ): Promise<EventsItemResponseDto[]> {
    return this.eventsService.findAll(user?.id, filter.tagIds);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get event details by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
    type: EventDetailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventDetailsResponseDto> {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'Event created',
    type: EventDetailsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error or past date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventDetailsResponseDto> {
    return this.eventsService.createEvent(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update event (organizer only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Event updated',
    type: EventDetailsResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only organizer can edit' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventDetailsResponseDto> {
    return this.eventsService.updateEvent(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete event (organizer only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 403, description: 'Only organizer can delete' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.eventsService.deleteEvent(id, user);
  }

  @Post(':id/join')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Join an event as participant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Joined event',
    type: EventDetailsResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Already joined or event full' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async join(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<EventDetailsResponseDto> {
    return this.eventsService.joinToEvent(id, user);
  }

  @Post(':id/leave')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Leave an event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Left event',
    type: EventDetailsResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async leave(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<EventDetailsResponseDto> {
    return this.eventsService.leaveToEvent(id, user);
  }
}
