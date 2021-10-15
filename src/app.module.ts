/* eslint-disable @typescript-eslint/no-var-requires */
import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { DateScalar } from './common/scalars/date.scalar';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { DiscordModule } from 'discord/discord.module';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { TestPresetModule } from 'test-presets/test-preset.module';
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { TestPresetHistoryModule } from 'test-preset-history/test-preset-history.module';
// require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    PassportModule.register({ session: true }),
    GraphQLModule.forRootAsync({
      useFactory: async () => {
        return {
          installSubscriptionHandlers: true,
          cors: {
            origin: __ORIGIN__,
            credentials: true,
          },
          autoSchemaFile: './src/schema.graphql',
          playground: !__PROD__,
          useGlobalPrefix: true,
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),
    PrismaModule,
    DiscordModule,
    UserModule,
    TestPresetModule,
    TestPresetHistoryModule,
  ],
  controllers: [],
  providers: [PrismaService, DateScalar],
})
export class AppModule {}
