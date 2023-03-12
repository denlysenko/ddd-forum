import type { Comment } from '../domain/comment';
import type { CommentDetails } from '../domain/commentDetails';
import type { CommentId } from '../domain/commentId';
import type { MemberId } from '../domain/memberId';

export interface ICommentRepo {
  exists(commentId: string): Promise<boolean>;
  getCommentDetailsByPostSlug(
    slug: string,
    memberId?: MemberId,
    offset?: number
  ): Promise<CommentDetails[]>;
  getCommentDetailsByCommentId(
    commentId: string,
    memberId?: MemberId
  ): Promise<CommentDetails>;
  getCommentByCommentId(commentId: string): Promise<Comment>;
  save(comment: Comment): Promise<void>;
  saveBulk(comments: Comment[]): Promise<void>;
  deleteComment(commentId: CommentId): Promise<void>;
}
