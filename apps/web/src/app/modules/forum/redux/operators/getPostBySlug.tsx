import type { Post } from '../../models/Post';
import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function getPostBySlug(slug: string) {
  return async (dispatch: any) => {
    dispatch(actionCreators.gettingPostBySlug());

    const result = await postService.getPostBySlug(slug);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.gettingPostBySlugFailure(error));
    } else {
      const post: Post = result.value.getValue();
      dispatch(actionCreators.gettingPostBySlugSuccess(post));
    }
  };
}

export { getPostBySlug };
