import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { PostDetails } from '../../../domain/postDetails';
import type { IPostRepo } from '../../../repos/postRepo';
import type { GetPostBySlugDTO } from './GetPostBySlugDTO';
import { PostNotFoundError } from './GetPostBySlugErrors';

type Response = Either<
  PostNotFoundError | UnexpectedError,
  Result<PostDetails>
>;

export class GetPostBySlug
  implements UseCase<GetPostBySlugDTO, Promise<Response>>
{
  #postRepo: IPostRepo;

  constructor(postRepo: IPostRepo) {
    this.#postRepo = postRepo;
  }

  async execute(req: GetPostBySlugDTO): Promise<Response> {
    let postDetails: PostDetails;
    const { slug } = req;

    try {
      try {
        postDetails = await this.#postRepo.getPostDetailsBySlug(slug);
      } catch (err) {
        return left(new PostNotFoundError(slug));
      }

      return right(Result.ok<PostDetails>(postDetails));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
