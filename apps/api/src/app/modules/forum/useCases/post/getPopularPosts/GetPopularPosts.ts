import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { PostDetails } from '../../../domain/postDetails';
import type { IPostRepo } from '../../../repos/postRepo';
import type { GetPopularPostsRequestDTO } from './GetPopularPostsRequestDTO';

type Response = Either<UnexpectedError, Result<PostDetails[]>>;

export class GetPopularPosts
  implements UseCase<GetPopularPostsRequestDTO, Promise<Response>>
{
  #postRepo: IPostRepo;

  constructor(postRepo: IPostRepo) {
    this.#postRepo = postRepo;
  }

  async execute(req: GetPopularPostsRequestDTO): Promise<Response> {
    try {
      const posts = await this.#postRepo.getPopularPosts(req.offset);
      return right(Result.ok<PostDetails[]>(posts));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
