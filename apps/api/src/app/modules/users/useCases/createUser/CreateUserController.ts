import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UnexpectedError } from '../../../../shared/core/AppError';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { TextUtils } from '../../../../shared/utils/TextUtils';
import type { CreateUserDTO } from './CreateUserDTO';
import {
  EmailAlreadyExistsError,
  UsernameTakenError,
} from './CreateUserErrors';
import type { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController extends BaseController {
  readonly #useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const { username, email, password } = req.body;
    const dto = {
      username: TextUtils.sanitize(username),
      email: TextUtils.sanitize(email),
      password: password,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UsernameTakenError:
            return this.conflict(
              reply,
              (error as UsernameTakenError).getErrorValue().message
            );

          case EmailAlreadyExistsError:
            return this.conflict(
              reply,
              (error as EmailAlreadyExistsError).getErrorValue().message
            );

          default:
            return this.fail(
              reply,
              (error as UnexpectedError).getErrorValue().message
            );
        }
      }

      return this.ok<void>(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
