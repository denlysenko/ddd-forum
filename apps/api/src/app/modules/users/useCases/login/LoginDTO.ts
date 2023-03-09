import type { JWTToken, RefreshToken } from '../../domain/jwt';

export interface LoginDTO {
  readonly username: string;
  readonly password: string;
}

export interface LoginDTOResponse {
  readonly accessToken: JWTToken;
  readonly refreshToken: RefreshToken;
}
