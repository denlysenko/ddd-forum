import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface PostTextProps {
  value: string;
}

export class PostText extends ValueObject<PostTextProps> {
  static minLength = 2;
  static maxLength = 10000;

  static create(props: PostTextProps): Result<PostText> {
    const nullGuardResult = Guard.againstNullOrUndefined(
      props.value,
      'postText'
    );

    if (nullGuardResult.isFailure) {
      return Result.fail<PostText>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstAtLeast(this.minLength, props.value);
    const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

    if (minGuardResult.isFailure) {
      return Result.fail<PostText>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<PostText>(maxGuardResult.getErrorValue());
    }

    return Result.ok<PostText>(new PostText(props));
  }

  private constructor(props: PostTextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}
