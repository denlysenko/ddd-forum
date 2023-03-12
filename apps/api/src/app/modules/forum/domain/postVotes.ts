import { WatchedList } from '../../../shared/domain/WatchedList';
import type { PostVote } from './postVote';

export class PostVotes extends WatchedList<PostVote> {
  static create(initialVotes?: PostVote[]): PostVotes {
    return new PostVotes(initialVotes ? initialVotes : []);
  }

  private constructor(initialVotes: PostVote[]) {
    super(initialVotes);
  }

  compareItems(a: PostVote, b: PostVote): boolean {
    return a.equals(b);
  }
}
