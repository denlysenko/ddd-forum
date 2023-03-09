/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import type { createClient } from 'redis';
import { authConfig } from '../../../../config';
import type { JWTClaims, JWTToken, RefreshToken } from '../../domain/jwt';
import type { User } from '../../domain/user';
import type { IAuthService } from '../authService';
import { AbstractRedisClient } from './abstractRedisClient';

/**
 * @class JWTClient
 * @extends AbstractRedisClient
 * @desc This class is responsible for persisting jwts to redis
 * and for signing tokens. It should also be responsible for determining their
 * validity.
 */

export class RedisAuthService
  extends AbstractRedisClient
  implements IAuthService
{
  jwtHashName = 'activeJwtClients';

  constructor(redisClient: ReturnType<typeof createClient>) {
    super(redisClient);
  }

  async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  async getUserNameFromRefreshToken(
    refreshToken: RefreshToken
  ): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error('Username not found for refresh token.');

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1
    );
  }

  async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.username.value,
        user.refreshToken,
        user.accessToken
      );
    }
  }

  async deAuthenticateUser(username: string): Promise<void> {
    await this.clearAllSessions(username);
  }

  createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  /**
   * @function signJWT
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      username: props.username,
      userId: props.userId,
      adminUser: props.adminUser,
      isEmailVerified: props.isEmailVerified,
    };

    return jwt.sign(claims, authConfig.secret, {
      expiresIn: authConfig.tokenExpiryTime,
    });
  }

  /**
   * @method decodeJWT
   * @desc Decodes the JWT using the server secret. If successful decode,
   * it returns the data from the token.
   * @param {token} string
   * @return Promise<any>
   */

  decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded as JWTClaims);
      });
    });
  }

  #constructKey(username: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${username}`;
  }

  /**
   * @method addToken
   * @desc Adds the token for this user to redis.
   *
   * @param {username} string
   * @param {refreshToken} string
   * @param {token} string
   * @return Promise<any>
   */

  addToken(
    username: string,
    refreshToken: RefreshToken,
    token: JWTToken
  ): Promise<any> {
    return this.set(this.#constructKey(username, refreshToken), token);
  }

  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.deleteOne(key)));
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @param {username} string
   * @return Promise<number>
   */

  countSessions(username: string): Promise<number> {
    return this.count(`*${this.jwtHashName}.${username}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashName}*`);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  async getTokens(username: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${username}`
    );
    return keyValues.map((kv) => kv.value);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @param {username} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  async getToken(username: string, refreshToken: string): Promise<string> {
    return this.getOne(this.#constructKey(username, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @param {username} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  async clearToken(username: string, refreshToken: string): Promise<any> {
    return this.deleteOne(this.#constructKey(username, refreshToken));
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @param {username} string
   * @return Promise<any>
   */

  async clearAllSessions(username: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${username}`
    );
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.deleteOne(key)));
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @param {username} string
   * @param {refreshToken} string
   * @return Promise<boolean>
   */

  async sessionExists(
    username: string,
    refreshToken: string
  ): Promise<boolean> {
    const token = await this.getToken(username, refreshToken);
    return !!token;
  }
}
