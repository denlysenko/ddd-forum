import { usersService } from '../../services';
import * as actionCreators from '../actionCreators';

function getUserProfile() {
  return async (dispatch: any, getState?: any) => {
    dispatch(actionCreators.gettingUserProfile());
    try {
      const user = await usersService.getCurrentUserProfile();
      dispatch(actionCreators.gettingUserProfileSuccess(user));
    } catch (err) {
      const message = '';
      console.log(err);
      dispatch(actionCreators.gettingUserProfileFailure(message));
    }
  };
}

export { getUserProfile };
