import type { FastifyReply, FastifyRequest } from 'fastify';

export abstract class BaseController {
  protected abstract executeImpl(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void | unknown>;

  async execute(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this.executeImpl(req, reply);
    } catch (err) {
      reply.log.error(`[BaseController]: Uncaught controller error`);
      reply.log.error(err);
      this.fail(reply, 'An unexpected error occurred');
    }
  }

  async ok<T>(reply: FastifyReply, dto?: T) {
    if (dto) {
      reply.type('application/json');
      reply.code(200);
      return dto;
    } else {
      reply.code(200);
    }
  }

  async created(reply: FastifyReply) {
    reply.code(201);
  }

  async clientError(reply: FastifyReply, message?: string) {
    return reply.badRequest(message);
  }

  async unauthorized(reply: FastifyReply, message?: string) {
    return reply.unauthorized(message);
  }

  async paymentRequired(reply: FastifyReply, message?: string) {
    return reply.paymentRequired(message);
  }

  async forbidden(reply: FastifyReply, message?: string) {
    return reply.forbidden(message);
  }

  async notFound(reply: FastifyReply, message?: string) {
    return reply.notFound(message);
  }

  async conflict(reply: FastifyReply, message?: string) {
    return reply.conflict(message);
  }

  async tooMany(reply: FastifyReply, message?: string) {
    return reply.tooManyRequests(message);
  }

  async fail(reply: FastifyReply, error: Error | string) {
    reply.log.error(error);
    return reply.internalServerError(error.toString());
  }
}
