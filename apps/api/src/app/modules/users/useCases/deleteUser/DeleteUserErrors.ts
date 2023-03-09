import { Result } from '../../../../shared/core/Result';
import type { UseCaseError } from '../../../../shared/core/UseCaseError';

export class UserNotFoundError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `User not found`,
    } as UseCaseError);
  }
}
