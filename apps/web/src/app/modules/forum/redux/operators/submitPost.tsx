import type { PostType } from '../../models/Post';
import { postService } from '../../services';
import * as actionCreators from '../actionCreators';

function submitPost(
  title: string,
  type: PostType,
  text?: string,
  link?: string
) {
  return async (dispatch: any) => {
    dispatch(actionCreators.submittingPost());

    const result = await postService.createPost(title, type, text, link);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.submittingPostFailure(error));
    } else {
      dispatch(actionCreators.submittingPostSuccess());
    }
  };
}

export { submitPost };
