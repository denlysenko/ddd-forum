import type { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import type { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import type { User } from '../user';

export class UserLoggedIn implements IDomainEvent {
  dateTimeOccurred: Date;
  user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
