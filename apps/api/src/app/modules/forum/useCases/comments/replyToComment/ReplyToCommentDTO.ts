export interface ReplyToCommentDTO {
  readonly slug: string;
  readonly userId: string;
  readonly comment: string;
  readonly parentCommentId: string;
}
