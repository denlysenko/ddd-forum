import type { Post } from '../../models/Post';
import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function getRecentPosts(offset?: number) {
  return async (dispatch: any) => {
    dispatch(actionCreators.getRecentPosts());

    const result = await postService.getRecentPosts(offset);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.getRecentPostsFailure(error));
    } else {
      const posts: Post[] = result.value.getValue();
      dispatch(
        actionCreators.getRecentPostsSuccess(
          posts.sort(
            (a, b) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
        )
      );
    }
  };
}

export { getRecentPosts };
