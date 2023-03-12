import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { CommentDTO } from '../../../dtos/commentDTO';
import { CommentDetailsMap } from '../../../mappers/commentDetailsMap';
import type { GetCommentsByPostSlug } from './GetCommentsByPostSlug';
import type { GetCommentsByPostSlugRequestDTO } from './GetCommentsByPostSlugRequestDTO';
import type { GetCommentsByPostSlugResponseDTO } from './GetCommentsByPostSlugResponseDTO';

export class GetCommentsByPostSlugController extends BaseController {
  #useCase: GetCommentsByPostSlug;

  constructor(useCase: GetCommentsByPostSlug) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Querystring: { slug: string; offset: number } }>,
    reply: FastifyReply
  ): Promise<{ comments: CommentDTO[] } | void> {
    const dto: GetCommentsByPostSlugRequestDTO = {
      slug: req.query.slug,
      offset: req.query.offset,
      userId: req.user ? req.user.userId : null,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(reply, error.getErrorValue().message);
        }
      }

      const commentDetails = result.value.getValue();

      return this.ok<GetCommentsByPostSlugResponseDTO>(reply, {
        comments: commentDetails.map((c) => CommentDetailsMap.toDTO(c)),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
