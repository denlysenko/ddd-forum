import { Result } from '../../../../shared/core/Result';
import type { UseCaseError } from '../../../../shared/core/UseCaseError';

export class UserNameDoesntExistError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Username or password incorrect.`,
    } as UseCaseError);
  }
}

export class PasswordDoesntMatchError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Username or password incorrect.`,
    } as UseCaseError);
  }
}
