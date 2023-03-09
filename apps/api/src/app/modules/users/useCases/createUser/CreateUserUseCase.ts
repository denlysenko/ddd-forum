import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import type { IUserRepo } from '../../repos/userRepo';
import type { CreateUserDTO } from './CreateUserDTO';
import {
  EmailAlreadyExistsError,
  UsernameTakenError,
} from './CreateUserErrors';

type Response = Either<
  EmailAlreadyExistsError | UsernameTakenError | UnexpectedError | Result<void>,
  Result<void>
>;

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<Response>>
{
  readonly #userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.#userRepo = userRepo;
  }

  async execute(request: CreateUserDTO): Promise<Response> {
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });
    const usernameOrError = UserName.create({ name: request.username });

    const dtoResult = Result.combine([
      emailOrError,
      passwordOrError,
      usernameOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const username: UserName = usernameOrError.getValue();

    try {
      const userAlreadyExists = await this.#userRepo.exists(email);

      if (userAlreadyExists) {
        return left(new EmailAlreadyExistsError(email.value)) as Response;
      }

      try {
        const alreadyCreatedUserByUserName =
          await this.#userRepo.getUserByUserName(username);

        const userNameTaken = !!alreadyCreatedUserByUserName === true;

        if (userNameTaken) {
          return left(new UsernameTakenError(username.value)) as Response;
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}

      const userOrError: Result<User> = User.create({
        email,
        password,
        username,
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();

      await this.#userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err)) as Response;
    }
  }
}
