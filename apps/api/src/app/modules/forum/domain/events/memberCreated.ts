import type { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import type { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import type { Member } from '../member';

export class MemberCreated implements IDomainEvent {
  dateTimeOccurred: Date;
  member: Member;

  constructor(member: Member) {
    this.dateTimeOccurred = new Date();
    this.member = member;
  }

  getAggregateId(): UniqueEntityID {
    return this.member.id;
  }
}
