import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { PostDetails } from '../../../domain/postDetails';
import type { IPostRepo } from '../../../repos/postRepo';
import type { GetRecentPostsRequestDTO } from './GetRecentPostsRequestDTO';

type Response = Either<UnexpectedError, Result<PostDetails[]>>;

export class GetRecentPosts
  implements UseCase<GetRecentPostsRequestDTO, Promise<Response>>
{
  #postRepo: IPostRepo;

  constructor(postRepo: IPostRepo) {
    this.#postRepo = postRepo;
  }

  public async execute(req: GetRecentPostsRequestDTO): Promise<Response> {
    try {
      const posts = await this.#postRepo.getRecentPosts(req.offset);
      return right(Result.ok<PostDetails[]>(posts));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
