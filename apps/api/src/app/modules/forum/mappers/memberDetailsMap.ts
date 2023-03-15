import type { Mapper } from '../../../shared/infra/Mapper';
import { UserName } from '../../users/domain/userName';
import { MemberDetails } from '../domain/memberDetails';
import type { MemberDTO } from '../dtos/memberDTO';

export class MemberDetailsMap implements Mapper<MemberDetails> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(raw: any): MemberDetails {
    const userNameOrError = UserName.create({ name: raw.baseUser.username });

    const memberDetailsOrError = MemberDetails.create({
      reputation: raw.reputation,
      username: userNameOrError.getValue(),
    });

    memberDetailsOrError.isFailure
      ? console.log(memberDetailsOrError.getErrorValue())
      : '';

    return memberDetailsOrError.isSuccess
      ? memberDetailsOrError.getValue()
      : null;
  }

  static toDTO(memberDetails: MemberDetails): MemberDTO {
    return {
      reputation: memberDetails.reputation,
      user: {
        username: memberDetails.username.value,
      },
    };
  }
}
