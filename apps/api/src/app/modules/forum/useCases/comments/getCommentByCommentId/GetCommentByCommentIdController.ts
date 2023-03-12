import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { CommentDTO } from '../../../dtos/commentDTO';
import { CommentDetailsMap } from '../../../mappers/commentDetailsMap';
import type { GetCommentByCommentId } from './GetCommentByCommentId';
import { CommentNotFoundError } from './GetCommentByCommentIdErrors';
import type { GetCommentByCommentIdRequestDTO } from './GetCommentByCommentIdRequestDTO';
import type { GetCommentByCommentIdResponseDTO } from './GetCommentByCommentIdResponseDTO';

export class GetCommentByCommentIdController extends BaseController {
  #useCase: GetCommentByCommentId;

  constructor(useCase: GetCommentByCommentId) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Params: { commentId: string } }>,
    reply: FastifyReply
  ): Promise<{ comment: CommentDTO } | void> {
    const dto: GetCommentByCommentIdRequestDTO = {
      commentId: req.params.commentId,
      userId: req.user ? req.user.userId : null,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CommentNotFoundError:
            return this.notFound(reply, error.getErrorValue().message);
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
      }

      const commentDetails = result.value.getValue();

      return this.ok<GetCommentByCommentIdResponseDTO>(reply, {
        comment: CommentDetailsMap.toDTO(commentDetails),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
