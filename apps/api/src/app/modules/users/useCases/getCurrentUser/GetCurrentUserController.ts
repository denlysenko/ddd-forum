import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { UserDTO } from '../../dtos/userDTO';
import { UserMap } from '../../mappers/userMap';
import type { GetUserByUserName } from '../getUserByUserName/GetUserByUserName';

export class GetCurrentUserController extends BaseController {
  #useCase: GetUserByUserName;

  constructor(useCase: GetUserByUserName) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ user: UserDTO } | void> {
    const { username } = req.user;

    try {
      const result = await this.#useCase.execute({ username });

      if (result.isLeft()) {
        return this.fail(reply, result.value.getErrorValue().message);
      }

      const user = result.value.getValue();

      return this.ok(reply, {
        user: UserMap.toDTO(user),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
