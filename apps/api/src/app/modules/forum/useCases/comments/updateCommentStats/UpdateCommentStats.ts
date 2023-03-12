import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Comment } from '../../../domain/comment';
import type { ICommentRepo } from '../../../repos/commentRepo';
import type { ICommentVotesRepo } from '../../../repos/commentVotesRepo';
import type { UpdateCommentStatsDTO } from './UpdateCommentStatsDTO';

type Response = Either<UnexpectedError, Result<void>>;

export class UpdateCommentStats
  implements UseCase<UpdateCommentStatsDTO, Promise<Response>>
{
  #commentRepo: ICommentRepo;
  #commentVotesRepo: ICommentVotesRepo;

  constructor(commentRepo: ICommentRepo, commentVotesRepo: ICommentVotesRepo) {
    this.#commentRepo = commentRepo;
    this.#commentVotesRepo = commentVotesRepo;
  }

  async execute(req: UpdateCommentStatsDTO): Promise<any> {
    try {
      // Get the comment
      const comment: Comment = await this.#commentRepo.getCommentByCommentId(
        req.commentId.id.toString()
      );

      // Get number upvotes and downvotes
      const [numUpvotes, numDownvotes] = await Promise.all([
        this.#commentVotesRepo.countUpvotesForCommentByCommentId(req.commentId),
        this.#commentVotesRepo.countDownvotesForCommentByCommentId(
          req.commentId
        ),
      ]);

      comment.updateScore(numUpvotes, numDownvotes);

      await this.#commentRepo.save(comment);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
