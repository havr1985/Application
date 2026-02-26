import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const res: Response = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;

    return next.handle().pipe(
      map((data) => ({
        data: instanceToPlain(data) as T,
        statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
