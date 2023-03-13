import { authService } from '../../users/services';
import { CommentService } from './commentService';
import { PostService } from './postService';

const commentService = new CommentService(authService);

const postService = new PostService(authService);

export { postService, commentService };
