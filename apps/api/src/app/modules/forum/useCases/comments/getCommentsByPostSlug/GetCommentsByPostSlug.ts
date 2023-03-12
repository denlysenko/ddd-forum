import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { CommentDetails } from '../../../domain/commentDetails';
import type { MemberId } from '../../../domain/memberId';
import type { ICommentRepo } from '../../../repos/commentRepo';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { PostNotFoundError } from './GetCommentsByPostSlugErrors';
import type { GetCommentsByPostSlugRequestDTO } from './GetCommentsByPostSlugRequestDTO';

type Response = Either<
  PostNotFoundError | UnexpectedError,
  Result<CommentDetails[]>
>;

export class GetCommentsByPostSlug
  implements UseCase<GetCommentsByPostSlugRequestDTO, Promise<Response>>
{
  #commentRepo: ICommentRepo;
  #memberRepo: IMemberRepo;

  constructor(commentRepo: ICommentRepo, memberRepo: IMemberRepo) {
    this.#commentRepo = commentRepo;
    this.#memberRepo = memberRepo;
  }

  async execute(req: GetCommentsByPostSlugRequestDTO): Promise<Response> {
    let memberId: MemberId;
    let comments: CommentDetails[];
    const { slug, offset } = req;
    const isAuthenticated = !!req.userId === true;

    if (isAuthenticated) {
      memberId = await this.#memberRepo.getMemberIdByUserId(req.userId);
    }

    try {
      try {
        comments = await this.#commentRepo.getCommentDetailsByPostSlug(
          slug,
          memberId,
          offset
        );
      } catch (err) {
        return left(new UnexpectedError(err));
      }

      return right(Result.ok<CommentDetails[]>(comments));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
