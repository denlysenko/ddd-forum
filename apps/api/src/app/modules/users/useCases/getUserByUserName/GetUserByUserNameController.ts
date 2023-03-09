import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { UserDTO } from '../../dtos/userDTO';
import { UserMap } from '../../mappers/userMap';
import type { GetUserByUserName } from './GetUserByUserName';
import type { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { UserNotFoundError } from './GetUserByUserNameErrors';

export class GetUserByUserNameController extends BaseController {
  #useCase: GetUserByUserName;

  constructor(useCase: GetUserByUserName) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: GetUserByUserNameDTO }>,
    reply: FastifyReply
  ): Promise<{ user: UserDTO } | void> {
    const dto = req.params;

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UserNotFoundError:
            return this.notFound(reply, error.getErrorValue().message);
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
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
