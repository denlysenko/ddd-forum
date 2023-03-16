import type { PrismaClient } from '@prisma/client';
import { CommentId } from '../../domain/commentId';
import type { CommentVote } from '../../domain/commentVote';
import type { CommentVotes } from '../../domain/commentVotes';
import type { MemberId } from '../../domain/memberId';
import { PostId } from '../../domain/postId';
import type { VoteType } from '../../domain/vote';
import { CommentVoteMap } from '../../mappers/commentVoteMap';
import type { ICommentVotesRepo } from '../commentVotesRepo';

export class PrismaCommentVotesRepo implements ICommentVotesRepo {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async exists(
    commentId: CommentId,
    memberId: MemberId,
    voteType: VoteType
  ): Promise<boolean> {
    const count = await this.#prisma.commentVote.count({
      where: {
        member_id: memberId.id.toString(),
        comment_id: commentId.id.toString(),
        type: voteType,
      },
    });

    return count > 0;
  }

  async getVotesForCommentByMemberId(
    commentId: CommentId,
    memberId: MemberId
  ): Promise<CommentVote[]> {
    const votes = await this.#prisma.commentVote.findMany({
      where: {
        member_id: memberId.id.toString(),
        comment_id: commentId.id.toString(),
      },
    });

    return votes.map((vote) => CommentVoteMap.toDomain(vote));
  }

  countUpvotesForCommentByCommentId(commentId: CommentId): Promise<number> {
    return this.#prisma.commentVote.count({
      where: {
        comment_id:
          commentId instanceof CommentId
            ? (<CommentId>commentId).id.toString()
            : commentId,
        type: 'UPVOTE',
      },
    });
  }

  countDownvotesForCommentByCommentId(commentId: CommentId): Promise<number> {
    return this.#prisma.commentVote.count({
      where: {
        comment_id:
          commentId instanceof CommentId
            ? (<CommentId>commentId).id.toString()
            : commentId,
        type: 'DOWNVOTE',
      },
    });
  }

  async countAllPostCommentUpvotes(postId: PostId | string): Promise<number> {
    postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId;

    const result = await this.#prisma.$queryRaw`
      SELECT COUNT(*) FROM (
        SELECT COUNT(*) as upvotes
        from post P
        join comment CM on CM.post_id = P.post_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where P.post_id::text = ${postId}
        and CV.type = 'UPVOTE' 
        group by CV.comment_id
      ) as upvotes_total;
    `;

    const count = result[0][0]['COUNT(*)'];
    return count;
  }

  async countAllPostCommentDownvotes(postId: PostId | string): Promise<number> {
    postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId;

    const result = await this.#prisma.$queryRaw`
      SELECT COUNT(*) FROM (
        SELECT COUNT(*) as downvotes
        from post P
        join comment CM on CM.post_id = P.post_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where P.post_id::text = ${postId}
        and CV.type = 'DOWNVOTE' 
        group by CV.comment_id
      ) as downvotes_total;
    `;

    const count = result[0][0]['COUNT(*)'];
    return count;
  }

  async countAllPostCommentUpvotesExcludingOP(
    postId: PostId | string
  ): Promise<number> {
    postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId;
    console.log('postId', postId);

    const result = await this.#prisma.$queryRaw`
      SELECT COUNT(*) FROM (
        SELECT COUNT(*) as upvotes
        from post P
        join comment CM on CM.post_id = P.post_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where P.post_id::text = ${postId}
        and CV.type = 'UPVOTE' 
        and CV.member_id != CM.member_id
        group by CV.comment_id
      ) as upvotes_total;
    `;

    const count = result[0][0]['COUNT(*)'];
    return count;
  }

  async countAllPostCommentDownvotesExcludingOP(
    postId: PostId | string
  ): Promise<number> {
    postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId;

    const result = await this.#prisma.$queryRaw`
      SELECT COUNT(*) FROM (
        SELECT COUNT(*) as downvotes
        from post P
        join comment CM on CM.post_id = P.post_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where P.post_id::text = ${postId}
        and CV.type = 'DOWNVOTE' 
        and CV.member_id != CM.member_id
        group by CV.comment_id
      ) as downvotes_total;
    `;

    const count = result[0][0]['COUNT(*)'];
    return count;
  }

  async saveBulk(votes: CommentVotes): Promise<void> {
    for (const vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (const vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  async save(vote: CommentVote): Promise<void> {
    const exists = await this.exists(vote.commentId, vote.memberId, vote.type);
    const isNew = !exists;
    const rawCommentVote = CommentVoteMap.toPersistence(vote);

    if (!isNew) {
      throw new Error(
        "Shouldn't be re-saving a vote. Only deleting and saving."
      );
    }

    try {
      await this.#prisma.commentVote.create({
        data: rawCommentVote,
      });
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  async delete(vote: CommentVote): Promise<void> {
    await this.#prisma.commentVote.deleteMany({
      where: {
        member_id: vote.memberId.id.toString(),
        comment_id: vote.commentId.id.toString(),
      },
    });
  }
}
