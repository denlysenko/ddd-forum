import type { Member } from '../domain/member';
import type { MemberDetails } from '../domain/memberDetails';
import type { MemberId } from '../domain/memberId';

export interface IMemberRepo {
  exists(userId: string): Promise<boolean>;
  getMemberByUserId(userId: string): Promise<Member>;
  getMemberIdByUserId(userId: string): Promise<MemberId>;
  getMemberByUserName(username: string): Promise<Member>;
  getMemberDetailsByUserName(username: string): Promise<MemberDetails>;
  getMemberDetailsByPostLinkOrSlug(slug: string): Promise<MemberDetails>;
  save(member: Member): Promise<void>;
}
