import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from 'nestjs-prisma';
import { GraphqlConfig } from './config/config.interface';
import { AppController } from './controllers/app.controller';
import { AppResolver } from './resolvers/app.resolver';
import { UserModule } from './resolvers/user/user.module';
import { AppService } from './services/app.service';
import config from './config/config';
import { TestPresetModule } from './resolvers/testPreset/test-preset.module';
import { DateScalar } from './common/scalars/date.scalar';
import { PrismaService } from 'services/prisma.service';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { createUserLoader } from 'utils/create-user-loader';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: true,
          path: 'mecha-api',
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          cors: {
            origin: __ORIGIN__,
            credentials: true,
          },
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile: graphqlConfig?.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig?.debug,
          playground: !__PROD__,
          context: ({ res, req }) => ({
            req,
            res,
          }),
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    PrismaService,
    UserModule,
    TestPresetModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppResolver, DateScalar],
})
export class AppModule {}
