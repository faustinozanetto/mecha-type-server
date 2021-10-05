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
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'entities/user.entity';
import { TestPresetEntity } from 'entities/test-preset.entity';
import { WordsPerMinuteEntity } from 'entities/words-per-minute.entity';
import { CharsPerMinuteEntity } from 'entities/chars-per-minute.entity';
import { AccuracyEntity } from 'entities/accuracy.entity';
import { SessionEntity } from 'entities/session.entity';
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
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '4532164mine',
          database: 'mecha-type-typeorm',
          entities: [
            UserEntity,
            TestPresetEntity,
            WordsPerMinuteEntity,
            CharsPerMinuteEntity,
            AccuracyEntity,
            SessionEntity,
          ],
          synchronize: true,
        };
      },
    }),
    DiscordModule,
    UserModule,
    TestPresetModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
