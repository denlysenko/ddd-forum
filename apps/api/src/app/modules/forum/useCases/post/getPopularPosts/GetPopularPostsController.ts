import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { PostDTO } from '../../../dtos/postDTO';
import { PostDetailsMap } from '../../../mappers/postDetailsMap';
import type { GetPopularPosts } from './GetPopularPosts';
import type { GetPopularPostsRequestDTO } from './GetPopularPostsRequestDTO';
import type { GetPopularPostsResponseDTO } from './GetPopularPostsResponseDTO';

export class GetPopularPostsController extends BaseController {
  #useCase: GetPopularPosts;

  constructor(useCase: GetPopularPosts) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Querystring: { offset: number } }>,
    reply: FastifyReply
  ): Promise<{ posts: PostDTO[] } | void> {
    const dto: GetPopularPostsRequestDTO = {
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

      return this.ok<GetPopularPostsResponseDTO>(reply, {
        posts: postDetails.map((d) => PostDetailsMap.toDTO(d)),
      });
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
