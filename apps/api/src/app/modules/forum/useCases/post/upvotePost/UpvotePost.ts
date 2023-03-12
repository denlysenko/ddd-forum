import { UnexpectedError } from '../../../../../shared/core/AppError';
import { left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import type { Member } from '../../../domain/member';
import type { Post } from '../../../domain/post';
import type { PostVote } from '../../../domain/postVote';
import type { PostService } from '../../../domain/services/postService';
import type { IMemberRepo } from '../../../repos/memberRepo';
import type { IPostRepo } from '../../../repos/postRepo';
import type { IPostVotesRepo } from '../../../repos/postVotesRepo';
import type { UpvotePostDTO } from './UpvotePostDTO';
import { MemberNotFoundError, PostNotFoundError } from './UpvotePostErrors';
import type { UpvotePostResponse } from './UpvotePostResponse';

export class UpvotePost
  implements UseCase<UpvotePostDTO, Promise<UpvotePostResponse>>
{
  #memberRepo: IMemberRepo;
  #postRepo: IPostRepo;
  #postVotesRepo: IPostVotesRepo;
  #postService: PostService;

  constructor(
    memberRepo: IMemberRepo,
    postRepo: IPostRepo,
    postVotesRepo: IPostVotesRepo,
    postService: PostService
  ) {
    this.#memberRepo = memberRepo;
    this.#postRepo = postRepo;
    this.#postVotesRepo = postVotesRepo;
    this.#postService = postService;
  }

  async execute(req: UpvotePostDTO): Promise<UpvotePostResponse> {
    let member: Member;
    let post: Post;
    let existingVotesOnPostByMember: PostVote[];

    try {
      try {
        member = await this.#memberRepo.getMemberByUserId(req.userId);
      } catch (err) {
        return left(new MemberNotFoundError());
      }

      try {
        post = await this.#postRepo.getPostBySlug(req.slug);
      } catch (err) {
        return left(new PostNotFoundError(req.slug));
      }

      existingVotesOnPostByMember =
        await this.#postVotesRepo.getVotesForPostByMemberId(
          post.postId,
          member.memberId
        );

      const upvotePostResult = this.#postService.upvotePost(
        post,
        member,
        existingVotesOnPostByMember
      );

      if (upvotePostResult.isLeft()) {
        return left(upvotePostResult.value);
      }

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
