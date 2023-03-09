import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import type { User } from '../../domain/user';
import { UserName } from '../../domain/userName';
import type { IUserRepo } from '../../repos/userRepo';
import type { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { UserNotFoundError } from './GetUserByUserNameErrors';

type Response = Either<UnexpectedError, Result<User>>;

export class GetUserByUserName
  implements UseCase<GetUserByUserNameDTO, Promise<Response>>
{
  #userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.#userRepo = userRepo;
  }

  public async execute(request: GetUserByUserNameDTO): Promise<Response> {
    try {
      const userNameOrError = UserName.create({ name: request.username });

      if (userNameOrError.isFailure) {
        return left(
          Result.fail<UserName>(userNameOrError.getErrorValue().toString())
        ) as Response;
      }

      const userName: UserName = userNameOrError.getValue();

      const user = await this.#userRepo.getUserByUserName(userName);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new UserNotFoundError(userName.value)) as Response;
      }

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
