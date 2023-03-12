import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { DownvoteComment } from './DownvoteComment';
import type { DownvoteCommentDTO } from './DownvoteCommentDTO';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvoteCommentErrors';

export class DownvoteCommentController extends BaseController {
  #useCase: DownvoteComment;

  constructor(useCase: DownvoteComment) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: { commentId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = req.user;

    const dto: DownvoteCommentDTO = {
      userId: userId,
      commentId: req.params.commentId,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MemberNotFoundError:
          case PostNotFoundError:
          case CommentNotFoundError:
            return this.notFound(reply, error.getErrorValue().message);
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
      }

      return this.ok(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
