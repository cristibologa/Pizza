import type { ApolloDriverConfig } from '@nestjs/apollo';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'node:path';

import { CardsModule } from '@/modules/cards/cards.module';
import { OtpsModule } from '@/modules/otps/otps.module';
import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { UsersModule } from '@/modules/users/users.module';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth';
import { GamesModule } from './modules/games';
import { PizzasModule } from './modules/pizzas';
import { SessionsModule } from './modules/sessions';
import { TesterModule } from './modules/tester';
import { AuthorizedOnlyGuard } from './utils/guards';

@Module({
  controllers: [AppController],
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en',
    //   loaderOptions: {
    //     path: path.join(__dirname, '/static/locales/'),
    //     watch: true
    //   },
    //   resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver]
    // }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL!, {
      dbName: 'juniors-bootcamp',
      connectionFactory: (connection) => {
        connection.plugin((schema) => {
          schema.set('versionKey', false);
        });

        return connection;
      }
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      debug: false,
      useGlobalPrefix: true,
      introspection: true,
      graphiql: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // TODO GqlExceptionFilter or formatError
      // formatError: (formattedError, error) => formattedError
      context: async (request, reply) => ({
        req: request,
        reply
      })
    }),
    // ServeStaticModule для SPA, для статики достаточно useStaticAssets и setViewEngine в main
    // ServeStaticModule.forRoot({
    //   serveRoot: withBaseUrl('/static'),
    //   rootPath: join(__dirname, 'src/static')
    // }),
    AuthModule,
    OtpsModule,
    UsersModule,
    CardsModule,
    TransactionsModule,
    SessionsModule,
    PizzasModule,
    GamesModule,
    TesterModule
    // CinemaModule,
    // DeliveryModule,
    // CarsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthorizedOnlyGuard }]
})
export class AppModule {}
