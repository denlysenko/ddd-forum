import { postService } from '../../../domain/services';
import { memberRepo, postRepo, postVotesRepo } from '../../../repos';
import { UpvotePost } from './UpvotePost';
import { UpvotePostController } from './UpvotePostController';

const upvotePost = new UpvotePost(
  memberRepo,
  postRepo,
  postVotesRepo,
  postService
);

const upvotePostController = new UpvotePostController(upvotePost);

export { upvotePost, upvotePostController };
