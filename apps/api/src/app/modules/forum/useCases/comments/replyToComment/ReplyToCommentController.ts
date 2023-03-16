import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Result } from '../../../../../shared/core/Result';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { TextUtils } from '../../../../../shared/utils/TextUtils';
import type { ReplyToComment } from './ReplyToComment';
import type { ReplyToCommentDTO } from './ReplyToCommentDTO';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './ReplyToCommentErrors';

export class ReplyToCommentController extends BaseController {
  #useCase: ReplyToComment;

  constructor(useCase: ReplyToComment) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{
      Body: { comment: string };
      Querystring: { slug: string };
      Params: { commentId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = req.user;

    const dto: ReplyToCommentDTO = {
      comment: TextUtils.sanitize(req.body.comment),
      userId: userId,
      slug: req.query.slug,
      parentCommentId: req.params.commentId,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case PostNotFoundError:
            return this.notFound(
              reply,
              (error as PostNotFoundError).getErrorValue().message
            );
          case CommentNotFoundError:
            return this.notFound(
              reply,
              (error as CommentNotFoundError).getErrorValue().message
            );
          case MemberNotFoundError:
            return this.notFound(
              reply,
              (error as MemberNotFoundError).getErrorValue().message
            );
          case UnexpectedError:
            return this.fail(
              reply,
              (error as UnexpectedError).getErrorValue().message
            );
          default:
            return this.clientError(
              reply,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as Result<any>).getErrorValue()
            );
        }
      }

      return this.ok(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
