import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { CommentDetails } from '../../../domain/commentDetails';
import type { MemberId } from '../../../domain/memberId';
import type { ICommentRepo } from '../../../repos/commentRepo';
import type { IMemberRepo } from '../../../repos/memberRepo';
import { CommentNotFoundError } from './GetCommentByCommentIdErrors';
import type { GetCommentByCommentIdRequestDTO } from './GetCommentByCommentIdRequestDTO';

type Response = Either<
  CommentNotFoundError | UnexpectedError,
  Result<CommentDetails>
>;

export class GetCommentByCommentId
  implements UseCase<GetCommentByCommentIdRequestDTO, Promise<Response>>
{
  #commentRepo: ICommentRepo;
  #memberRepo: IMemberRepo;

  constructor(commentRepo: ICommentRepo, memberRepo: IMemberRepo) {
    this.#commentRepo = commentRepo;
    this.#memberRepo = memberRepo;
  }

  async execute(req: GetCommentByCommentIdRequestDTO): Promise<Response> {
    let comment: CommentDetails;
    let memberId: MemberId;

    try {
      const isAuthenticated = !!req.userId === true;

      if (isAuthenticated) {
        memberId = await this.#memberRepo.getMemberIdByUserId(req.userId);
      }

      comment = await this.#commentRepo.getCommentDetailsByCommentId(
        req.commentId,
        memberId
      );

      if (!comment) {
        return left(new CommentNotFoundError(req.commentId));
      }

      return right(Result.ok<CommentDetails>(comment));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
