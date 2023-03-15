/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import type { Mapper } from '../../../shared/infra/Mapper';
import { UserId } from '../../users/domain/userId';
import { UserName } from '../../users/domain/userName';
import { Member } from '../domain/member';

export class MemberMap implements Mapper<Member> {
  static toDomain(raw: any): Member {
    const userNameOrError = UserName.create({ name: raw.baseUser.username });
    const userIdOrError = UserId.create(
      new UniqueEntityID(raw.baseUser.base_user_id)
    );

    const memberOrError = Member.create(
      {
        username: userNameOrError.getValue(),
        reputation: raw.reputation,
        userId: userIdOrError.getValue(),
      },
      new UniqueEntityID(raw.member_id)
    );

    memberOrError.isFailure ? console.log(memberOrError.getErrorValue()) : '';

    return memberOrError.isSuccess ? memberOrError.getValue() : null;
  }

  static toPersistence(member: Member): any {
    return {
      member_id: member.memberId.id.toString(),
      member_base_id: member.userId.id.toString(),
      reputation: member.reputation,
    };
  }
}
