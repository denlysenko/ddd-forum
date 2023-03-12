import { Result } from '../../../../../shared/core/Result';
import type { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class PostNotFoundError extends Result<UseCaseError> {
  constructor(postId: string) {
    super(false, {
      message: `Couldn't find a post by postId {${postId}}.`,
    } as UseCaseError);
  }
}
