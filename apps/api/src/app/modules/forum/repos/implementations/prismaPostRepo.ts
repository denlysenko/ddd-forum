import type { PrismaClient } from '@prisma/client';
import type { Comments } from '../../domain/comments';
import type { Post } from '../../domain/post';
import type { PostDetails } from '../../domain/postDetails';
import { PostId } from '../../domain/postId';
import type { PostVotes } from '../../domain/postVotes';
import { PostDetailsMap } from '../../mappers/postDetailsMap';
import { PostMap } from '../../mappers/postMap';
import type { ICommentRepo } from '../commentRepo';
import type { IPostRepo } from '../postRepo';
import type { IPostVotesRepo } from '../postVotesRepo';

export class PrismaPostRepo implements IPostRepo {
  #prisma: PrismaClient;
  #commentRepo: ICommentRepo;
  #postVotesRepo: IPostVotesRepo;

  constructor(
    prisma: PrismaClient,
    commentRepo: ICommentRepo,
    postVotesRepo: IPostVotesRepo
  ) {
    this.#prisma = prisma;
    this.#commentRepo = commentRepo;
    this.#postVotesRepo = postVotesRepo;
  }

  async getPostDetailsBySlug(slug: string): Promise<PostDetails> {
    const post = this.#prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        member: {
          include: {
            baseUser: true,
          },
        },
      },
    });

    return PostDetailsMap.toDomain(post);
  }

  async getPostBySlug(slug: string): Promise<Post> {
    const post = this.#prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        member: {
          include: {
            baseUser: true,
          },
        },
      },
    });

    return PostMap.toDomain(post);
  }

  async getRecentPosts(offset?: number): Promise<PostDetails[]> {
    const posts = await this.#prisma.post.findMany({
      include: {
        member: {
          include: {
            baseUser: true,
          },
        },
      },
      skip: offset ?? 15,
    });

    return posts.map((post) => PostDetailsMap.toDomain(post));
  }

  async getPopularPosts(offset?: number): Promise<PostDetails[]> {
    const posts = await this.#prisma.post.findMany({
      include: {
        member: {
          include: {
            baseUser: true,
          },
        },
      },
      skip: offset ?? 15,
      orderBy: {
        points: 'desc',
      },
    });

    return posts.map((post) => PostDetailsMap.toDomain(post));
  }

  getNumberOfCommentsByPostId(postId: string | PostId): Promise<number> {
    postId = postId instanceof PostId ? postId.id.toString() : postId;

    return this.#prisma.post.count({
      where: {
        post_id: postId,
      },
    });
  }

  async getPostByPostId(postId: string | PostId): Promise<Post> {
    postId = postId instanceof PostId ? postId.id.toString() : postId;

    const post = await this.#prisma.post.findUnique({
      where: {
        post_id: postId,
      },
      include: {
        member: {
          include: {
            baseUser: true,
          },
        },
      },
    });

    return PostMap.toDomain(post);
  }

  async exists(postId: PostId): Promise<boolean> {
    const count = await this.#prisma.post.count({
      where: {
        post_id: postId.id.toString(),
      },
    });

    return count > 0;
  }

  async save(post: Post): Promise<void> {
    const exists = await this.exists(post.postId);
    const isNewPost = !exists;
    const rawPost = PostMap.toPersistence(post);

    if (isNewPost) {
      try {
        await this.#prisma.post.create({
          data: rawPost,
        });
        await this.#saveComments(post.comments);
        await this.#savePostVotes(post.getVotes());
      } catch (err) {
        await this.delete(post.postId);
        throw new Error(err.toString());
      }
    } else {
      // Save non-aggregate tables before saving the aggregate
      // so that any domain events on the aggregate get dispatched
      await this.#saveComments(post.comments);
      await this.#savePostVotes(post.getVotes());
      await this.#prisma.post.update({
        where: {
          post_id: post.postId.id.toString(),
        },
        data: rawPost,
      });
    }
  }

  async delete(postId: PostId): Promise<void> {
    await this.#prisma.post.delete({
      where: {
        post_id: postId.id.toString(),
      },
    });
  }

  #saveComments(comments: Comments) {
    return this.#commentRepo.saveBulk(comments.getItems());
  }

  #savePostVotes(postVotes: PostVotes) {
    return this.#postVotesRepo.saveBulk(postVotes);
  }
}
