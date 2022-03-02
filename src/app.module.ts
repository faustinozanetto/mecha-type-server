/* eslint-disable @typescript-eslint/no-var-requires */
import config from './config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GqlConfigService } from 'graphql/graphql.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
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
