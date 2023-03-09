import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import type { User } from '../../domain/user';
import type { IUserRepo } from '../../repos/userRepo';
import type { IAuthService } from '../../services/authService';
import type { LogoutDTO } from './LogoutDTO';
import { UserNotFoundOrDeletedError } from './LogoutErrors';

type Response = Either<UnexpectedError, Result<void>>;

export class LogoutUseCase implements UseCase<LogoutDTO, Promise<Response>> {
  #userRepo: IUserRepo;
  #authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.#userRepo = userRepo;
    this.#authService = authService;
  }

  async execute(request: LogoutDTO): Promise<Response> {
    let user: User;
    const { userId } = request;

    try {
      try {
        user = await this.#userRepo.getUserByUserId(userId);
      } catch (err) {
        return left(new UserNotFoundOrDeletedError());
      }

      await this.#authService.deAuthenticateUser(user.username.value);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
