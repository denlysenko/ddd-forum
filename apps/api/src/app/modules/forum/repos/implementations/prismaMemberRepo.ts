import type { PrismaClient } from '@prisma/client';
import type { Member } from '../../domain/member';
import type { MemberDetails } from '../../domain/memberDetails';
import type { MemberId } from '../../domain/memberId';
import { MemberDetailsMap } from '../../mappers/memberDetailsMap';
import { MemberIdMap } from '../../mappers/memberIdMap';
import { MemberMap } from '../../mappers/memberMap';
import type { IMemberRepo } from '../memberRepo';

export class PrismaMemberRepo implements IMemberRepo {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.#prisma.member.count({
      where: {
        member_base_id: userId,
      },
    });

    return count > 0;
  }

  async getMemberByUserId(userId: string): Promise<Member> {
    const member = await this.#prisma.member.findFirst({
      where: {
        member_base_id: userId,
      },
      include: {
        baseUser: true,
      },
    });

    return MemberMap.toDomain(member);
  }

  async getMemberIdByUserId(userId: string): Promise<MemberId> {
    const member = await this.#prisma.member.findFirst({
      where: {
        member_base_id: userId,
      },
    });

    return MemberIdMap.toDomain(member);
  }

  async getMemberByUserName(username: string): Promise<Member> {
    const member = await this.#prisma.member.findFirst({
      where: {
        baseUser: {
          username,
        },
      },
      include: {
        baseUser: true,
      },
    });

    return MemberMap.toDomain(member);
  }

  async getMemberDetailsByUserName(username: string): Promise<MemberDetails> {
    const member = await this.#prisma.member.findFirst({
      where: {
        baseUser: {
          username,
        },
      },
      include: {
        baseUser: true,
      },
    });

    return MemberDetailsMap.toDomain(member);
  }

  async getMemberDetailsByPostLinkOrSlug(
    linkOrSlug: string
  ): Promise<MemberDetails> {
    const member = await this.#prisma.member.findFirst({
      where: {
        posts: {
          some: {
            OR: [
              {
                slug: linkOrSlug,
              },
              {
                link: linkOrSlug,
              },
            ],
          },
        },
      },
      include: {
        baseUser: true,
      },
    });

    return MemberDetailsMap.toDomain(member);
  }

  async save(member: Member): Promise<void> {
    const exists = await this.exists(member.userId.id.toString());

    if (!exists) {
      const rawMember = await MemberMap.toPersistence(member);
      await this.#prisma.member.create({
        data: rawMember,
      });
    }
  }
}
