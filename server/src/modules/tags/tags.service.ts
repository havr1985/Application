import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { TagResponseDto } from './dto/tag-response.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagsRepository.find({ order: { name: 'ASC' } });
    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    const tags = await this.tagsRepository.findBy(
      ids.map((id) => ({
        id,
      })),
    );
    if (tags.length !== ids.length) {
      throw new BadRequestException('One or more tags not found');
    }
    return tags;
  }
}
