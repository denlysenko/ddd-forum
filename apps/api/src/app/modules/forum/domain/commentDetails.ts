import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';
import type { CommentId } from './commentId';
import type { CommentText } from './commentText';
import type { MemberDetails } from './memberDetails';
import type { PostSlug } from './postSlug';
import type { PostTitle } from './postTitle';

interface CommentDetailsProps {
  commentId: CommentId;
  text: CommentText;
  member: MemberDetails;
  createdAt: Date | string;
  postSlug: PostSlug;
  postTitle: PostTitle;
  parentCommentId?: CommentId;
  points: number;
  wasUpvotedByMe: boolean;
  wasDownvotedByMe: boolean;
  childComments?: CommentDetails[];
}

export class CommentDetails extends ValueObject<CommentDetailsProps> {
  static create(props: CommentDetailsProps): Result<CommentDetails> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.commentId, argumentName: 'commentId' },
      { argument: props.text, argumentName: 'text' },
      { argument: props.member, argumentName: 'member' },
      { argument: props.createdAt, argumentName: 'createdAt' },
      { argument: props.postSlug, argumentName: 'postSlug' },
      { argument: props.postTitle, argumentName: 'postTitle' },
      { argument: props.points, argumentName: 'points' },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<CommentDetails>(nullGuard.getErrorValue());
    }

    return Result.ok<CommentDetails>(
      new CommentDetails({
        ...props,
        wasUpvotedByMe: props.wasUpvotedByMe ? props.wasUpvotedByMe : false,
        wasDownvotedByMe: props.wasDownvotedByMe
          ? props.wasDownvotedByMe
          : false,
      })
    );
  }

  private constructor(props: CommentDetailsProps) {
    super(props);
  }

  get commentId(): CommentId {
    return this.props.commentId;
  }

  get text(): CommentText {
    return this.props.text;
  }

  get member(): MemberDetails {
    return this.props.member;
  }

  get createdAt(): Date | string {
    return this.props.createdAt;
  }

  get postSlug(): PostSlug {
    return this.props.postSlug;
  }

  get postTitle(): PostTitle {
    return this.props.postTitle;
  }

  get parentCommentId(): CommentId {
    return this.props.parentCommentId;
  }

  get points(): number {
    return this.props.points;
  }

  get wasUpvotedByMe(): boolean {
    return this.props.wasUpvotedByMe;
  }

  get wasDownvotedByMe(): boolean {
    return this.props.wasDownvotedByMe;
  }

  get childComments(): CommentDetails[] {
    return this.props.childComments;
  }
}
