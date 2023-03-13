import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function upvotePost(postSlug: string) {
  return async (dispatch: any) => {
    dispatch(actionCreators.upvotingComment());

    const result = await postService.upvotePost(postSlug);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.upvotingPostFailure(error));
    } else {
      dispatch(actionCreators.upvotingPostSuccess(postSlug));
    }
  };
}

export { upvotePost };
