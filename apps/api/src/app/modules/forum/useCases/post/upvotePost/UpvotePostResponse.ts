import type { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Either, Result } from '../../../../../shared/core/Result';
import type {
  AlreadyUpvotedError,
  MemberNotFoundError,
  PostNotFoundError,
} from './UpvotePostErrors';

export type UpvotePostResponse = Either<
  | MemberNotFoundError
  | AlreadyUpvotedError
  | PostNotFoundError
  | UnexpectedError
  | Result<any>,
  Result<void>
>;
