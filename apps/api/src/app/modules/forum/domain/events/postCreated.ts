import type { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import type { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import type { Post } from '../post';

export class PostCreated implements IDomainEvent {
  dateTimeOccurred: Date;
  post: Post;

  constructor(post: Post) {
    this.dateTimeOccurred = new Date();
    this.post = post;
  }

  getAggregateId(): UniqueEntityID {
    return this.post.id;
  }
}
