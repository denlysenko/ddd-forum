import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import type { IUserRepo } from '../../repos/userRepo';
import type { DeleteUserDTO } from './DeleteUserDTO';
import { UserNotFoundError } from './DeleteUserErrors';

type Response = Either<UnexpectedError | UserNotFoundError, Result<void>>;

export class DeleteUserUseCase
  implements UseCase<DeleteUserDTO, Promise<Response>>
{
  #userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.#userRepo = userRepo;
  }

  async execute(request: DeleteUserDTO): Promise<Response> {
    try {
      const user = await this.#userRepo.getUserByUserId(request.userId);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new UserNotFoundError());
      }

      user.delete();

      await this.#userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
