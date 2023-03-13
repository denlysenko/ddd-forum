import Fastify from 'fastify';
import { app } from './app/shared/infra/http/app';
// Subscriptions
import './app/modules/forum/subscriptions';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        levelFirst: true,
        colorize: true,
        ignore: 'hostname,process,context,pid',
        singleLine: true,
      },
    },
  },
  production: true,
  test: false,
};

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = Fastify({
  logger: envToLogger[process.env.NODE_ENV] ?? true,
});

server.register(app);

server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});
