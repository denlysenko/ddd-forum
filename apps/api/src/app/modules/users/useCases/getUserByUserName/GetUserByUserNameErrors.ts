import { Result } from '../../../../shared/core/Result';
import type { UseCaseError } from '../../../../shared/core/UseCaseError';

export class UserNotFoundError extends Result<UseCaseError> {
  constructor(username: string) {
    super(false, {
      message: `No user with the username ${username} was found`,
    } as UseCaseError);
  }
}
