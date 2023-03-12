import type { PostType } from '../../../domain/postType';

export interface CreatePostDTO {
  readonly userId: string;
  readonly title: string;
  readonly text: string;
  readonly link: string;
  readonly postType: PostType;
}
