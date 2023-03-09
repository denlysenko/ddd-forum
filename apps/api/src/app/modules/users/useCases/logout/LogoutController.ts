import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { LogoutUseCase } from './LogoutUseCase';

export class LogoutController extends BaseController {
  #useCase: LogoutUseCase;

  constructor(useCase: LogoutUseCase) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { userId } = req.user;

    try {
      const result = await this.#useCase.execute({ userId });

      if (result.isLeft()) {
        return this.fail(reply, result.value.getErrorValue().message);
      }

      return this.ok(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
