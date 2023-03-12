import type { Post } from '../domain/post';
import type { PostDetails } from '../domain/postDetails';
import type { PostId } from '../domain/postId';

export interface IPostRepo {
  getPostDetailsBySlug(slug: string): Promise<PostDetails>;
  getPostBySlug(slug: string): Promise<Post>;
  getRecentPosts(offset?: number): Promise<PostDetails[]>;
  getPopularPosts(offset?: number): Promise<PostDetails[]>;
  getNumberOfCommentsByPostId(postId: PostId | string): Promise<number>;
  getPostByPostId(postId: PostId | string): Promise<Post>;
  exists(postId: PostId): Promise<boolean>;
  save(post: Post): Promise<void>;
  delete(postId: PostId): Promise<void>;
}
