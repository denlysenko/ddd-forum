import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { MemberDTO } from '../../../dtos/memberDTO';
import { MemberDetailsMap } from '../../../mappers/memberDetailsMap';
import type { GetMemberByUserName } from './GetMemberByUserName';
import type { GetMemberByUserNameDTO } from './GetMemberByUserNameDTO';
import { MemberNotFoundError } from './GetMemberByUserNameErrors';
import type { GetMemberByUserNameResponseDTO } from './GetMemberByUserNameResponseDTO';

export class GetMemberByUserNameController extends BaseController {
  #useCase: GetMemberByUserName;

  constructor(useCase: GetMemberByUserName) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: { username: string } }>,
    reply: FastifyReply
  ): Promise<{ member: MemberDTO } | void> {
    const dto: GetMemberByUserNameDTO = {
      username: req.params.username,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MemberNotFoundError:
            return this.notFound(reply, error.getErrorValue().message);
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
      }

      const memberDetails = result.value.getValue();

      return this.ok<GetMemberByUserNameResponseDTO>(reply, {
        member: MemberDetailsMap.toDTO(memberDetails),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
