import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __DB_URL__, __ORIGIN__, __PROD__ } from 'utils/constants';
import { AppModule } from './app.module';
import { CorsConfig, NestConfig } from './config/config.interface';
import * as pg from 'pg';
import * as passport from 'passport';
import * as session from 'express-session';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgSession = require('connect-pg-simple')(session);
const pgPool = new pg.Pool({
  // Insert pool options here
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '4532164mine',
  ssl: false,
});

const productionPool = new pg.Pool({
  connectionString: __DB_URL__,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  app.setGlobalPrefix('api');
  // Cors
  if (corsConfig?.enabled) {
    app.enableCors({
      origin: __ORIGIN__,
      credentials: true,
    });
  }

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        secure: __PROD__,
      },
      name: 'session',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new pgSession({
        pool: __PROD__ ? productionPool : pgPool, // Connection pool
        tableName: 'Sessions', // Use another table-name than
        createTableIfMissing: true,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // App listen
  await app.listen(process.env.PORT || nestConfig?.port || 4000);
}

bootstrap();
