import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import handlebars from 'handlebars';
import { join } from 'node:path';
import * as client from 'prom-client';

// import { CarsModule } from '@/modules/cars/cars.module';
// import { CinemaModule } from '@/modules/cinema/cinema.module';
// import { DeliveryModule } from '@/modules/delivery/delivery.module';
// import { OtpsModule } from '@/modules/otps/otps.module';
// import { PizzaModule } from '@/modules/pizza/pizza.module';
// import { UsersModule } from '@/modules/users/users.module';
import { AppModule } from './app.module';
import { AuthModule } from './modules/auth';
import { CardsModule } from './modules/cards';
import { GamesModule, GamesSeeder } from './modules/games';
import { OtpsModule } from './modules/otps';
import { PizzasModule, PizzasSeeder } from './modules/pizzas';
import { TesterModule } from './modules/tester';
import { TransactionsModule } from './modules/transactions';
import { UsersModule } from './modules/users';
import { BASE_URL, withBaseUrl } from './utils/helpers';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await app.register(fastifyCookie);

  app.useStaticAssets({
    root: join(__dirname, '..', 'static'),
    prefix: withBaseUrl('/static/')
  });

  app.setViewEngine({
    engine: {
      handlebars
    },
    templates: join(__dirname, '..', 'views')
  });

  app.enableCors({
    origin: '*'
  });

  app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();

    res.on('finish', () => {
      const route = req.route?.path ?? req.path ?? 'unknown';

      httpRequestsTotal.inc({
        method: req.method,
        route,
        status_code: String(res.statusCode)
      });

      end({
        method: req.method,
        route,
        status_code: String(res.statusCode)
      });
    });

    next();
  });

  app.setGlobalPrefix(BASE_URL);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  app.use(withBaseUrl('/health'), (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: true }));
  });

  app.use(withBaseUrl('/metrics'), async (_req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  useOpenApi(app);

  await app.get(PizzasSeeder).seed();
  await app.get(GamesSeeder).seed();

  const port = process.env.PORT ?? 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}/${BASE_URL}`);
}

bootstrap();

function useOpenApi(app: NestFastifyApplication) {
  // const testerConfig = new DocumentBuilder()
  //   .setTitle('juniors bootcamp backend 🧪')
  //   .setDescription('Апи для задания по тестированию')
  //   .setVersion('1.0')
  //   .addBearerAuth({
  //     type: 'http',
  //     scheme: 'bearer',
  //     bearerFormat: 'JWT'
  //   })
  //   .build();

  // const testerDocument = SwaggerModule.createDocument(app, testerConfig, {
  //   include: [TesterModule]
  // });

  // app.use(withBaseUrl('/rest/tester.json'), (_req, res) => {
  //   res.json(testerDocument);
  // });

  // app.use(
  //   withBaseUrl('/rest/tester'),
  //   apiReference({
  //     content: testerDocument,
  //     agent: {
  //       disabled: true
  //     },
  //     mcp: {
  //       disabled: true
  //     },
  //     withFastify: true
  //   })
  // );

  const moduleDocs = [
    { name: 'pizza', module: PizzasModule },
    { name: 'games', module: GamesModule },
    { name: 'tester', module: TesterModule }
  ] as const;

  const config = new DocumentBuilder()
    .setTitle('juniors bootcamp backend 🔥')
    .setDescription('Апи для выполнения индивидуальных заданий')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Session  token',
        description: 'Для x-application: mobile'
      },
      'mobile-auth'
    )
    .addCookieAuth(
      'session_token',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Для x-application: web'
      },
      'web-auth'
    )
    .build();

  for (const moduleDoc of moduleDocs) {
    const moduleDocument = SwaggerModule.createDocument(app, config, {
      include: [
        AuthModule,
        OtpsModule,
        UsersModule,
        TransactionsModule,
        CardsModule,
        moduleDoc.module
      ]
    });

    app.use(withBaseUrl(`/rest/${moduleDoc.name}.json`), (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(moduleDocument));
    });

    app.use(
      withBaseUrl(`/rest/${moduleDoc.name}`),
      apiReference({
        content: moduleDocument,
        agent: {
          disabled: true
        },
        mcp: {
          disabled: true
        },
        withFastify: true
      })
    );
  }

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      AppModule,
      OtpsModule,
      AuthModule,
      UsersModule,
      CardsModule,
      TransactionsModule,
      PizzasModule,
      GamesModule,
      TesterModule
    ]
  });
  app.use(withBaseUrl('/rest.json'), (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(document));
  });

  app.use(
    withBaseUrl('/rest'),
    apiReference({
      content: document,
      agent: {
        disabled: true
      },
      mcp: {
        disabled: true
      },
      withFastify: true
    })
  );
}
