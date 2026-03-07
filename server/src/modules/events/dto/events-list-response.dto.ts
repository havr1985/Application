import { ApiProperty } from '@nestjs/swagger';
import { TagResponseDto } from '../../tags/dto/tag-response.dto';

export class OrganizerResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

export class ParticipantsResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;
}

export class EventsItemResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Tech Conference 2026' })
  title: string;

  @ApiProperty({
    example: 'Annual technology conference featuring the latest innovations.',
  })
  description: string;

  @ApiProperty({ example: '2026-04-15T09:00:00.000Z' })
  dateTime: Date;

  @ApiProperty({ example: 'Convention Center, San Francisco' })
  location: string;

  @ApiProperty({ example: 500, nullable: true })
  capacity: number | null;

  @ApiProperty({ example: 3 })
  participantCount: number;

  @ApiProperty({ type: OrganizerResponseDto })
  organizer: OrganizerResponseDto;

  @ApiProperty({ type: [ParticipantsResponseDto] })
  participants: ParticipantsResponseDto[];

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];
}
