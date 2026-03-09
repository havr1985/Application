import { ApiProperty } from '@nestjs/swagger';

export class AskDto {
  @ApiProperty()
  ask: string;
}
