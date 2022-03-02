import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { AppModule } from './app.module';
import { NestConfig } from './config/config.interface';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '.prisma/client';
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
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 360000 },
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
