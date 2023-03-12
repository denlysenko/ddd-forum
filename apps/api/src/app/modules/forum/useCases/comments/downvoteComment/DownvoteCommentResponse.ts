import type { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Either, Result } from '../../../../../shared/core/Result';
import type {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvoteCommentErrors';

export type DownvoteCommentResponse = Either<
  | CommentNotFoundError
  | MemberNotFoundError
  | PostNotFoundError
  | UnexpectedError,
  Result<void>
>;
