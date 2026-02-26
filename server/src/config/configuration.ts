import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  globalPrefix: 'api',
}));

export const dbConfig = registerAs('db', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '15d',
}));

export const config = [appConfig, dbConfig, jwtConfig];

export type AppConfig = ReturnType<typeof appConfig>;
export type DatabaseConfig = ReturnType<typeof dbConfig>;
export type JwtConfig = ReturnType<typeof jwtConfig>;
