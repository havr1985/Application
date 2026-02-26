import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { config } from './config/configuration';
import { validate } from './config/env.validation';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config, validate }),
    DatabaseModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
