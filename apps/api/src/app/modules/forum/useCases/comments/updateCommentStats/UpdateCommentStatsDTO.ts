import type { CommentId } from '../../../domain/commentId';

export interface UpdateCommentStatsDTO {
  readonly commentId: CommentId;
}
