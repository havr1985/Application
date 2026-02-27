import { VisibilityEvent } from '../entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2026' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Annual technology conference featuring the latest innovations in AI and machine learning.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-04-15T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDate()
  dateTime: Date;

  @ApiProperty({ example: 'Convention Center, San Francisco' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 500 })
  @IsOptional()
  @IsInt()
  capacity: number | null;

  @ApiProperty({ example: 'public' })
  @IsNotEmpty()
  @IsEnum(VisibilityEvent)
  visibility: VisibilityEvent;
}
