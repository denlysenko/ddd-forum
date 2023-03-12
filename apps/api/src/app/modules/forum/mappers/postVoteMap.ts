/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import type { Mapper } from '../../../shared/infra/Mapper';
import { MemberId } from '../domain/memberId';
import { PostId } from '../domain/postId';
import { PostVote } from '../domain/postVote';
import type { VoteType } from '../domain/vote';

export class PostVoteMap implements Mapper<PostVote> {
  static toDomain(raw: any): PostVote {
    const voteType: VoteType = raw.type;

    const postVoteOrError = PostVote.create(
      {
        memberId: MemberId.create(new UniqueEntityID(raw.member_id)).getValue(),
        postId: PostId.create(new UniqueEntityID(raw.post_id)).getValue(),
        type: voteType,
      },
      new UniqueEntityID(raw.post_vote_id)
    );

    postVoteOrError.isFailure
      ? console.log(postVoteOrError.getErrorValue())
      : '';

    return postVoteOrError.isSuccess ? postVoteOrError.getValue() : null;
  }

  static toPersistence(vote: PostVote): any {
    return {
      post_vote_id: vote.id.toString(),
      post_id: vote.postId.id.toString(),
      member_id: vote.memberId.id.toString(),
      type: vote.type,
    };
  }
}
