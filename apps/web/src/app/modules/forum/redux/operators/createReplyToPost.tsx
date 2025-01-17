import { commentService } from '../../services';
import * as actionCreators from '../actionCreators';

function createReplyToPost(text: string, slug: string) {
  return async (dispatch: any) => {
    dispatch(actionCreators.creatingReplyToPost());

    const result = await commentService.createReplyToPost(text, slug);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.creatingReplyToPostFailure(error));
    } else {
      dispatch(actionCreators.creatingReplyToPostSuccess());
    }
  };
}

export { createReplyToPost };
