import Sensible from '@fastify/sensible';
import type { FastifyInstance } from 'fastify';
import type { JWTClaims } from '../../../modules/users/domain/jwt';
import swagger from './api/swagger';
import { v1Router } from './api/v1';

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTClaims;
  }
}

export async function app(fastify: FastifyInstance) {
  fastify.register(Sensible);
  fastify.register(swagger);
  fastify.register(v1Router, { prefix: '/api/v1' });
}
