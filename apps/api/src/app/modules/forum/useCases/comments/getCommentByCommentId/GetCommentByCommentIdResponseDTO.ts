import type { CommentDTO } from '../../../dtos/commentDTO';

export interface GetCommentByCommentIdResponseDTO {
  readonly comment: CommentDTO;
}
