import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UnexpectedError } from '../../../../../shared/core/AppError';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { TextUtils } from '../../../../../shared/utils/TextUtils';
import type { PostType } from '../../../domain/postType';
import type { CreatePost } from './CreatePost';
import type { CreatePostDTO } from './CreatePostDTO';
import { MemberDoesntExistError } from './CreatePostErrors';

export class CreatePostController extends BaseController {
  #useCase: CreatePost;

  constructor(useCase: CreatePost) {
    super();
    this.#useCase = useCase;
  }

  async executeImpl(
    req: FastifyRequest<{
      Body: {
        title?: string;
        text?: string;
        postType: PostType;
        link?: string;
      };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = req.user;

    const dto: CreatePostDTO = {
      title: TextUtils.sanitize(req.body.title),
      text: req.body.text ? TextUtils.sanitize(req.body.text) : null,
      userId: userId,
      postType: req.body.postType,
      link: req.body.link ? TextUtils.sanitize(req.body.link) : null,
    };

    try {
      const result = await this.#useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MemberDoesntExistError:
            return this.notFound(
              reply,
              (error as MemberDoesntExistError).getErrorValue().message
            );
          default:
            return this.fail(
              reply,
              (error as UnexpectedError).getErrorValue().message
            );
        }
      }

      return this.ok(reply);
    } catch (err) {
      return this.fail(reply, err);
    }
  }
}
