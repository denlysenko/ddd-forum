import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface PostTitleProps {
  value: string;
}

export class PostTitle extends ValueObject<PostTitleProps> {
  static minLength = 2;
  static maxLength = 85;

  static create(props: PostTitleProps): Result<PostTitle> {
    const nullGuardResult = Guard.againstNullOrUndefined(
      props.value,
      'postTitle'
    );

    if (nullGuardResult.isFailure) {
      return Result.fail<PostTitle>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstAtLeast(
      this.minLength,
      props.value,
      'postTitle'
    );
    const maxGuardResult = Guard.againstAtMost(
      this.maxLength,
      props.value,
      'postTitle'
    );

    if (minGuardResult.isFailure) {
      return Result.fail<PostTitle>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<PostTitle>(maxGuardResult.getErrorValue());
    }

    return Result.ok<PostTitle>(new PostTitle(props));
  }

  private constructor(props: PostTitleProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}
