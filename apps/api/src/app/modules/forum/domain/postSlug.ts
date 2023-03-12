import slug from 'slug';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';
import { TextUtils } from '../../../shared/utils/TextUtils';
import type { PostTitle } from './postTitle';

slug.defaults.mode = 'pretty';
slug.defaults.modes['pretty'] = {
  replacement: '-', // replace spaces with replacement
  symbols: false, // replace unicode symbols or not
  lower: true, // result in lower case
  charmap: slug.charmap, // replace special characters
  multicharmap: slug.multicharmap, // replace multi-characters
};

export interface PostSlugProps {
  value: string;
}

export class PostSlug extends ValueObject<PostSlugProps> {
  static create(postTitle: PostTitle): Result<PostSlug> {
    let returnSlug = '';

    // Run the slug algorithm here to create a slug
    // Strip all non alphabetic characters such as . / ; ,
    returnSlug = postTitle.value.replace(/[\W_]+/g, ' ');
    returnSlug =
      TextUtils.createRandomNumericString(7) + '-' + slug(postTitle.value);

    return Result.ok<PostSlug>(new PostSlug({ value: returnSlug }));
  }

  static createFromExisting(slugName: string) {
    if (!!slugName === true) {
      return Result.ok<PostSlug>(new PostSlug({ value: slugName }));
    }

    return Result.fail<PostSlug>('No slug passed in');
  }

  private constructor(props: PostSlugProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}
