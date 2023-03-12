import type { FastifyInstance } from 'fastify';
import {
  commentRouter,
  memberRouter,
} from '../../../../modules/forum/infra/http/routes';
import { postRouter } from '../../../../modules/forum/infra/http/routes/post';
import { userRouter } from '../../../../modules/users/infra/http/routes';

export async function v1Router(fastify: FastifyInstance) {
  fastify.register(userRouter, { prefix: '/users' });
  fastify.register(memberRouter, { prefix: '/members' });
  fastify.register(postRouter, { prefix: '/posts' });
  fastify.register(commentRouter, { prefix: '/comments' });
}
