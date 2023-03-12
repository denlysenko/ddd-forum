import { UnexpectedError } from '../../../../../shared/core/AppError';
import { left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Comment } from '../../../domain/comment';
import type { CommentVote } from '../../../domain/commentVote';
import type { Member } from '../../../domain/member';
import type { Post } from '../../../domain/post';
import type { PostService } from '../../../domain/services/postService';
import type { ICommentRepo } from '../../../repos/commentRepo';
import type { ICommentVotesRepo } from '../../../repos/commentVotesRepo';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { UpvoteCommentDTO } from './UpvoteCommentDTO';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './UpvoteCommentErrors';
import type { UpvoteCommentResponse } from './UpvoteCommentResponse';

export class UpvoteComment
  implements UseCase<UpvoteCommentDTO, Promise<UpvoteCommentResponse>>
{
  #postRepo: IPostRepo;
  #memberRepo: IMemberRepo;
  #commentRepo: ICommentRepo;
  #commentVotesRepo: ICommentVotesRepo;
  #postService: PostService;

  constructor(
    postRepo: IPostRepo,
    memberRepo: IMemberRepo,
    commentRepo: ICommentRepo,
    commentVotesRepo: ICommentVotesRepo,
    postService: PostService
  ) {
    this.#postRepo = postRepo;
    this.#memberRepo = memberRepo;
    this.#commentRepo = commentRepo;
    this.#commentVotesRepo = commentVotesRepo;
    this.#postService = postService;
  }

  async execute(req: UpvoteCommentDTO): Promise<UpvoteCommentResponse> {
    let member: Member;
    let post: Post;
    let comment: Comment;
    let existingVotesOnCommentByMember: CommentVote[];

    try {
      try {
        member = await this.#memberRepo.getMemberByUserId(req.userId);
      } catch (err) {
        return left(new MemberNotFoundError());
      }

      try {
        comment = await this.#commentRepo.getCommentByCommentId(req.commentId);
      } catch (err) {
        return left(new CommentNotFoundError(req.commentId));
      }

      try {
        post = await this.#postRepo.getPostByPostId(
          comment.postId.id.toString()
        );
      } catch (err) {
        return left(new PostNotFoundError(req.commentId));
      }

      existingVotesOnCommentByMember =
        await this.#commentVotesRepo.getVotesForCommentByMemberId(
          comment.commentId,
          member.memberId
        );

      const upvoteCommentResult = this.#postService.upvoteComment(
        post,
        member,
        comment,
        existingVotesOnCommentByMember
      );

      if (upvoteCommentResult.isLeft()) {
        return left(upvoteCommentResult.value);
      }

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
