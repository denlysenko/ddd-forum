import type { Prisma } from '@prisma/client';
import { DomainEvents } from '../../../domain/events/DomainEvents';
import { UniqueEntityID } from '../../../domain/UniqueEntityID';

const dispatchEvents = (primaryKey: string) => {
  const aggregateId = new UniqueEntityID(primaryKey);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
};

export const hooks = {
  create: (params: Prisma.MiddlewareParams) => {
    switch (params.model) {
      case 'BaseUser':
        dispatchEvents(params.args.data.base_user_id);
        break;
      case 'Member':
        dispatchEvents(params.args.data.member_id);
        break;
      case 'Post':
        dispatchEvents(params.args.data.post_id);
        break;
      default:
        break;
    }
  },
  update: (params: Prisma.MiddlewareParams) => {
    switch (params.model) {
      case 'BaseUser':
        dispatchEvents(params.args.where.base_user_id);
        break;
      case 'Member':
        dispatchEvents(params.args.where.member_id);
        break;
      case 'Post':
        dispatchEvents(params.args.where.post_id);
        break;
      default:
        break;
    }
  },
  delete: (params: Prisma.MiddlewareParams) => {
    switch (params.model) {
      case 'BaseUser':
        dispatchEvents(params.args.where.base_user_id);
        break;
      case 'Member':
        dispatchEvents(params.args.where.member_id);
        break;
      case 'Post':
        dispatchEvents(params.args.where.post_id);
        break;
      default:
        break;
    }
  },
  deleteMany: (params: Prisma.MiddlewareParams) => {
    switch (params.model) {
      case 'BaseUser':
        dispatchEvents(params.args.where.base_user_id);
        break;
      case 'Member':
        dispatchEvents(params.args.where.member_id);
        break;
      case 'Post':
        dispatchEvents(params.args.where.post_id);
        break;
      default:
        break;
    }
  },
};
