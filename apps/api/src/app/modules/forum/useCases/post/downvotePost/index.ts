import { postService } from '../../../domain/services';
import { memberRepo, postRepo, postVotesRepo } from '../../../repos';
import { DownvotePost } from './DownvotePost';
import { DownvotePostController } from './DownvotePostController';

const downvotePost = new DownvotePost(
  memberRepo,
  postRepo,
  postVotesRepo,
  postService
);

const downvotePostController = new DownvotePostController(downvotePost);

export { downvotePost, downvotePostController };
