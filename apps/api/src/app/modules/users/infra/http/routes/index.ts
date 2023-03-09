import type { FastifyInstance } from 'fastify';
import { hooks } from '../../../../../shared/infra/http';
import { createUserController } from '../../../useCases/createUser';
import { deleteUserController } from '../../../useCases/deleteUser';
import { getCurrentUserController } from '../../../useCases/getCurrentUser';
import { getUserByUserNameController } from '../../../useCases/getUserByUserName';
import { loginController } from '../../../useCases/login';
import { logoutController } from '../../../useCases/logout';
import { refreshAccessTokenController } from '../../../useCases/refreshAccessToken';
import { createUserSchema } from '../schemas/createUser';
import { deleteUserSchema } from '../schemas/deleteUser';
import { getCurrentUserSchema } from '../schemas/getCurrentUser';
import { getUserByUsernameSchema } from '../schemas/getUserByUsername';
import { loginSchema } from '../schemas/login';
import { logoutSchema } from '../schemas/logout';
import { refreshTokenSchema } from '../schemas/refreshToken';

export async function userRouter(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: createUserSchema,
    },
    (req, res) => createUserController.execute(req, res)
  );

  fastify.get(
    '/me',
    {
      schema: getCurrentUserSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => getCurrentUserController.execute(req, res)
  );

  fastify.post(
    '/login',
    {
      schema: loginSchema,
    },
    (req, res) => loginController.execute(req, res)
  );

  fastify.post(
    '/logout',
    {
      schema: logoutSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => logoutController.execute(req, res)
  );

  fastify.post(
    '/token/refresh',
    {
      schema: refreshTokenSchema,
    },
    (req, res) => refreshAccessTokenController.execute(req, res)
  );

  fastify.delete(
    '/:userId',
    {
      schema: deleteUserSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => deleteUserController.execute(req, res)
  );

  fastify.get(
    '/:username',
    {
      schema: getUserByUsernameSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => getUserByUserNameController.execute(req, res)
  );
}
