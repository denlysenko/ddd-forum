import type { RefreshToken } from '../../domain/jwt';

export interface RefreshAccessTokenDTO {
  readonly refreshToken: RefreshToken;
}
