import { WatchedList } from '../../../shared/domain/WatchedList';
import type { Comment } from './comment';

export class Comments extends WatchedList<Comment> {
  static create(comments?: Comment[]): Comments {
    return new Comments(comments ? comments : []);
  }

  private constructor(initialVotes: Comment[]) {
    super(initialVotes);
  }

  compareItems(a: Comment, b: Comment): boolean {
    return a.equals(b);
  }
}
