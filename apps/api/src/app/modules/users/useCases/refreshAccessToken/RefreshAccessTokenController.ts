import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import type { JWTToken } from '../../domain/jwt';
import type { LoginDTOResponse } from '../login/LoginDTO';
import type { RefreshAccessToken } from './RefreshAccessToken';
import type { RefreshAccessTokenDTO } from './RefreshAccessTokenDTO';
import {
  RefreshTokenNotFound,
  UserNotFoundOrDeletedError,
} from './RefreshAccessTokenErrors';

export class RefreshAccessTokenController extends BaseController {
  #useCase: RefreshAccessToken;

  constructor(useCase: RefreshAccessToken) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Body: RefreshAccessTokenDTO }>,
    reply: FastifyReply
  ): Promise<LoginDTOResponse | void> {
    const dto = req.body;

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RefreshTokenNotFound:
            return this.notFound(reply, error.getErrorValue().message);
          case UserNotFoundOrDeletedError:
            return this.notFound(reply, error.getErrorValue().message);
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
      }

      const accessToken = result.value.getValue() as JWTToken;
      return this.ok<LoginDTOResponse>(reply, {
        refreshToken: dto.refreshToken,
        accessToken: accessToken,
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
