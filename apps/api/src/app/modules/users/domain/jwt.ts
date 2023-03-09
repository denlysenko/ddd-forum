export interface JWTClaims {
  readonly userId: string;
  readonly isEmailVerified: boolean;
  readonly email: string;
  readonly username: string;
  readonly adminUser: boolean;
}

export type JWTToken = string;

export type SessionId = string;

export type RefreshToken = string;
