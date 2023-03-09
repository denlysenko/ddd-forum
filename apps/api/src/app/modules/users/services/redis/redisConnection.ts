import { createClient } from 'redis';
import { authConfig, isProduction } from '../../../../config';

const port = authConfig.redisServerPort;
const host = authConfig.redisServerURL;
const redisConnection = isProduction
  ? createClient({ url: authConfig.redisConnectionString })
  : createClient({ url: `redis://${host}:${port}` }); // creates a new client

redisConnection.on('connect', () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
