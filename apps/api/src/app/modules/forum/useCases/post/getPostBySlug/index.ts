import { postRepo } from '../../../repos';
import { GetPostBySlug } from './GetPostBySlug';
import { GetPostBySlugController } from './GetPostBySlugController';

const getPostBySlug = new GetPostBySlug(postRepo);
const getPostBySlugController = new GetPostBySlugController(getPostBySlug);

export { getPostBySlug, getPostBySlugController };
