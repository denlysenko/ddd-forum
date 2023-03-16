import { PrismaClient } from '@prisma/client';
import { isProduction } from '../../../../config';
import { hooks } from './hooks';

const prisma = new PrismaClient({
  log: isProduction ? [] : ['query', 'error', 'warn', 'info'],
});

prisma.$use(async (params, next) => {
  const result = await next(params);
  const hook = hooks[params.action];

  // TODO: check if it works if transaction fails
  if (hook) {
    hook(params);
  }

  return result;
});

export { prisma };
