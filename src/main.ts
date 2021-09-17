import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { __ORIGIN__ } from 'utils/constants';
import { AppModule } from './app.module';
import { CorsConfig, NestConfig } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  // Cors
  if (corsConfig?.enabled) {
    app.enableCors({
      origin: __ORIGIN__,
      credentials: true,
    });
  }

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Prisma Client Exception Filter for unhandled exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // App listen
  await app.listen(process.env.PORT || nestConfig?.port || 3000);
}

bootstrap();
