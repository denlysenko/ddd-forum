import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import type { Mapper } from '../../../shared/infra/Mapper';
import { CommentDetails } from '../domain/commentDetails';
import { CommentId } from '../domain/commentId';
import { CommentText } from '../domain/commentText';
import type { CommentVote } from '../domain/commentVote';
import { PostSlug } from '../domain/postSlug';
import { PostTitle } from '../domain/postTitle';
import type { CommentDTO } from '../dtos/commentDTO';
import { CommentVoteMap } from './commentVoteMap';
import { MemberDetailsMap } from './memberDetailsMap';

export class CommentDetailsMap implements Mapper<CommentDetails> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(raw: any): CommentDetails {
    const votes: CommentVote[] = raw.CommentVotes
      ? raw.CommentVotes.map((v) => CommentVoteMap.toDomain(v))
      : [];

    const commentDetailsOrError = CommentDetails.create({
      postTitle: PostTitle.create({ value: raw.Post.title }).getValue(),
      commentId: CommentId.create(
        new UniqueEntityID(raw.comment_id)
      ).getValue(),
      text: CommentText.create({ value: raw.text }).getValue(),
      member: MemberDetailsMap.toDomain(raw.Member),
      createdAt: raw.createdAt,
      postSlug: PostSlug.createFromExisting(raw.Post.slug).getValue(),
      parentCommentId: raw.parent_comment_id
        ? CommentId.create(new UniqueEntityID(raw.parent_comment_id)).getValue()
        : null,
      points: raw.points,
      wasUpvotedByMe: !!votes.find((v) => v.isUpvote()),
      wasDownvotedByMe: !!votes.find((v) => v.isDownvote()),
    });

    commentDetailsOrError.isFailure
      ? console.log(commentDetailsOrError.getErrorValue())
      : '';

    return commentDetailsOrError.isSuccess
      ? commentDetailsOrError.getValue()
      : null;
  }

  static toDTO(commentDetails: CommentDetails): CommentDTO {
    return {
      postSlug: commentDetails.postSlug.value,
      commentId: commentDetails.commentId.id.toString(),
      parentCommentId: commentDetails.parentCommentId
        ? commentDetails.parentCommentId.id.toString()
        : null,
      text: commentDetails.text.value,
      member: MemberDetailsMap.toDTO(commentDetails.member),
      createdAt: commentDetails.createdAt,
      childComments: [],
      postTitle: commentDetails.postTitle.value,
      points: commentDetails.points,
      wasUpvotedByMe: commentDetails.wasUpvotedByMe,
      wasDownvotedByMe: commentDetails.wasDownvotedByMe,
    };
  }
}