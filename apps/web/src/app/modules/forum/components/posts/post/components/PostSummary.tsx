import type React from 'react';
import { TextUtil } from '../../../../../../shared/utils/TextUtil';
import type { Post } from '../../../../models/Post';
import '../styles/PostSummary.scss';
import PostMeta from './PostMeta';

type PostProps = Post;

const PostSummary: React.FC<PostProps> = (props) => (
  <div className="post">
    <PostMeta {...props} includeLink={false} />
    {props.text ? (
      <div dangerouslySetInnerHTML={{ __html: props.text }} />
    ) : (
      <a className="link" target="_blank" href={props.link}>
        Click to visit the link at {TextUtil.getDomainNameFromUrl(props.link)}
      </a>
    )}
  </div>
);

export default PostSummary;
