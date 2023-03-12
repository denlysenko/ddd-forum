import type { FastifyInstance } from 'fastify';
import { hooks } from '../../../../../shared/infra/http';
import { getCurrentMemberController } from '../../../useCases/members/getCurrentMember';
import { getMemberByUserNameController } from '../../../useCases/members/getMemberByUserName';
import { getCurrentMemberSchema, getMemberByUserNameSchema } from '../schemas';

export async function memberRouter(fastify: FastifyInstance) {
  fastify.get(
    '/me',
    {
      schema: getCurrentMemberSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => getCurrentMemberController.execute(req, res)
  );

  fastify.get(
    '/:username',
    {
      schema: getMemberByUserNameSchema,
      onRequest: hooks.ensureAuthenticated(),
    },
    (req, res) => getMemberByUserNameController.execute(req, res)
  );
}
