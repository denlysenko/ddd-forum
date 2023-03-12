import { commentRepo, commentVotesRepo } from '../../../repos';
import { UpdateCommentStats } from './UpdateCommentStats';

const updateCommentStats = new UpdateCommentStats(
  commentRepo,
  commentVotesRepo
);

export { updateCommentStats };
