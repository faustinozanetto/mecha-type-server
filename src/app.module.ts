/* eslint-disable @typescript-eslint/no-var-requires */
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
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
// require('dotenv').config();

// // 1-) Connection details
// const prodConn: ConnectionTypes = {
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   ssl: { rejectUnauthorized: false },
// };

// type ConnectionTypes = {
//   host: string;
//   port: number;
//   user: string;
//   database: string;
//   password: string;
//   ssl: any;
// };

// const devConn: ConnectionTypes = {
//   host: 'localhost',
//   port: 5432,
//   user: 'postgres',
//   database: 'mecha-type',
//   // prettier-ignore
//   password: "4532164mine",
//   ssl: { rejectUnauthorized: false },
// };

// // 2-) Create an instance of connect-pg-simple and pass it session
// const pgSession = require('connect-pg-simple')(session);

// // 3-) Create a config option for store
// const pgStoreConfig = {
//   pgPromise: require('pg-promise')({ promiseLib: require('bluebird') })({
//     conObject: __PROD__ ? prodConn : devConn,
//   }),
// };

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
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<NestSessionOptions> => {
        return {
          session: {
            // store: new pgSession(pgStoreConfig),
            secret: process.env.SESSION_SECRET,
            cookie: {
              secure: __PROD__,
              maxAge: 7 * 24 * 60 * 60 * 1000,
              sameSite: 'none',
              httpOnly: true,
            },
            resave: false,
            saveUninitialized: false,
          },
        };
      },
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
