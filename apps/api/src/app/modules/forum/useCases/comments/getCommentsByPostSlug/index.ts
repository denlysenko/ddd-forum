import { commentRepo, memberRepo } from '../../../repos';
import { GetCommentsByPostSlug } from './GetCommentsByPostSlug';
import { GetCommentsByPostSlugController } from './GetCommentsByPostSlugController';

const getCommentsByPostSlug = new GetCommentsByPostSlug(
  commentRepo,
  memberRepo
);

const getCommentsByPostSlugController = new GetCommentsByPostSlugController(
  getCommentsByPostSlug
);

export { getCommentsByPostSlug, getCommentsByPostSlugController };
