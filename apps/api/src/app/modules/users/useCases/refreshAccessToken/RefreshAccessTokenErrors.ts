import { Result } from '../../../../shared/core/Result';
import type { UseCaseError } from '../../../../shared/core/UseCaseError';

export class RefreshTokenNotFound extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Refresh token doesn't exist`,
    } as UseCaseError);
  }
}

export class UserNotFoundOrDeletedError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `User not found or doesn't exist anymore.`,
    } as UseCaseError);
  }
}
