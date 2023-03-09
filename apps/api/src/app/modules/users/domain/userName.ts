import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface UserNameProps {
  readonly name: string;
}

export class UserName extends ValueObject<UserNameProps> {
  static maxLength = 15;
  static minLength = 2;

  get value(): string {
    return this.props.name;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  static create(props: UserNameProps): Result<UserName> {
    const usernameResult = Guard.againstNullOrUndefined(props.name, 'username');

    if (usernameResult.isFailure) {
      return Result.fail<UserName>(usernameResult.getErrorValue());
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);

    if (minLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.getErrorValue());
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);

    if (maxLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.getErrorValue());
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
