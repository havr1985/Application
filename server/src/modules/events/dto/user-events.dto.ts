import { ApiProperty } from '@nestjs/swagger';
import { TagResponseDto } from '../../tags/dto/tag-response.dto';

export class UserEventsDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Tech Conference 2026' })
  title: string;

  @ApiProperty({ example: '2026-04-15T09:00:00.000Z' })
  dateTime: Date;

  @ApiProperty({ example: 'Tech' })
  tags: TagResponseDto[];
}
