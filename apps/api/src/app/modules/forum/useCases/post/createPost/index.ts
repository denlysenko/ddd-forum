import { memberRepo, postRepo } from '../../../repos';
import { CreatePost } from './CreatePost';
import { CreatePostController } from './CreatePostController';

const createPost = new CreatePost(postRepo, memberRepo);
const createPostController = new CreatePostController(createPost);

export { createPost, createPostController };
