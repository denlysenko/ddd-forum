import { prisma } from '../../../shared/infra/database/prisma';
import { PrismaUserRepo } from './implementations/prismaUserRepo';

const userRepo = new PrismaUserRepo(prisma);

export { userRepo };
