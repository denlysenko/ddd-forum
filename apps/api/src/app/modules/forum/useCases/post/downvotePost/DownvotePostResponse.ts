import type { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Either, Result } from '../../../../../shared/core/Result';
import type {
  AlreadyDownvotedError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvotePostErrors';

export type DownvotePostResponse = Either<
  | MemberNotFoundError
  | AlreadyDownvotedError
  | PostNotFoundError
  | UnexpectedError
  | Result<any>,
  Result<void>
>;
