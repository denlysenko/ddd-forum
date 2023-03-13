import type { UnexpectedError } from '../../../../../shared/core/AppError';
import type { Either, Result } from '../../../../../shared/core/Result';
import type { PostNotFoundError } from '../../post/upvotePost/UpvotePostErrors';
import type {
  CommentNotFoundError,
  MemberNotFoundError,
} from './UpvoteCommentErrors';

export type UpvoteCommentResponse = Either<
  | PostNotFoundError
  | CommentNotFoundError
  | MemberNotFoundError
  | UnexpectedError
  | Result<any>,
  Result<void>
>;
