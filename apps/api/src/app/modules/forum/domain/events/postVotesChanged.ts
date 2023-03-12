import type { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import type { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import type { Post } from '../post';
import type { PostVote } from '../postVote';

export class PostVotesChanged implements IDomainEvent {
  dateTimeOccurred: Date;
  post: Post;
  vote: PostVote;

  constructor(post: Post, vote: PostVote) {
    this.dateTimeOccurred = new Date();
    this.post = post;
    this.vote = vote;
  }

  getAggregateId(): UniqueEntityID {
    return this.post.id;
  }
}
