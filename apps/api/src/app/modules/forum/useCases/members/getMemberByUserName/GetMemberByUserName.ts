import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { MemberDetails } from '../../../domain/memberDetails';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { GetMemberByUserNameDTO } from './GetMemberByUserNameDTO';
import { MemberNotFoundError } from './GetMemberByUserNameErrors';

type Response = Either<
  MemberNotFoundError | UnexpectedError,
  Result<MemberDetails>
>;

export class GetMemberByUserName
  implements UseCase<GetMemberByUserNameDTO, Promise<Response>>
{
  #memberRepo: IMemberRepo;

  constructor(memberRepo: IMemberRepo) {
    this.#memberRepo = memberRepo;
  }

  async execute(request: GetMemberByUserNameDTO): Promise<Response> {
    let memberDetails: MemberDetails;
    const { username } = request;

    try {
      try {
        memberDetails = await this.#memberRepo.getMemberDetailsByUserName(
          username
        );
      } catch (err) {
        return left(new MemberNotFoundError(username));
      }

      return right(Result.ok<MemberDetails>(memberDetails));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
