import 'reflect-metadata';
import Redis from 'ioredis';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { AppModule } from './app.module';
import { NestConfig } from './config/config.interface';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '.prisma/client';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { redis } from 'redis';

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

  app.enable('trust proxy');

  /*========= CORS =========*/
  app.enableCors({
    origin: __ORIGIN__,
    credentials: true,
  });

  /*========= SESSION =========*/
  //const prisma = new PrismaClient();
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URI as string);
  const developmentCookie: session.CookieOptions = {
    sameSite: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  const productionCookie: session.CookieOptions = {
    sameSite: 'none',
    httpOnly: false,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      name: 'session',
      proxy: true,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: __PROD__ ? productionCookie : developmentCookie,
    }),
  );

  /*========= VALIDATION =========*/
  app.useGlobalPipes(new ValidationPipe());

  /*========= MIDDLEAWARES =========*/
  app.use(cookieParser());

  /*========= PASSPORT =========*/
  app.use(passport.initialize());
  app.use(passport.session());

  /*==========SWAGGER===========*/
  const config = new DocumentBuilder()
    .setTitle('Mecha Type')
    .setDescription('Mecha Type API')
    .setVersion('1.0')
    .addTag('mechatype')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /*========= START =========*/
  await app.listen(process.env.PORT || nestConfig?.port || 4000);
}

bootstrap();
