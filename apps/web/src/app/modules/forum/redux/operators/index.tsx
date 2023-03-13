import type { PostType } from '../../models/Post';
import { creatingReplyToComment } from '../actionCreators';
import { createReplyToComment } from './createReplyToComment';
import { createReplyToPost } from './createReplyToPost';
import { downvoteComment } from './downvoteComment';
import { downvotePost } from './downvotePost';
import { getCommentByCommentId } from './getCommentByCommentId';
import { getCommentReplies } from './getCommentReplies';
import { getComments } from './getComments';
import { getPopularPosts } from './getPopularPosts';
import { getPostBySlug } from './getPostBySlug';
import { getRecentPosts } from './getRecentPosts';
import { submitPost } from './submitPost';
import { upvoteComment } from './upvoteComment';
import { upvotePost } from './upvotePost';

export interface IForumOperations {
  submitPost: (
    title: string,
    type: PostType,
    text?: string,
    link?: string
  ) => void;
  getRecentPosts: (offset?: number) => void;
  getPostBySlug(slug: string): void;
  createReplyToPost(text: string, slug: string): void;
  getComments(slug: string, offset?: number): void;
  getPopularPosts(offset?: number): void;
  getCommentByCommentId(commentId: string): void;
  createReplyToComment(
    comment: string,
    parentCommentId: string,
    slug: string
  ): void;
  getCommentReplies(slug: string, commentId: string, offset?: number): void;
  downvotePost(postSlug: string): void;
  upvotePost(postSlug: string): void;
  upvoteComment(commentId: string): void;
  downvoteComment(commentId: string): void;
}

export {
  submitPost,
  getRecentPosts,
  getPostBySlug,
  createReplyToPost,
  getComments,
  getPopularPosts,
  getCommentByCommentId,
  creatingReplyToComment,
  getCommentReplies,
  createReplyToComment,
  downvotePost,
  upvotePost,
  upvoteComment,
  downvoteComment,
};
