import { left, Result, right } from '../../../../../shared/core/Result';
import type { UseCase } from '../../../../../shared/core/UseCase';
import { Changes, WithChanges } from '../../../../../shared/core/WithChanges';
import type { Post } from '../../../domain/post';
import { PostLink } from '../../../domain/postLink';
import { PostText } from '../../../domain/postText';
import type { IPostRepo } from '../../../repos/postRepo';
import type { EditPostDTO } from './EditPostDTO';
import { PostNotFoundError } from './EditPostErrors';
import type { EditPostResponse } from './EditPostResponse';

export class EditPost
  implements UseCase<EditPostDTO, Promise<EditPostResponse>>, WithChanges
{
  #postRepo: IPostRepo;
  changes: Changes;

  constructor(postRepo: IPostRepo) {
    this.#postRepo = postRepo;
    this.changes = new Changes();
  }

  async execute(request: EditPostDTO): Promise<EditPostResponse> {
    let post: Post;

    let postLink: PostLink;
    let postLinkOrError: Result<PostLink>;

    try {
      post = await this.#postRepo.getPostByPostId(request.postId);
    } catch (err) {
      return left(new PostNotFoundError(post.postId.id.toString()));
    }

    if (request.link) {
      postLinkOrError = PostLink.create({ url: request.link });
    }

    return right(Result.ok<void>());
  }

  #updateText(request: EditPostDTO, post: Post): void {
    let postText: PostText;
    let postTextOrError: Result<PostText>;

    if (request.text) {
      postTextOrError = PostText.create({ value: request.text });

      // postTextOrError.isSuccess ? (
      //   this.changes.addChange(
      //     post.updateText(
      //       postTextOrError.getValue()
      //     ).value
      //   )
      // ) :

      postText = postTextOrError.getValue();
    }
  }
}
