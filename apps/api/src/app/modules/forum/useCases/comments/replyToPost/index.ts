import { memberRepo, postRepo } from '../../../repos';
import { ReplyToPost } from './ReplyToPost';
import { ReplyToPostController } from './ReplyToPostController';

const replyToPost = new ReplyToPost(memberRepo, postRepo);

const replyToPostController = new ReplyToPostController(replyToPost);

export { replyToPost, replyToPostController };
