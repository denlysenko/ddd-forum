import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Member } from '../../../domain/member';
import { Post, PostProps } from '../../../domain/post';
import { PostLink } from '../../../domain/postLink';
import { PostSlug } from '../../../domain/postSlug';
import { PostText } from '../../../domain/postText';
import { PostTitle } from '../../../domain/postTitle';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { CreatePostDTO } from './CreatePostDTO';
import { MemberDoesntExistError } from './CreatePostErrors';

type Response = Either<
  | MemberDoesntExistError
  | UnexpectedError
  | Result<PostTitle | PostLink | Post>,
  Result<void>
>;

export class CreatePost implements UseCase<CreatePostDTO, Promise<Response>> {
  #postRepo: IPostRepo;
  #memberRepo: IMemberRepo;

  constructor(postRepo: IPostRepo, memberRepo: IMemberRepo) {
    this.#postRepo = postRepo;
    this.#memberRepo = memberRepo;
  }

  async execute(request: CreatePostDTO): Promise<Response> {
    let member: Member;
    let title: PostTitle;
    let text: PostText;
    let link: PostLink;
    let slug: PostSlug;
    let post: Post;

    const { userId } = request;

    try {
      try {
        member = await this.#memberRepo.getMemberByUserId(userId);
      } catch (err) {
        return left(new MemberDoesntExistError());
      }

      const titleOrError = PostTitle.create({ value: request.title });

      if (titleOrError.isFailure) {
        return left(titleOrError);
      }

      if (request.postType === 'text') {
        const textOrError = PostText.create({ value: request.text });

        if (textOrError.isFailure) {
          return left(textOrError);
        }

        text = textOrError.getValue();
      } else {
        const linkOrError = PostLink.create({ url: request.link });

        if (linkOrError.isFailure) {
          return left(linkOrError);
        }

        link = linkOrError.getValue();
      }

      title = titleOrError.getValue();

      const slugOrError = PostSlug.create(title);

      if (slugOrError.isFailure) {
        return left(slugOrError);
      }

      slug = slugOrError.getValue();

      const postProps: PostProps = {
        title,
        slug,
        type: request.postType,
        memberId: member.memberId,
        text,
        link,
      };

      const postOrError = Post.create(postProps);

      if (postOrError.isFailure) {
        return left(postOrError);
      }

      post = postOrError.getValue();

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
