import type { FastifyInstance } from 'fastify';
import { hooks } from '../../../../../shared/infra/http';
import { createPostController } from '../../../useCases/post/createPost';
import { downvotePostController } from '../../../useCases/post/downvotePost';
import { getPopularPostsController } from '../../../useCases/post/getPopularPosts';
import { getPostBySlugController } from '../../../useCases/post/getPostBySlug';
import { getRecentPostsController } from '../../../useCases/post/getRecentPosts';
import { upvotePostController } from '../../../useCases/post/upvotePost';
import {
  createPostSchema,
  downvotePostSchema,
  getPopularPostsSchema,
  getPostBySlugSchema,
  getRecentPostsSchema,
  upvotePostSchema,
} from '../schemas';

export async function postRouter(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: createPostSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => createPostController.execute(req, res)
  );

  fastify.get(
    '/recent',
    {
      schema: getRecentPostsSchema,
      onRequest: hooks.includeDecodedTokenIfExists(),
    },
    (req, res) => getRecentPostsController.execute(req, res)
  );

  fastify.get(
    '/popular',
    {
      schema: getPopularPostsSchema,
      onRequest: hooks.includeDecodedTokenIfExists(),
    },
    (req, res) => getPopularPostsController.execute(req, res)
  );

  fastify.get(
    '/',
    {
      schema: getPostBySlugSchema,
      onRequest: hooks.includeDecodedTokenIfExists(),
    },
    (req, res) => getPostBySlugController.execute(req, res)
  );

  fastify.post(
    '/upvote',
    {
      schema: upvotePostSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => upvotePostController.execute(req, res)
  );

  fastify.post(
    '/downvote',
    {
      schema: downvotePostSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => downvotePostController.execute(req, res)
  );
}
