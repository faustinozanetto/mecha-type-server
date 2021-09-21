import config from './config/config';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { DateScalar } from './common/scalars/date.scalar';
import { PrismaService } from './prisma/prisma.service';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { PrismaModule } from 'prisma/prisma.module';
import { DiscordModule } from 'discord/discord.module';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { TestPresetModule } from 'test-presets/test-preset.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    PassportModule.register({ session: true }),
    GraphQLModule.forRoot({
      cors: {
        origin: __ORIGIN__,
      },
      autoSchemaFile: './src/schema.graphql',
      playground: !__PROD__,
      useGlobalPrefix: true,
    }),
    HttpModule,
    DiscordModule,
    PrismaModule,
    UserModule,
    TestPresetModule,
  ],
  controllers: [],
  providers: [PrismaService, DateScalar],
})
export class AppModule {}
