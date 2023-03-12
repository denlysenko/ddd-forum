import { prisma } from '../../../shared/infra/database/prisma';
import { PrismaCommentRepo } from './implementations/prismaCommentRepo';
import { PrismaCommentVotesRepo } from './implementations/prismaCommentVotesRepo';
import { PrismaMemberRepo } from './implementations/prismaMemberRepo';
import { PrismaPostRepo } from './implementations/prismaPostRepo';
import { PrismaPostVotesRepo } from './implementations/prismaPostVotesRepo';

const commentVotesRepo = new PrismaCommentVotesRepo(prisma);
const postVotesRepo = new PrismaPostVotesRepo(prisma);
const memberRepo = new PrismaMemberRepo(prisma);
const commentRepo = new PrismaCommentRepo(prisma, commentVotesRepo);
const postRepo = new PrismaPostRepo(prisma, commentRepo, postVotesRepo);

export { memberRepo, postRepo, commentRepo, postVotesRepo, commentVotesRepo };
