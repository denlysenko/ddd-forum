import { WatchedList } from '../../../shared/domain/WatchedList';
import type { CommentVote } from './commentVote';

export class CommentVotes extends WatchedList<CommentVote> {
  static create(initialVotes?: CommentVote[]): CommentVotes {
    return new CommentVotes(initialVotes ? initialVotes : []);
  }

  private constructor(initialVotes: CommentVote[]) {
    super(initialVotes);
  }

  compareItems(a: CommentVote, b: CommentVote): boolean {
    return a.equals(b);
  }
}
