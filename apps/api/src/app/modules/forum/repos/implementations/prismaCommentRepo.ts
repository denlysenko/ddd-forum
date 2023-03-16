import type { PrismaClient } from '@prisma/client';
import type { Comment } from '../../domain/comment';
import type { CommentDetails } from '../../domain/commentDetails';
import type { CommentId } from '../../domain/commentId';
import type { CommentVotes } from '../../domain/commentVotes';
import type { MemberId } from '../../domain/memberId';
import { CommentDetailsMap } from '../../mappers/commentDetailsMap';
import { CommentMap } from '../../mappers/commentMap';
import type { ICommentRepo } from '../commentRepo';
import type { ICommentVotesRepo } from '../commentVotesRepo';

export class PrismaCommentRepo implements ICommentRepo {
  #prisma: PrismaClient;
  #commentVotesRepo: ICommentVotesRepo;

  constructor(prisma: PrismaClient, commentVotesRepo: ICommentVotesRepo) {
    this.#prisma = prisma;
    this.#commentVotesRepo = commentVotesRepo;
  }

  async exists(commentId: string): Promise<boolean> {
    const count = await this.#prisma.comment.count({
      where: { comment_id: commentId },
    });

    return count > 0;
  }

  async getCommentDetailsByPostSlug(
    slug: string,
    memberId?: MemberId,
    offset?: number
  ): Promise<CommentDetails[]> {
    const comments = await this.#prisma.comment.findMany({
      where: {
        post: {
          slug,
        },
        ...(memberId
          ? {
              commentVotes: {
                some: {
                  member_id: memberId.id.toString(),
                },
              },
            }
          : {}),
      },
      include: {
        post: true,
        commentVotes: !!memberId,
        member: {
          include: {
            baseUser: true,
          },
        },
      },
      take: 15,
      skip: offset ?? 0,
    });

    return comments.map((comment) => CommentDetailsMap.toDomain(comment));
  }

  async getCommentDetailsByCommentId(
    commentId: string,
    memberId?: MemberId
  ): Promise<CommentDetails> {
    const comment = await this.#prisma.comment.findFirst({
      where: {
        comment_id: commentId,
        ...(memberId
          ? {
              commentVotes: {
                some: {
                  member_id: memberId.id.toString(),
                },
              },
            }
          : {}),
      },
      include: {
        post: true,
        member: {
          include: {
            baseUser: true,
          },
        },
        childComments: {
          include: {
            post: true,
            member: {
              include: {
                baseUser: true,
              },
            },
          },
        },
        commentVotes: !!memberId,
      },
    });

    if (!comment) {
      return undefined;
    }

    return CommentDetailsMap.toDomain(comment);
  }

  async getCommentByCommentId(commentId: string): Promise<Comment> {
    const comment = await this.#prisma.comment.findUnique({
      where: {
        comment_id: commentId,
      },
      include: {
        post: true,
        member: true,
      },
    });

    return CommentMap.toDomain(comment);
  }

  async save(comment: Comment): Promise<void> {
    const exists = await this.exists(comment.commentId.id.toString());
    const rawComment = CommentMap.toPersistence(comment);

    if (!exists) {
      try {
        await this.#prisma.comment.create({
          data: rawComment,
        });
        await this.#saveCommentVotes(comment.getVotes());
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      await this.#saveCommentVotes(comment.getVotes());
      await this.#prisma.comment.update({
        where: { comment_id: comment.commentId.id.toString() },
        data: rawComment,
      });
    }
  }

  async saveBulk(comments: Comment[]): Promise<void> {
    for (const comment of comments) {
      await this.save(comment);
    }
  }

  async deleteComment(commentId: CommentId): Promise<void> {
    await this.#prisma.comment.deleteMany({
      where: { comment_id: commentId.id.toString() },
    });
  }

  #saveCommentVotes(commentVotes: CommentVotes) {
    return this.#commentVotesRepo.saveBulk(commentVotes);
  }
}
