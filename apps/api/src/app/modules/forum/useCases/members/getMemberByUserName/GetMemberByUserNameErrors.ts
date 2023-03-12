import { Result } from '../../../../../shared/core/Result';
import type { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class MemberNotFoundError extends Result<UseCaseError> {
  constructor(username: string) {
    super(false, {
      message: `Couldn't find a member with the username ${username}`,
    } as UseCaseError);
  }
}
