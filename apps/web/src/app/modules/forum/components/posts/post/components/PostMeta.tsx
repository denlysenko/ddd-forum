import moment from 'moment';
import type React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../../../models/Post';
import '../styles/PostMeta.scss';

interface PostMetaProps extends Post {
  includeLink?: boolean;
}

const PostMeta: React.FC<PostMetaProps> = (props) => (
  <div className="post-row-content">
    {props.includeLink === false ? (
      ''
    ) : (
      <Link to={`/discuss/${props.slug}`} className="title">
        "{props.title}" {props.link ? <span className="link">[link]</span> : ''}
      </Link>
    )}
    <div className="post-row-meta">
      {moment(props.createdAt).fromNow()} | {`by `}{' '}
      <Link to={`/member/${props.postAuthor}`}>{props.postAuthor}</Link> |{' '}
      {`${props.numComments} comments`}
    </div>
  </div>
);

export default PostMeta;
