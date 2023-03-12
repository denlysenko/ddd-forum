import type { PostType } from '../domain/postType';
import type { MemberDTO } from './memberDTO';

export interface PostDTO {
  readonly slug: string;
  readonly title: string;
  readonly createdAt: string | Date;
  readonly memberPostedBy: MemberDTO;
  readonly numComments: number;
  readonly points: number;
  readonly text: string;
  readonly link: string;
  readonly type: PostType;
  readonly wasUpvotedByMe: boolean;
  readonly wasDownvotedByMe: boolean;
}
