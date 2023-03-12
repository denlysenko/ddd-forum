import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { User } from '../../../../users/domain/user';
import type { IUserRepo } from '../../../../users/repos/userRepo';
import { Member } from '../../../domain/member';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { CreateMemberDTO } from './CreateMemberDTO';
import {
  MemberAlreadyExistsError,
  UserDoesntExistError,
} from './CreateMemberErrors';

type Response = Either<
  | MemberAlreadyExistsError
  | UserDoesntExistError
  | UnexpectedError
  | Result<Member>,
  Result<void>
>;

export class CreateMember
  implements UseCase<CreateMemberDTO, Promise<Response>>
{
  #memberRepo: IMemberRepo;
  #userRepo: IUserRepo;

  constructor(userRepo: IUserRepo, memberRepo: IMemberRepo) {
    this.#userRepo = userRepo;
    this.#memberRepo = memberRepo;
  }

  async execute(request: CreateMemberDTO): Promise<Response> {
    let user: User;
    let member: Member;
    const { userId } = request;

    try {
      try {
        user = await this.#userRepo.getUserByUserId(userId);
      } catch (err) {
        return left(new UserDoesntExistError(userId));
      }

      try {
        member = await this.#memberRepo.getMemberByUserId(userId);

        const memberExists = !!member === true;

        if (memberExists) {
          return left(new MemberAlreadyExistsError(userId));
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}

      // Member doesn't exist already (good), so we want to create it
      const memberOrError = Member.create({
        userId: user.userId,
        username: user.username,
      });

      if (memberOrError.isFailure) {
        return left(memberOrError);
      }

      member = memberOrError.getValue();

      await this.#memberRepo.save(member);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
