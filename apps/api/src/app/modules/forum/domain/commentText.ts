import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface CommentTextProps {
  value: string;
}

export class CommentText extends ValueObject<CommentTextProps> {
  static minLength = 2;
  static maxLength = 10000;

  static create(props: CommentTextProps): Result<CommentText> {
    const nullGuardResult = Guard.againstNullOrUndefined(
      props.value,
      'commentText'
    );

    if (nullGuardResult.isFailure) {
      return Result.fail<CommentText>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstAtLeast(
      this.minLength,
      props.value,
      'commentText'
    );
    const maxGuardResult = Guard.againstAtMost(
      this.maxLength,
      props.value,
      'commentText'
    );

    if (minGuardResult.isFailure) {
      return Result.fail<CommentText>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<CommentText>(maxGuardResult.getErrorValue());
    }

    return Result.ok<CommentText>(new CommentText(props));
  }

  private constructor(props: CommentTextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}
