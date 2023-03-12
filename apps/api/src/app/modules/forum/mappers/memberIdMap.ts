import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import type { Mapper } from '../../../shared/infra/Mapper';
import { MemberId } from '../domain/memberId';

export class MemberIdMap implements Mapper<MemberId> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(rawMember: any): MemberId {
    const memberIdOrError = MemberId.create(
      new UniqueEntityID(rawMember.member_id)
    );
    return memberIdOrError.isSuccess ? memberIdOrError.getValue() : null;
  }
}
