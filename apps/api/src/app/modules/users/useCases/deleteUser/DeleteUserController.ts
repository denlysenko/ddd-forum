import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { DeleteUserDTO } from './DeleteUserDTO';
import { UserNotFoundError } from './DeleteUserErrors';
import type { DeleteUserUseCase } from './DeleteUserUseCase';

export class DeleteUserController extends BaseController {
  #useCase: DeleteUserUseCase;

  constructor(useCase: DeleteUserUseCase) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: DeleteUserDTO }>,
    reply: FastifyReply
  ): Promise<void> {
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

      return this.ok(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
