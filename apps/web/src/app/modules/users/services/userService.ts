import { left, right } from '../../../shared/core/Either';
import { Result } from '../../../shared/core/Result';
import type { APIResponse } from '../../../shared/infra/services/APIResponse';
import { BaseAPI } from '../../../shared/infra/services/BaseAPI';
import type { LoginDTO } from '../dtos/loginDTO';
import type { User } from '../models/user';
import type { IAuthService } from './authService';

export interface IUsersService {
  getCurrentUserProfile(): Promise<User>;
  createUser(
    email: string,
    username: string,
    password: string
  ): Promise<APIResponse<void>>;
  login(username: string, password: string): Promise<APIResponse<LoginDTO>>;
  logout(): Promise<APIResponse<void>>;
}

export class UsersService extends BaseAPI implements IUsersService {
  constructor(authService: IAuthService) {
    super(authService);
  }

  async getCurrentUserProfile(): Promise<User> {
    const response = await this.get('/users/me', null, {
      authorization: this.authService.getToken('access-token'),
    });
    return response.data.user as User;
  }

  public async logout(): Promise<APIResponse<void>> {
    try {
      await this.post('/users/logout', null, null, {
        authorization: this.authService.getToken('access-token'),
        'Content-Type': 'application/json',
      });
      this.authService.removeToken('access-token');
      this.authService.removeToken('refresh-token');
      return right(Result.ok<void>());
    } catch (err: any) {
      return left(
        err.response ? err.response.data.message : 'Connection failed'
      );
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<APIResponse<LoginDTO>> {
    try {
      const response = await this.post('/users/login', { username, password });
      const dto: LoginDTO = response.data as LoginDTO;
      this.authService.setToken('access-token', dto.accessToken);
      this.authService.setToken('refresh-token', dto.refreshToken);
      return right(Result.ok<LoginDTO>(dto));
    } catch (err: any) {
      return left(
        err.response ? err.response.data.message : 'Connection failed'
      );
    }
  }

  async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<APIResponse<void>> {
    try {
      await this.post('/users', { email, username, password });
      return right(Result.ok<void>());
    } catch (err: any) {
      return left(
        err.response ? err.response.data.message : 'Connection failed'
      );
    }
  }
}
