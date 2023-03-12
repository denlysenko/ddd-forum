import type { MemberId } from '../domain/memberId';
import type { PostId } from '../domain/postId';
import type { PostVote } from '../domain/postVote';
import type { PostVotes } from '../domain/postVotes';
import type { VoteType } from '../domain/vote';

export interface IPostVotesRepo {
  exists(
    postId: PostId,
    memberId: MemberId,
    voteType: VoteType
  ): Promise<boolean>;
  getVotesForPostByMemberId(
    postId: PostId,
    memberId: MemberId
  ): Promise<PostVote[]>;
  countPostUpvotesByPostId(postId: PostId): Promise<number>;
  countPostDownvotesByPostId(postId: PostId): Promise<number>;
  saveBulk(votes: PostVotes): Promise<void>;
  save(votes: PostVote): Promise<void>;
  delete(vote: PostVote): Promise<void>;
}
