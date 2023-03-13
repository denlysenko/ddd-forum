import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function downvotePost(postSlug: string) {
  return async (dispatch: any) => {
    dispatch(actionCreators.downvotingPost());

    const result = await postService.downvotePost(postSlug);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.downvotingPostFailure(error));
    } else {
      dispatch(actionCreators.downvotingPostSuccess(postSlug));
    }
  };
}

export { downvotePost };
