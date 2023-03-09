import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';
import { TextUtils } from '../../../shared/utils/TextUtils';

export interface UserEmailProps {
  readonly value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  static #isValidEmail(email: string) {
    return TextUtils.validateEmailAddress(email);
  }

  static #format(email: string): string {
    return email.trim().toLowerCase();
  }

  static create(email: string): Result<UserEmail> {
    if (!this.#isValidEmail(email)) {
      return Result.fail<UserEmail>('Email address not valid');
    }

    return Result.ok<UserEmail>(new UserEmail({ value: this.#format(email) }));
  }
}
