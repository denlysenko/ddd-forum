import { commentRepo, memberRepo } from '../../../repos';
import { GetCommentByCommentId } from './GetCommentByCommentId';
import { GetCommentByCommentIdController } from './GetCommentByCommentIdController';

const getCommentByCommentId = new GetCommentByCommentId(
  commentRepo,
  memberRepo
);

const getCommentByCommentIdController = new GetCommentByCommentIdController(
  getCommentByCommentId
);

export { getCommentByCommentId, getCommentByCommentIdController };
