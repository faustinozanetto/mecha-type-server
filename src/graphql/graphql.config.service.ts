import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MechaContext } from 'types/types';
import { __ORIGIN__, __PROD__ } from 'utils/constants';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

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

      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
      introspection: true,
      debug: true,
      playground: true,
      context: ({ req, res }: MechaContext) => ({ req, res, passport: req.session.passport }),
    };
  }
}
