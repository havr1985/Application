import { Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { User } from '../users/entities/user.entity';
import { getSystemPrompt } from './constants/prompts.constants';
import { EVENT_TOOLS } from './tools/event-tools';
import { QuestionDto } from './dto/question.dto';
import { EventsAIService } from '../events/services/events-ai.service';
import { AiConfig, aiConfig } from '../../config/configuration';
import {
  ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from 'groq-sdk/resources/chat/completions';
import { AiEvent, ToolArgs } from './interfaces/ai.interfaces';

@Injectable()
export class AiService {
  private groq: Groq;
  constructor(
    private readonly eventsAiService: EventsAIService,
    @Inject(aiConfig.KEY) private readonly ai: AiConfig,
  ) {
    this.groq = new Groq({
      apiKey: this.ai.apiKey,
    });
  }

  async ask(question: QuestionDto, user: User): Promise<{ answer: string }> {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: getSystemPrompt() },
      { role: 'user', content: question.question },
    ];
    let response: ChatCompletion;
    try {
      response = await this.groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages,
        tools: EVENT_TOOLS,
        tool_choice: 'auto',
        temperature: 0,
        parallel_tool_calls: false,
        max_completion_tokens: 4096,
      });
    } catch (error: unknown) {
      const groqError = error as { status?: number; error?: { code?: string } };
      if (
        groqError.status === 400 &&
        groqError.error?.code === 'tool_use_failed'
      ) {
        return this.askWithContext(question.question, user);
      }
      throw error;
    }

    const choice = response.choices[0].message;
    if (!choice.tool_calls?.length) {
      return {
        answer:
          choice.content ||
          'Sorry, I did not understand that. Please try rephrasing your question',
      };
    }
    messages.push(choice);

    for (const toolCall of choice.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments) as ToolArgs;
      const result = await this.executeTool(toolCall.function.name, args, user);

      const toolMessage: ChatCompletionToolMessageParam = {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      };

      messages.push(toolMessage);
    }

    const finalResponse = await this.groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      temperature: 0,
      max_completion_tokens: 4096,
    });

    return {
      answer:
        finalResponse.choices[0].message.content ||
        'Sorry, I did not understand that. Please try rephrasing your question',
    };
  }

  private async executeTool(
    name: string,
    args: ToolArgs,
    user: User,
  ): Promise<AiEvent[]> {
    switch (name) {
      case 'getUserEvents':
        return this.eventsAiService.getEventsForAi({
          userId: user.id,
          ...args,
        });
      case 'getPublicEvents':
        return this.eventsAiService.getEventsForAi({
          publicOnly: true,
          ...args,
        });
      case 'getEventDetails':
        return this.eventsAiService.getEventsForAi({
          eventName: args.eventName,
          ...args,
        });
      default:
        return [];
    }
  }

  private async askWithContext(
    question: string,
    user: User,
  ): Promise<{ answer: string }> {
    const events = await this.eventsAiService.getEventsForAi({
      userId: user.id,
    });

    const context =
      events.length > 0
        ? events
            .map(
              (e) =>
                `- "${e.title}" | ${e.date.toString()} | ${e.location} | Tags: ${e.tags.join(', ')} | Organizer: ${e.organizer} | You are: ${e.isOrganizer ? 'organizer' : 'participant'}`,
            )
            .join('\n')
        : 'No events found.';

    const response = await this.groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        {
          role: 'user',
          content: `Based on this data:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0,
      max_completion_tokens: 4096,
    });

    return {
      answer:
        response.choices[0].message.content ||
        "Sorry, I didn't understand that. Please try rephrasing your question.",
    };
  }
}
