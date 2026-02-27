import { VisibilityEvent } from '../entities/event.entity';
import {
  OrganizerResponseDto,
  ParticipantsResponseDto,
} from './events-list-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizerDetailsResponseDto extends OrganizerResponseDto {
  @ApiProperty({ example: 'ivan@mail.com' })
  email: string;
}

export class ParticipantsDetailResponseDto extends ParticipantsResponseDto {
  @ApiProperty({ example: 'Jane Smith' })
  name: string;
}

export class EventDetailsResponseDto {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: 'Tech Conference 2026' })
  title: string;

  @ApiProperty({
    example:
      'Annual technology conference featuring the latest innovations in AI and machine learning.',
  })
  description: string;

  @ApiProperty({ example: '2026-04-15T09:00:00.000Z' })
  dateTime: Date;

  @ApiProperty({ example: 'Convention Center, San Francisco' })
  location: string;

  @ApiProperty({ example: 500 })
  capacity: number | null;

  @ApiProperty({ example: 'public' })
  visibility: VisibilityEvent;

  @ApiProperty({ type: OrganizerDetailsResponseDto })
  organizer: OrganizerDetailsResponseDto;

  @ApiProperty({ type: [ParticipantsDetailResponseDto] })
  participants: ParticipantsDetailResponseDto[];
}
