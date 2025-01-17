import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnexpectedError } from '../../../../shared/core/AppError';
import type { Result } from '../../../../shared/core/Result';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { LoginDTO, LoginDTOResponse } from './LoginDTO';
import {
  PasswordDoesntMatchError,
  UserNameDoesntExistError,
} from './LoginErrors';
import type { LoginUserUseCase } from './LoginUseCase';

export class LoginController extends BaseController {
  #useCase: LoginUserUseCase;

  constructor(useCase: LoginUserUseCase) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<LoginDTOResponse | void> {
    const dto = req.body;

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UserNameDoesntExistError:
          case PasswordDoesntMatchError:
            return this.unauthorized(
              reply,
              (error as UserNameDoesntExistError).getErrorValue().message
            );

          case UnexpectedError:
            return this.fail(
              reply,
              (error as PasswordDoesntMatchError).getErrorValue().message
            );

          default:
            return this.clientError(
              reply,
              (error as Result<string>).getErrorValue()
            );
        }
      }

      const responseDto = result.value.getValue() as LoginDTOResponse;

      return this.ok<LoginDTOResponse>(reply, responseDto);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
