import type { CommentDTO } from '../../../dtos/commentDTO';

export interface GetCommentsByPostSlugResponseDTO {
  readonly comments: CommentDTO[];
}
