import { usersService } from '../../services';
import * as actionCreators from '../actionCreators';

function logout() {
  return async (dispatch: any, getState?: any) => {
    dispatch(actionCreators.loggingOut());

    const result = await usersService.logout();

    if (result.isLeft()) {
      dispatch(actionCreators.loggingOutFailure(result.value));
    } else {
      dispatch(actionCreators.loggingOutSuccess());
    }
  };
}

export { logout };
