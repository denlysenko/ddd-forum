import type { UnexpectedError } from '../../../../shared/core/AppError';
import type { Either, Result } from '../../../../shared/core/Result';
import type {
  EmailAlreadyExistsError,
  UsernameTakenError,
} from './CreateUserErrors';

export type CreateUserResponse = Either<
  EmailAlreadyExistsError | UsernameTakenError | UnexpectedError | Result<void>,
  Result<void>
>;
