import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Post } from '../../../domain/post';
import type { ICommentVotesRepo } from '../../../repos/commentVotesRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { IPostVotesRepo } from '../../../repos/postVotesRepo';
import type { UpdatePostStatsDTO } from './UpdatePostStatsDTO';
import { PostNotFoundError } from './UpdatePostStatsErrors';

type Response = Either<PostNotFoundError | UnexpectedError, Result<void>>;

export class UpdatePostStats
  implements UseCase<UpdatePostStatsDTO, Promise<Response>>
{
  #postRepo: IPostRepo;
  #postVotesRepo: IPostVotesRepo;
  #commentVotesRepo: ICommentVotesRepo;

  constructor(
    postRepo: IPostRepo,
    postVotesRepo: IPostVotesRepo,
    commentVotesRepo: ICommentVotesRepo
  ) {
    this.#postRepo = postRepo;
    this.#postVotesRepo = postVotesRepo;
    this.#commentVotesRepo = commentVotesRepo;
  }

  async execute(response: UpdatePostStatsDTO): Promise<Response> {
    const { postId } = response;
    let post: Post;

    try {
      try {
        post = await this.#postRepo.getPostByPostId(response.postId);
      } catch (err) {
        return left(new PostNotFoundError(postId));
      }

      const commentCount: number =
        await this.#postRepo.getNumberOfCommentsByPostId(response.postId);

      // Update comment count
      post.updateTotalNumberComments(commentCount);

      // Update post points
      const [
        numPostUpvotes,
        numPostDownvotes,
        commentUpvotes,
        commentDownvotes,
      ] = await Promise.all([
        this.#postVotesRepo.countPostUpvotesByPostId(post.postId),
        this.#postVotesRepo.countPostDownvotesByPostId(post.postId),
        this.#commentVotesRepo.countAllPostCommentUpvotesExcludingOP(
          post.postId
        ),
        this.#commentVotesRepo.countAllPostCommentDownvotesExcludingOP(
          post.postId
        ),
      ]);

      post.updatePostScore(
        numPostUpvotes,
        numPostDownvotes,
        commentUpvotes,
        commentDownvotes
      );

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
