import type { MemberDTO } from './memberDTO';

export interface CommentDTO {
  readonly postSlug: string;
  readonly postTitle: string;
  readonly commentId: string;
  readonly parentCommentId?: string;
  readonly text: string;
  readonly member: MemberDTO;
  readonly createdAt: string | Date;
  readonly childComments: CommentDTO[];
  readonly points: number;
  readonly wasUpvotedByMe: boolean;
  readonly wasDownvotedByMe: boolean;
}
