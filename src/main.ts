import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { AppModule } from './app.module';
import Redis from 'ioredis';
import { NestConfig } from './config/config.interface';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as connectRedis from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  /*========= INITIALIZATION =========*/
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /*========= CONFIG =========*/
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  /*========= PREFIX =========*/
  app.setGlobalPrefix('api');

  /*========= VERSIONING =========*/
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.set('trust proxy', 1);

  /*========= CORS =========*/
  app.enableCors({
    origin: __ORIGIN__,
    credentials: true,
  });

  /*========= SESSION =========*/
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.use(
    session({
      name: 'session',
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
      },
      saveUninitialized: false,
      secret: 'secret',
      resave: false,
    }),
  );
  //const prisma = new PrismaClient();
  /*
  app.use(
    session({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      cookie: {
        // httpOnly: true,
        // sameSite: 'strict',
        // secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );
  */

  /*========= VALIDATION =========*/
  app.useGlobalPipes(new ValidationPipe());

  /*========= MIDDLEAWARES =========*/
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  /*========= PASSPORT =========*/
  app.use(passport.initialize());
  app.use(passport.session());

  /*========= START =========*/
  await app.listen(process.env.PORT || nestConfig?.port || 4000);
}

bootstrap();
