import { postRepo } from '../../../repos';
import { GetRecentPosts } from './GetRecentPosts';
import { GetRecentPostsController } from './GetRecentPostsController';

const getRecentPosts = new GetRecentPosts(postRepo);
const getRecentPostsController = new GetRecentPostsController(getRecentPosts);

export { getRecentPosts, getRecentPostsController };
