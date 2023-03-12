import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { PostDTO } from '../../../dtos/postDTO';
import { PostDetailsMap } from '../../../mappers/postDetailsMap';
import type { GetPostBySlug } from './GetPostBySlug';
import type { GetPostBySlugDTO } from './GetPostBySlugDTO';

export class GetPostBySlugController extends BaseController {
  #useCase: GetPostBySlug;

  constructor(useCase: GetPostBySlug) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Querystring: { slug: string } }>,
    reply: FastifyReply
  ): Promise<{ post: PostDTO } | void> {
    const dto: GetPostBySlugDTO = {
      slug: req.query.slug,
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

      const postDetails = result.value.getValue();

      return this.ok<{ post: PostDTO }>(reply, {
        post: PostDetailsMap.toDTO(postDetails),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
