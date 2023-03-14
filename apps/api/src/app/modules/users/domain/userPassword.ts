import bcrypt from 'bcrypt';
import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

export interface IUserPasswordProps {
  readonly value: string;
  readonly hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  static minLength = 6;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  static #isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.#bcryptCompare(plainTextPassword, hashed);
    }

    return this.props.value === plainTextPassword;
  }

  #bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  #hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }

  async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    }

    return await this.#hashPassword(this.props.value);
  }

  static create(props: IUserPasswordProps): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(props.value, 'password');

    if (propsResult.isFailure) {
      return Result.fail<UserPassword>(propsResult.getErrorValue());
    }

    if (!props.hashed) {
      if (!this.#isAppropriateLength(props.value)) {
        return Result.fail<UserPassword>(
          "Password doesn't meet criteria [8 chars min]."
        );
      }
    }

    return Result.ok<UserPassword>(
      new UserPassword({
        value: props.value,
        hashed: !!props.hashed === true,
      })
    );
  }
}
