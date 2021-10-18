/* eslint-disable @typescript-eslint/no-var-requires */
import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { DateScalar } from './common/scalars/date.scalar';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { DiscordModule } from 'discord/discord.module';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { TestPresetModule } from 'modules/test-presets/test-preset.module';
import { PrismaModule } from 'nestjs-prisma';
import { Module } from '@nestjs/common';
import { TestPresetHistoryModule } from 'modules/test-preset-history/test-preset-history.module';
import { UserSettingsModule } from 'modules/user-settings/user-settings.module';
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
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    DiscordModule,
    UserModule,
    UserSettingsModule,
    TestPresetModule,
    TestPresetHistoryModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
