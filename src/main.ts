import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __ORIGIN__ } from 'utils/constants';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestConfig } from './config/config.interface';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';

import { NestExpressApplication } from '@nestjs/platform-express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  app.setGlobalPrefix('api');

  app.set('trust proxy', 1);
  // Cors
  app.enableCors({
    origin: __ORIGIN__,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(passport.initialize());
  app.use(passport.session());

  // App listen
  await app.listen(process.env.PORT || nestConfig?.port || 4000);
}

bootstrap();
