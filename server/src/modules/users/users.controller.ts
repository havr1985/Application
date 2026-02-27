import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventsService } from '../events/events.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UserEventsDto } from '../events/dto/user-events.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: User): User {
    return user;
  }

  @Get('me/events')
  @ApiOperation({ summary: 'Get current user events for calendar view' })
  @ApiResponse({
    status: 200,
    description: 'List of user events',
    type: [UserEventsDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getEvents(@CurrentUser() user: User): Promise<UserEventsDto[]> {
    return this.eventsService.userEvents(user);
  }
}
