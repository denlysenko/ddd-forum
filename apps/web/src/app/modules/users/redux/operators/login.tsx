import { usersService } from '../../services';
import * as actionCreators from '../actionCreators';

function login(username: string, password: string) {
  return async (dispatch: any, getState?: any) => {
    dispatch(actionCreators.loggingIn());

    const result = await usersService.login(username, password);

    if (result.isLeft()) {
      const error: string = result.value;
      dispatch(actionCreators.loggingInFailure(error));
    } else {
      dispatch(actionCreators.loggingInSuccess());
    }
  };
}

export { login };
