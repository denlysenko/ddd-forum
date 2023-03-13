import type { PostType } from '../models/Post';
import type { MemberDTO } from './memberDTO';

export interface PostDTO {
  slug: string;
  title: string;
  createdAt: string | Date;
  memberPostedBy: MemberDTO;
  numComments: number;
  points: number;
  text: string;
  type: PostType;
  link: string;
  wasUpvotedByMe: boolean;
  wasDownvotedByMe: boolean;
}
