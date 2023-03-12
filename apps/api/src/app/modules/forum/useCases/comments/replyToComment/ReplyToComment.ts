import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Comment } from '../../../domain/comment';
import { CommentText } from '../../../domain/commentText';
import type { Member } from '../../../domain/member';
import type { Post } from '../../../domain/post';
import { PostSlug } from '../../../domain/postSlug';
import type { PostService } from '../../../domain/services/postService';
import type { ICommentRepo } from '../../../repos/commentRepo';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { ReplyToCommentDTO } from './ReplyToCommentDTO';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './ReplyToCommentErrors';

type Response = Either<
  | CommentNotFoundError
  | PostNotFoundError
  | MemberNotFoundError
  | UnexpectedError
  | Result<PostSlug>
  | Result<Comment>,
  Result<void>
>;

export class ReplyToComment
  implements UseCase<ReplyToCommentDTO, Promise<Response>>
{
  #memberRepo: IMemberRepo;
  #postRepo: IPostRepo;
  #commentRepo: ICommentRepo;
  #postService: PostService;

  constructor(
    memberRepo: IMemberRepo,
    postRepo: IPostRepo,
    commentRepo: ICommentRepo,
    postService: PostService
  ) {
    this.#memberRepo = memberRepo;
    this.#postRepo = postRepo;
    this.#commentRepo = commentRepo;
    this.#postService = postService;
  }

  async execute(req: ReplyToCommentDTO): Promise<Response> {
    let post: Post;
    let member: Member;
    let slug: PostSlug;
    let parentComment: Comment;
    const { userId, parentCommentId } = req;

    try {
      const slugOrError = PostSlug.createFromExisting(req.slug);

      if (slugOrError.isFailure) {
        return left(slugOrError);
      }

      slug = slugOrError.getValue();

      const asyncResults = await Promise.all([
        this.#getPost(slug),
        this.#getMember(userId),
        this.#getParentComment(parentCommentId),
      ]);

      for (const result of asyncResults) {
        if (result.isLeft()) {
          return left(result.value);
        }
      }

      const [postResult, memberResult, parentCommentResult] = asyncResults;

      post = (postResult.value as Result<Post>).getValue();
      member = (memberResult.value as Result<Member>).getValue();
      parentComment = (parentCommentResult.value as Result<Comment>).getValue();

      const commentTextOrError = CommentText.create({ value: req.comment });

      if (commentTextOrError.isFailure) {
        return left(commentTextOrError);
      }

      const commentText: CommentText = commentTextOrError.getValue();

      const replyToCommentResult: Either<
        Result<Comment>,
        Result<void>
      > = this.#postService.replyToComment(
        post,
        member,
        parentComment,
        commentText
      );

      if (replyToCommentResult.isLeft()) {
        return left(replyToCommentResult.value);
      }

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }

  async #getPost(
    slug: PostSlug
  ): Promise<Either<PostNotFoundError, Result<Post>>> {
    try {
      const post = await this.#postRepo.getPostBySlug(slug.value);
      return right(Result.ok<Post>(post));
    } catch (err) {
      return left(new PostNotFoundError(slug.value));
    }
  }

  async #getMember(
    userId: string
  ): Promise<Either<MemberNotFoundError, Result<Member>>> {
    try {
      const member = await this.#memberRepo.getMemberByUserId(userId);
      return right(Result.ok<Member>(member));
    } catch (err) {
      return left(new MemberNotFoundError(userId));
    }
  }

  async #getParentComment(
    commentId: string
  ): Promise<Either<CommentNotFoundError, Result<Comment>>> {
    try {
      const comment = await this.#commentRepo.getCommentByCommentId(commentId);
      return right(Result.ok<Comment>(comment));
    } catch (err) {
      return left(new CommentNotFoundError(commentId));
    }
  }
}
