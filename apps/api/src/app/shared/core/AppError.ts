/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from './Result';
import type { UseCaseError } from './UseCaseError';

export class UnexpectedError extends Result<UseCaseError> {
  constructor(err: any) {
    super(false, {
      message: `An unexpected error occurred.`,
      error: err,
    } as UseCaseError);
  }

  public static create(err: any): UnexpectedError {
    return new UnexpectedError(err);
  }
}
