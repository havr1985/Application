import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagResponseDto } from './dto/tag-response.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'List of tags',
    type: [TagResponseDto],
  })
  async getAll(): Promise<TagResponseDto[]> {
    return this.tagsService.findAll();
  }
}
