import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';
import { TextUtils } from '../../../shared/utils/TextUtils';

interface PostLinkProps {
  url: string;
}

export class PostLink extends ValueObject<PostLinkProps> {
  static create(props: PostLinkProps): Result<PostLink> {
    const nullGuard = Guard.againstNullOrUndefined(props.url, 'url');

    if (nullGuard.isFailure) {
      return Result.fail<PostLink>(nullGuard.getErrorValue());
    }

    if (!TextUtils.validateWebURL(props.url)) {
      return Result.fail<PostLink>(`Url {${props.url}} is not valid.`);
    }

    return Result.ok<PostLink>(new PostLink(props));
  }

  private constructor(props: PostLinkProps) {
    super(props);
  }

  get url(): string {
    return this.props.url;
  }
}
