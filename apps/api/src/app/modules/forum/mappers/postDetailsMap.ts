import type { Mapper } from '../../../shared/infra/Mapper';
import { PostDetails } from '../domain/postDetails';
import { PostLink } from '../domain/postLink';
import { PostSlug } from '../domain/postSlug';
import { PostText } from '../domain/postText';
import { PostTitle } from '../domain/postTitle';
import type { PostType } from '../domain/postType';
import type { PostVote } from '../domain/postVote';
import type { PostDTO } from '../dtos/postDTO';
import { MemberDetailsMap } from './memberDetailsMap';
import { PostVoteMap } from './postVoteMap';

export class PostDetailsMap implements Mapper<PostDetails> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(raw: any): PostDetails {
    const slug = PostSlug.createFromExisting(raw.slug).getValue();
    const title = PostTitle.create({ value: raw.title }).getValue();
    const postType: PostType = raw.type;

    const memberDetails = MemberDetailsMap.toDomain(raw.member);

    const votes: PostVote[] = raw.postVotes
      ? raw.postVotes.map((v) => PostVoteMap.toDomain(v))
      : [];

    const postDetailsOrError = PostDetails.create({
      slug,
      title,
      type: raw.type,
      points: raw.points,
      numComments: raw.total_num_comments,
      dateTimePosted: raw.created_at,
      member: memberDetails,
      text:
        postType === 'text'
          ? PostText.create({ value: raw.text }).getValue()
          : null,
      link:
        postType === 'link'
          ? PostLink.create({ url: raw.link }).getValue()
          : null,
      wasUpvotedByMe: !!votes.find((v) => v.isUpvote()),
      wasDownvotedByMe: !!votes.find((v) => v.isDownvote()),
    });

    postDetailsOrError.isFailure
      ? console.log(postDetailsOrError.getErrorValue())
      : '';

    return postDetailsOrError.isSuccess ? postDetailsOrError.getValue() : null;
  }

  static toDTO(postDetails: PostDetails): PostDTO {
    return {
      slug: postDetails.slug.value,
      title: postDetails.title.value,
      createdAt: postDetails.dateTimePosted,
      memberPostedBy: MemberDetailsMap.toDTO(postDetails.member),
      numComments: postDetails.numComments,
      points: postDetails.points,
      text: postDetails.text ? postDetails.text.value : '',
      link: postDetails.link ? postDetails.link.url : '',
      type: postDetails.postType,
      wasUpvotedByMe: postDetails.wasUpvotedByMe,
      wasDownvotedByMe: postDetails.wasDownvotedByMe,
    };
  }
}
