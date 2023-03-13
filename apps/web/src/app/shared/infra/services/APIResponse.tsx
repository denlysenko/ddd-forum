import type { Either } from '../../core/Either';
import type { Result } from '../../core/Result';
import type { APIErrorMessage } from './APIErrorMessage';

export type APIResponse<T> = Either<APIErrorMessage, Result<T>>;
