import moment from 'moment';
import type React from 'react';
import type { Comment } from '../../../../models/Comment';

type PostCommentAuthorAndTextProps = Comment;

const PostCommentAuthorAndText: React.FC<PostCommentAuthorAndTextProps> = (
  props
) => (
  <div>
    <div className="comment-meta">
      {props.member.username} |{' '}
      <a href={`/comment/${props.commentId}`}>
        {moment(props.createdAt).fromNow()}
      </a>
    </div>
    <p className="comment-text">
      <b dangerouslySetInnerHTML={{ __html: props.text }} />
    </p>
  </div>
);

export default PostCommentAuthorAndText;
