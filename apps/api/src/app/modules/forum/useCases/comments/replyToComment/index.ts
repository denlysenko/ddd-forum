import { postService } from '../../../domain/services';
import { commentRepo, memberRepo, postRepo } from '../../../repos';
import { ReplyToComment } from './ReplyToComment';
import { ReplyToCommentController } from './ReplyToCommentController';

const replyToComment = new ReplyToComment(
  memberRepo,
  postRepo,
  commentRepo,
  postService
);

const replyToCommentController = new ReplyToCommentController(replyToComment);

export { replyToComment, replyToCommentController };
