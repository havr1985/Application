import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { QuestionDto } from './dto/question.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @HttpCode(HttpStatus.OK)
  @Post('ask')
  async ask(
    @Body() question: QuestionDto,
    @CurrentUser() user: User,
  ): Promise<{ answer: string }> {
    return this.aiService.ask(question, user);
  }
}
