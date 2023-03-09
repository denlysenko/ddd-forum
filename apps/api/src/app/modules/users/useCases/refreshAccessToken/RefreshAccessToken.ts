import { UnexpectedError } from '../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import type { UseCase } from '../../../../shared/core/UseCase';
import type { JWTToken } from '../../domain/jwt';
import type { User } from '../../domain/user';
import type { IUserRepo } from '../../repos/userRepo';
import type { IAuthService } from '../../services/authService';
import type { RefreshAccessTokenDTO } from './RefreshAccessTokenDTO';
import {
  RefreshTokenNotFound,
  UserNotFoundOrDeletedError,
} from './RefreshAccessTokenErrors';

type Response = Either<
  RefreshTokenNotFound | UserNotFoundOrDeletedError | UnexpectedError,
  Result<JWTToken>
>;

export class RefreshAccessToken
  implements UseCase<RefreshAccessTokenDTO, Promise<Response>>
{
  #userRepo: IUserRepo;
  #authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.#userRepo = userRepo;
    this.#authService = authService;
  }

  public async execute(req: RefreshAccessTokenDTO): Promise<Response> {
    const { refreshToken } = req;
    let user: User;
    let username: string;

    try {
      // Get the username for the user that owns the refresh token
      try {
        username = await this.#authService.getUserNameFromRefreshToken(
          refreshToken
        );
      } catch (err) {
        return left(new RefreshTokenNotFound());
      }

      try {
        // get the user by username
        user = await this.#userRepo.getUserByUserName(username);
      } catch (err) {
        return left(new UserNotFoundOrDeletedError());
      }

      const accessToken: JWTToken = this.#authService.signJWT({
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.id.toString(),
        adminUser: user.isAdminUser,
      });

      // sign a new jwt for that user
      user.setAccessToken(accessToken, refreshToken);

      // save it
      await this.#authService.saveAuthenticatedUser(user);

      // return the new access token
      return right(Result.ok<JWTToken>(accessToken));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
