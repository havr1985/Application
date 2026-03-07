import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterEventsDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tagIds?: string[];
}
