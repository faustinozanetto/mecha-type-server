import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MechaContext } from 'types/types';
import { __ORIGIN__, __PROD__ } from 'utils/constants';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return {
      // schema options
      autoSchemaFile: './src/schema.graphql',
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      cors: {
        origin: __ORIGIN__,
        enabled: true,
      },

      // subscription
      installSubscriptionHandlers: true,
      debug: !__PROD__,
      playground: !__PROD__,
      context: ({ req, res }: MechaContext) => ({ req, res }),
    };
  }
}
