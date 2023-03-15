import type { PrismaClient } from '@prisma/client';
import type { User } from '../../domain/user';
import type { UserEmail } from '../../domain/userEmail';
import { UserName } from '../../domain/userName';
import { UserMap } from '../../mappers/userMap';
import type { IUserRepo } from '../userRepo';

export class PrismaUserRepo implements IUserRepo {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const count = await this.#prisma.baseUser.count({
      where: { user_email: userEmail.value },
    });

    return count > 0;
  }

  async getUserByUserId(userId: string): Promise<User> {
    console.log(userId);
    const baseUser = await this.#prisma.baseUser.findUnique({
      where: { base_user_id: userId },
    });

    if (!!baseUser === false) {
      return undefined;
    }

    return UserMap.toDomain(baseUser);
  }

  async getUserByUserName(userName: string | UserName): Promise<User> {
    const baseUser = await this.#prisma.baseUser.findFirst({
      where: {
        username: userName instanceof UserName ? userName.value : userName,
      },
    });

    if (!!baseUser === false) {
      return undefined;
    }

    return UserMap.toDomain(baseUser);
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);
    const rawUser = await UserMap.toPersistence(user);

    if (!exists) {
      await this.#prisma.baseUser.create({
        data: rawUser,
      });
    } else {
      await this.#prisma.baseUser.update({
        where: { base_user_id: user.id.toString() },
        data: rawUser,
      });
    }
  }
}
