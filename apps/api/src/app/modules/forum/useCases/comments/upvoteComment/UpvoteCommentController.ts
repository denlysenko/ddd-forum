import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { UpvoteComment } from './UpvoteComment';
import type { UpvoteCommentDTO } from './UpvoteCommentDTO';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './UpvoteCommentErrors';

export class UpvoteCommentController extends BaseController {
  #useCase: UpvoteComment;

  constructor(useCase: UpvoteComment) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: { commentId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = req.user;

    const dto: UpvoteCommentDTO = {
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
