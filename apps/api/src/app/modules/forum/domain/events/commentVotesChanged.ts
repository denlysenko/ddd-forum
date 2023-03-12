import type { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import type { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import type { Comment } from '../comment';
import type { Post } from '../post';

export class CommentVotesChanged implements IDomainEvent {
  dateTimeOccurred: Date;
  post: Post;
  comment: Comment;

  constructor(post: Post, comment: Comment) {
    this.dateTimeOccurred = new Date();
    this.post = post;
    this.comment = comment;
  }

  getAggregateId(): UniqueEntityID {
    return this.post.id;
  }
}
