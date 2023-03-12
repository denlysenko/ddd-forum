import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import type { DownvotePost } from './DownvotePost';
import type { DownvotePostDTO } from './DownvotePostDTO';
import {
  AlreadyDownvotedError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvotePostErrors';

export class DownvotePostController extends BaseController {
  #useCase: DownvotePost;

  constructor(useCase: DownvotePost) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{ Body: { slug: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = req.user;

    const dto: DownvotePostDTO = {
      userId: userId,
      slug: req.body.slug,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MemberNotFoundError:
          case PostNotFoundError:
            return this.notFound(reply, error.getErrorValue().message);
          case AlreadyDownvotedError:
            return this.conflict(reply, error.getErrorValue().message);
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
