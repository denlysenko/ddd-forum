import type { CommentId } from '../domain/commentId';
import type { CommentVote } from '../domain/commentVote';
import type { CommentVotes } from '../domain/commentVotes';
import type { MemberId } from '../domain/memberId';
import type { PostId } from '../domain/postId';
import type { VoteType } from '../domain/vote';

export interface ICommentVotesRepo {
  exists(
    commentId: CommentId,
    memberId: MemberId,
    voteType: VoteType
  ): Promise<boolean>;
  getVotesForCommentByMemberId(
    commentId: CommentId,
    memberId: MemberId
  ): Promise<CommentVote[]>;
  countUpvotesForCommentByCommentId(comment: CommentId): Promise<number>;
  countDownvotesForCommentByCommentId(comment: CommentId): Promise<number>;
  countAllPostCommentUpvotes(postId: PostId): Promise<number>;
  countAllPostCommentDownvotes(postId: PostId): Promise<number>;
  countAllPostCommentUpvotesExcludingOP(postId: PostId): Promise<number>;
  countAllPostCommentDownvotesExcludingOP(postId: PostId): Promise<number>;
  saveBulk(votes: CommentVotes): Promise<void>;
  save(vote: CommentVote): Promise<void>;
  delete(vote: CommentVote): Promise<void>;
}
