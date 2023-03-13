import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import forum from '../../../modules/forum/redux/reducers';
import users from '../../../modules/users/redux/reducers';

const reducers = {
  users,
  forum,
};

export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({
      ...reducers,
    }),
    initialState,
    compose(
      applyMiddleware(thunk),
      (window as any).devToolsExtension
        ? (window as any).devToolsExtension()
        : (f: any) => f
    )
  );
}
