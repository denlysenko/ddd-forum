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
import type { DownvotePostDTO } from './DownvotePostDTO';
import { MemberNotFoundError, PostNotFoundError } from './DownvotePostErrors';
import type { DownvotePostResponse } from './DownvotePostResponse';

export class DownvotePost
  implements UseCase<DownvotePostDTO, Promise<DownvotePostResponse>>
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

  async execute(req: DownvotePostDTO): Promise<DownvotePostResponse> {
    let member: Member;
    let post: Post;
    let existingVotesOnPostByMember: PostVote[];

    try {
      member = await this.#memberRepo.getMemberByUserId(req.userId);

      if (!member) {
        return left(new MemberNotFoundError());
      }

      post = await this.#postRepo.getPostBySlug(req.slug);

      if (!post) {
        return left(new PostNotFoundError(req.slug));
      }

      existingVotesOnPostByMember =
        await this.#postVotesRepo.getVotesForPostByMemberId(
          post.postId,
          member.memberId
        );

      const downvotePostResult = this.#postService.downvotePost(
        post,
        member,
        existingVotesOnPostByMember
      );

      if (downvotePostResult.isLeft()) {
        return left(downvotePostResult.value);
      }

      await this.#postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
