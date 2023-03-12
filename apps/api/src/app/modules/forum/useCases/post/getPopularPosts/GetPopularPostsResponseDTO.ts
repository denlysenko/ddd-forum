import type { PostDTO } from '../../../dtos/postDTO';

export interface GetPopularPostsResponseDTO {
  readonly posts: PostDTO[];
}
