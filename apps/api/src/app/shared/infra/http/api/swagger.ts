import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    hideUntagged: true,
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'DDD Forum. REST API',
        description: 'DDD Forum. REST API',
        version: 'v1',
      },
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });
});
