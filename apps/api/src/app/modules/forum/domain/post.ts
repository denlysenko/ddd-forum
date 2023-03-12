import { has } from 'lodash';
import { Guard, IGuardArgument } from '../../../shared/core/Guard';
import { Either, left, Result, right } from '../../../shared/core/Result';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import type { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { EditPostErrors } from '../useCases/post/editPost/EditPostErrors';
import type { Comment } from './comment';
import { Comments } from './comments';
import { CommentPosted } from './events/commentPosted';
import { CommentVotesChanged } from './events/commentVotesChanged';
import { PostCreated } from './events/postCreated';
import { PostVotesChanged } from './events/postVotesChanged';
import type { MemberId } from './memberId';
import { PostId } from './postId';
import type { PostLink } from './postLink';
import type { PostSlug } from './postSlug';
import type { PostText } from './postText';
import type { PostTitle } from './postTitle';
import type { PostType } from './postType';
import { PostVote } from './postVote';
import { PostVotes } from './postVotes';

export type UpdatePostOrLinkResult = Either<
  | EditPostErrors.InvalidPostTypeOperationError
  | EditPostErrors.PostSealedError
  | Result<void>,
  Result<void>
>;

export interface PostProps {
  memberId: MemberId;
  slug: PostSlug;
  title: PostTitle;
  type: PostType;
  text?: PostText;
  link?: PostLink;
  comments?: Comments;
  votes?: PostVotes;
  totalNumComments?: number;
  points?: number; // posts can have negative or positive valued points
  dateTimePosted?: string | Date;
}

export class Post extends AggregateRoot<PostProps> {
  static create(props: PostProps, id?: UniqueEntityID): Result<Post> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.memberId, argumentName: 'memberId' },
      { argument: props.slug, argumentName: 'slug' },
      { argument: props.title, argumentName: 'title' },
      { argument: props.type, argumentName: 'type' },
    ];

    if (props.type === 'link') {
      guardArgs.push({ argument: props.link, argumentName: 'link' });
    } else {
      guardArgs.push({ argument: props.text, argumentName: 'text' });
    }

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<Post>(guardResult.getErrorValue());
    }

    if (!this.isValidPostType(props.type)) {
      return Result.fail<Post>('Invalid post type provided.');
    }

    const defaultValues: PostProps = {
      ...props,
      comments: props.comments ? props.comments : Comments.create([]),
      points: has(props, 'points') ? props.points : 0,
      dateTimePosted: props.dateTimePosted ? props.dateTimePosted : new Date(),
      totalNumComments: props.totalNumComments ? props.totalNumComments : 0,
      votes: props.votes ? props.votes : PostVotes.create([]),
    };

    const isNewPost = !!id === false;
    const post = new Post(defaultValues, id);

    if (isNewPost) {
      post.addDomainEvent(new PostCreated(post));

      // Create with initial upvote from whomever created the post
      post.addVote(
        PostVote.createUpvote(props.memberId, post.postId).getValue()
      );
    }

    return Result.ok<Post>(post);
  }

  static isValidPostType(rawType: string): boolean {
    const linkType: PostType = 'link';
    const textType: PostType = 'text';
    return rawType === textType || rawType === linkType;
  }

  private constructor(props: PostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get postId(): PostId {
    return PostId.create(this._id).getValue();
  }

  get memberId(): MemberId {
    return this.props.memberId;
  }

  get title(): PostTitle {
    return this.props.title;
  }

  get slug(): PostSlug {
    return this.props.slug;
  }

  get dateTimePosted(): string | Date {
    return this.props.dateTimePosted;
  }

  get comments(): Comments {
    return this.props.comments;
  }

  get points(): number {
    return this.props.points;
  }

  get link(): PostLink {
    return this.props.link;
  }

  get text(): PostText {
    return this.props.text;
  }

  get type(): PostType {
    return this.props.type;
  }

  get totalNumComments(): number {
    return this.props.totalNumComments;
  }

  updateTotalNumberComments(numComments: number): void {
    if (numComments >= 0) {
      this.props.totalNumComments = numComments;
    }
  }

  hasComments(): boolean {
    return this.totalNumComments !== 0;
  }

  updateText(postText: PostText): UpdatePostOrLinkResult {
    if (!this.isTextPost()) {
      return left(new EditPostErrors.InvalidPostTypeOperationError());
    }

    if (this.hasComments()) {
      return left(new EditPostErrors.PostSealedError());
    }

    const guardResult = Guard.againstNullOrUndefined(postText, 'postText');

    if (guardResult.isFailure) {
      return left(Result.fail<void>(guardResult.getErrorValue()));
    }

    this.props.text = postText;
    return right(Result.ok<void>());
  }

  updateLink(postLink: PostLink): UpdatePostOrLinkResult {
    if (!this.isLinkPost()) {
      return left(new EditPostErrors.InvalidPostTypeOperationError());
    }

    if (this.hasComments()) {
      return left(new EditPostErrors.PostSealedError());
    }

    const guardResult = Guard.againstNullOrUndefined(postLink, 'postLink');

    if (guardResult.isFailure) {
      return left(Result.fail<void>(guardResult.getErrorValue()));
    }

    this.props.link = postLink;
    return right(Result.ok<void>());
  }

  updatePostScore(
    numPostUpvotes: number,
    numPostDownvotes: number,
    numPostCommentUpvotes: number,
    numPostCommentDownvotes: number
  ) {
    this.props.points =
      numPostUpvotes -
      numPostDownvotes +
      (numPostCommentUpvotes - numPostCommentDownvotes);
  }

  addVote(vote: PostVote): Result<void> {
    this.props.votes.add(vote);
    this.addDomainEvent(new PostVotesChanged(this, vote));
    return Result.ok<void>();
  }

  removeVote(vote: PostVote): Result<void> {
    this.props.votes.remove(vote);
    this.addDomainEvent(new PostVotesChanged(this, vote));
    return Result.ok<void>();
  }

  addComment(comment: Comment): Result<void> {
    this.#removeCommentIfExists(comment);
    this.props.comments.add(comment);
    this.props.totalNumComments++;
    this.addDomainEvent(new CommentPosted(this, comment));
    return Result.ok<void>();
  }

  updateComment(comment: Comment): Result<void> {
    this.#removeCommentIfExists(comment);
    this.props.comments.add(comment);
    this.addDomainEvent(new CommentVotesChanged(this, comment));
    return Result.ok<void>();
  }

  isLinkPost(): boolean {
    return this.props.type === 'link';
  }

  isTextPost(): boolean {
    return this.props.type === 'text';
  }

  getVotes(): PostVotes {
    return this.props.votes;
  }

  #removeCommentIfExists(comment: Comment): void {
    if (this.props.comments.exists(comment)) {
      this.props.comments.remove(comment);
    }
  }
}
