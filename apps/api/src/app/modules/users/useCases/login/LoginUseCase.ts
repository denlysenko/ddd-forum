import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import type { JWTToken, RefreshToken } from '../../domain/jwt';
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import type { IUserRepo } from '../../repos/userRepo';
import type { IAuthService } from '../../services/authService';
import type { LoginDTO, LoginDTOResponse } from './LoginDTO';
import {
  PasswordDoesntMatchError,
  UserNameDoesntExistError,
} from './LoginErrors';

type Response = Either<
  | PasswordDoesntMatchError
  | UserNameDoesntExistError
  | UnexpectedError
  | Result<string>,
  Result<LoginDTOResponse>
>;

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  #userRepo: IUserRepo;
  #authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.#userRepo = userRepo;
    this.#authService = authService;
  }

  async execute(request: LoginDTO): Promise<Response> {
    try {
      const usernameOrError = UserName.create({ name: request.username });
      const passwordOrError = UserPassword.create({ value: request.password });
      const payloadResult = Result.combine([usernameOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return left(Result.fail<any>(payloadResult.getErrorValue()));
      }

      const userName = usernameOrError.getValue();
      const password = passwordOrError.getValue();
      const user = await this.#userRepo.getUserByUserName(userName);
      const userFound = !!user;

      if (!userFound) {
        return left(new UserNameDoesntExistError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new PasswordDoesntMatchError());
      }

      const accessToken: JWTToken = this.#authService.signJWT({
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.id.toString(),
        adminUser: user.isAdminUser,
      });

      const refreshToken: RefreshToken = this.#authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.#authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        })
      );
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
