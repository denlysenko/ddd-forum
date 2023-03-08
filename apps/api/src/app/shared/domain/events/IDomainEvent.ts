import type { UniqueEntityID } from '../UniqueEntityID';

export interface IDomainEvent {
  readonly dateTimeOccurred: Date;
  getAggregateId(): UniqueEntityID;
}
