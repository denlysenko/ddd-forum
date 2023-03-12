import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { PostDTO } from '../../../dtos/postDTO';
import { PostDetailsMap } from '../../../mappers/postDetailsMap';
import type { GetRecentPosts } from './GetRecentPosts';
import type { GetRecentPostsRequestDTO } from './GetRecentPostsRequestDTO';
import type { GetRecentPostsResponseDTO } from './GetRecentPostsResponseDTO';

export class GetRecentPostsController extends BaseController {
  #useCase: GetRecentPosts;

  constructor(useCase: GetRecentPosts) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Querystring: { offset: number } }>,
    reply: FastifyReply
  ): Promise<{ posts: PostDTO[] } | void> {
    const dto: GetRecentPostsRequestDTO = {
      offset: req.query.offset,
      userId: !!req.user === true ? req.user.userId : null,
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

      return this.ok<GetRecentPostsResponseDTO>(reply, {
        posts: postDetails.map((d) => PostDetailsMap.toDTO(d)),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
