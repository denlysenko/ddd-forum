import { postService } from '../../../domain/services';
import {
  commentRepo,
  commentVotesRepo,
  memberRepo,
  postRepo,
} from '../../../repos';
import { DownvoteComment } from './DownvoteComment';
import { DownvoteCommentController } from './DownvoteCommentController';

const downvoteComment = new DownvoteComment(
  postRepo,
  memberRepo,
  commentRepo,
  commentVotesRepo,
  postService
);

const downvoteCommentController = new DownvoteCommentController(
  downvoteComment
);

export { downvoteComment, downvoteCommentController };
