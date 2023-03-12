import type { FastifyInstance } from 'fastify';
import { hooks } from '../../../../../shared/infra/http';
import { downvoteCommentController } from '../../../useCases/comments/downvoteComment';
import { getCommentByCommentIdController } from '../../../useCases/comments/getCommentByCommentId';
import { getCommentsByPostSlugController } from '../../../useCases/comments/getCommentsByPostSlug';
import { replyToCommentController } from '../../../useCases/comments/replyToComment';
import { replyToPostController } from '../../../useCases/comments/replyToPost';
import { upvoteCommentController } from '../../../useCases/comments/upvoteComment';
import {
  downvoteCommentSchema,
  getCommentByCommentIdSchema,
  getCommentsByPostSlugSchema,
  replyToCommentSchema,
  replyToPostSchema,
  upvoteCommentSchema,
} from '../schemas';

export async function commentRouter(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: getCommentsByPostSlugSchema,
      onRequest: hooks.includeDecodedTokenIfExists(),
    },
    (req, res) => getCommentsByPostSlugController.execute(req, res)
  );

  fastify.post(
    '/',
    {
      schema: replyToPostSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => replyToPostController.execute(req, res)
  );

  fastify.post(
    '/:commentId/reply',
    {
      schema: replyToCommentSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => replyToCommentController.execute(req, res)
  );

  fastify.get(
    '/:commentId',
    {
      schema: getCommentByCommentIdSchema,
      onRequest: hooks.includeDecodedTokenIfExists(),
    },
    (req, res) => getCommentByCommentIdController.execute(req, res)
  );

  fastify.post(
    '/:commentId/upvote',
    {
      schema: upvoteCommentSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => upvoteCommentController.execute(req, res)
  );

  fastify.post(
    '/:commentId/downvote',
    {
      schema: downvoteCommentSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => downvoteCommentController.execute(req, res)
  );
}
