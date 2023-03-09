import type { User } from '../domain/user';
import type { UserEmail } from '../domain/userEmail';
import type { UserName } from '../domain/userName';

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: UserName | string): Promise<User>;
  save(user: User): Promise<void>;
}
