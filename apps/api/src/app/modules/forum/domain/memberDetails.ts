import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';
import type { UserName } from '../../users/domain/userName';

interface MemberDetailsProps {
  username: UserName;
  reputation: number;
  isAdminUser?: boolean;
  isDeleted?: boolean;
}

/**
 * @desc Read model for member
 */

export class MemberDetails extends ValueObject<MemberDetailsProps> {
  public static create(props: MemberDetailsProps): Result<MemberDetails> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: 'username' },
      { argument: props.reputation, argumentName: 'reputation' },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<MemberDetails>(guardResult.getErrorValue());
    }

    return Result.ok<MemberDetails>(
      new MemberDetails({
        ...props,
        isAdminUser: props.isAdminUser ? props.isAdminUser : false,
        isDeleted: props.isDeleted ? props.isDeleted : false,
      })
    );
  }

  private constructor(props: MemberDetailsProps) {
    super(props);
  }

  get username(): UserName {
    return this.props.username;
  }

  get reputation(): number {
    return this.props.reputation;
  }

  get isAdminUser(): boolean {
    return this.props.isAdminUser;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }
}
