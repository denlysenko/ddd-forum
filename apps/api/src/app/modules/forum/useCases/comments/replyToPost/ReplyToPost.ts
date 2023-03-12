import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import { Comment } from '../../../domain/comment';
import { CommentText } from '../../../domain/commentText';
import type { Member } from '../../../domain/member';
import type { Post } from '../../../domain/post';
import { PostSlug } from '../../../domain/postSlug';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { ReplyToPostDTO } from './ReplyToPostDTO';
import { PostNotFoundError } from './ReplyToPostErrors';

type Response = Either<
  PostNotFoundError | UnexpectedError | Result<PostSlug | Comment>,
  Result<void>
>;

export class ReplyToPost implements UseCase<ReplyToPostDTO, Promise<Response>> {
  #memberRepo: IMemberRepo;
  #postRepo: IPostRepo;

  constructor(memberRepo: IMemberRepo, postRepo: IPostRepo) {
    this.#memberRepo = memberRepo;
    this.#postRepo = postRepo;
  }

  async execute(req: ReplyToPostDTO): Promise<Response> {
    let post: Post;
    let member: Member;
    let slug: PostSlug;
    const { userId } = req;

    try {
      const slugOrError = PostSlug.createFromExisting(req.slug);

      if (slugOrError.isFailure) {
        return left(slugOrError);
      }

      slug = slugOrError.getValue();

      try {
        [post, member] = await Promise.all([
          this.#postRepo.getPostBySlug(slug.value),
          this.#memberRepo.getMemberByUserId(userId),
        ]);
      } catch (err) {
        return left(new PostNotFoundError(slug.value));
      }

      const commentTextOrError = CommentText.create({
        value: req.comment,
      });

      if (commentTextOrError.isFailure) {
        return left(commentTextOrError);
      }

      const commentOrError = Comment.create({
        memberId: member.memberId,
        text: commentTextOrError.getValue(),
        postId: post.postId,
      });

      if (commentOrError.isFailure) {
        return left(commentOrError);
      }

      const comment = commentOrError.getValue();
      post.addComment(comment);

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
