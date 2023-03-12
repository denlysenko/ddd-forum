import { Result } from '../../../../../shared/core/Result';
import type { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class PostNotFoundError extends Result<UseCaseError> {
  constructor(slug: string) {
    super(false, {
      message: `Couldn't find a post by slug {${slug}}.`,
    } as UseCaseError);
  }
}
