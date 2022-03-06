import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { DateScalar } from './common/scalars/date.scalar';
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
import { PubsubModule } from 'modules/pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PassportModule.register({ session: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    PrismaModule.forRoot({
      isGlobal: true,
    }),
    //PubsubModule,
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
