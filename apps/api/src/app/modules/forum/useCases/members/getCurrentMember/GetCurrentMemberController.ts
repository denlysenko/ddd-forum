import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { MemberDTO } from '../../../dtos/memberDTO';
import { MemberDetailsMap } from '../../../mappers/memberDetailsMap';
import type { GetMemberByUserName } from '../getMemberByUserName/GetMemberByUserName';
import type { GetMemberByUserNameResponseDTO } from '../getMemberByUserName/GetMemberByUserNameResponseDTO';

export class GetCurrentMemberController extends BaseController {
  #useCase: GetMemberByUserName;

  constructor(useCase: GetMemberByUserName) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ member: MemberDTO } | void> {
    const { username } = req.user;

    try {
      const result = await this.#useCase.execute({ username });

      if (result.isLeft()) {
        return this.fail(reply, result.value.getErrorValue().message);
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
