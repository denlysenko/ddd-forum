import { PrismaClient } from '@prisma/client';
import { PrismaUserRepo } from './implementations/prismaUserRepo';

const client = new PrismaClient();
const userRepo = new PrismaUserRepo(client);

export { userRepo };
