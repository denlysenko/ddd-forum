import type { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Either, Result } from '../../../../../shared/core/Result';
import type { PostNotFoundError } from './EditPostErrors';

export type EditPostResponse = Either<
  PostNotFoundError | UnexpectedError,
  Result<void>
>;
