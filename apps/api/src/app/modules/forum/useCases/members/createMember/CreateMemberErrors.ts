import { Result } from '../../../../../shared/core/Result';
import type { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class UserDoesntExistError extends Result<UseCaseError> {
  constructor(baseUserId: string) {
    super(false, {
      message: `A user for user id ${baseUserId} doesn't exist or was deleted.`,
    } as UseCaseError);
  }
}

export class MemberAlreadyExistsError extends Result<UseCaseError> {
  constructor(baseUserId: string) {
    super(false, {
      message: `Member for ${baseUserId} already exists.`,
    } as UseCaseError);
  }
}
