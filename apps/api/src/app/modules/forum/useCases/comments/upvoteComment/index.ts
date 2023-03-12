import { postService } from '../../../domain/services';
import {
  commentRepo,
  commentVotesRepo,
  memberRepo,
  postRepo,
} from '../../../repos';
import { UpvoteComment } from './UpvoteComment';
import { UpvoteCommentController } from './UpvoteCommentController';

const upvoteComment = new UpvoteComment(
  postRepo,
  memberRepo,
  commentRepo,
  commentVotesRepo,
  postService
);

const upvoteCommentController = new UpvoteCommentController(upvoteComment);

export { upvoteComment, upvoteCommentController };
