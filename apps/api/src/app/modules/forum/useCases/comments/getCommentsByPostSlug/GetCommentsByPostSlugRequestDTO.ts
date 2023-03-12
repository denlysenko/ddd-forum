export interface GetCommentsByPostSlugRequestDTO {
  readonly slug: string;
  readonly offset?: number;
  readonly userId?: string;
}
