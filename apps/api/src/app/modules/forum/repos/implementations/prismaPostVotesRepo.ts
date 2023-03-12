import type { PrismaClient } from '@prisma/client';
import type { MemberId } from '../../domain/memberId';
import { PostId } from '../../domain/postId';
import type { PostVote } from '../../domain/postVote';
import type { PostVotes } from '../../domain/postVotes';
import type { VoteType } from '../../domain/vote';
import { PostVoteMap } from '../../mappers/postVoteMap';
import type { IPostVotesRepo } from '../postVotesRepo';

export class PrismaPostVotesRepo implements IPostVotesRepo {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async exists(
    postId: PostId,
    memberId: MemberId,
    voteType: VoteType
  ): Promise<boolean> {
    const count = await this.#prisma.postVote.count({
      where: {
        member_id: memberId.id.toString(),
        post_id: postId.id.toString(),
        type: voteType,
      },
    });

    return count > 0;
  }

  async getVotesForPostByMemberId(
    postId: PostId,
    memberId: MemberId
  ): Promise<PostVote[]> {
    const votes = await this.#prisma.postVote.findMany({
      where: {
        member_id: memberId.id.toString(),
        post_id: postId.id.toString(),
      },
    });

    return votes.map((vote) => PostVoteMap.toDomain(vote));
  }

  countPostUpvotesByPostId(postId: PostId): Promise<number> {
    return this.#prisma.postVote.count({
      where: {
        post_id: postId instanceof PostId ? postId.id.toString() : postId,
        type: 'UPVOTE',
      },
    });
  }

  countPostDownvotesByPostId(postId: PostId): Promise<number> {
    return this.#prisma.postVote.count({
      where: {
        post_id: postId instanceof PostId ? postId.id.toString() : postId,
        type: 'DOWNVOTE',
      },
    });
  }

  async saveBulk(votes: PostVotes): Promise<void> {
    for (const vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (const vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  async save(vote: PostVote): Promise<void> {
    const exists = await this.exists(vote.postId, vote.memberId, vote.type);
    const rawPostVote = PostVoteMap.toPersistence(vote);

    if (exists) {
      throw new Error('Invalid state. Votes arent updated.');
    }

    try {
      await this.#prisma.postVote.create({
        data: rawPostVote,
      });
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  async delete(vote: PostVote): Promise<void> {
    await this.#prisma.postVote.deleteMany({
      where: {
        post_id: vote.postId.id.toString(),
        member_id: vote.memberId.id.toString(),
      },
    });
  }
}
