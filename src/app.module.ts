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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile: graphqlConfig?.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig?.debug,
          playground: graphqlConfig?.playgroundEnabled,
          context: ({ req }) => ({ req }),
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
