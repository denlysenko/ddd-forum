import type { Post } from '../../models/Post';
import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function getPopularPosts(offset?: number) {
  return async (dispatch: any) => {
    dispatch(actionCreators.getPopularPosts());

    const result = await postService.getPopularPosts(offset);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.getPopularPostsFailure(error));
    } else {
      const posts: Post[] = result.value.getValue();
      dispatch(actionCreators.getPopularPostsSuccess(posts));
    }
  };
}

export { getPopularPosts };
