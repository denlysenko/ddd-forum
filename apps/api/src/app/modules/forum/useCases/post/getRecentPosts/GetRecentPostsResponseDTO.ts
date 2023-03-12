import type { PostDTO } from '../../../dtos/postDTO';

export interface GetRecentPostsResponseDTO {
  readonly posts: PostDTO[];
}
