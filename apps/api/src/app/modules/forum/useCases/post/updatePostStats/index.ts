import { commentVotesRepo, postRepo, postVotesRepo } from '../../../repos';
import { UpdatePostStats } from './UpdatePostStats';

const updatePostStats = new UpdatePostStats(
  postRepo,
  postVotesRepo,
  commentVotesRepo
);

export { updatePostStats };
