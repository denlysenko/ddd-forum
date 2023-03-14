import type React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as usersOperators from '../../../modules/users/redux/operators';
import type { UsersState } from '../../../modules/users/redux/states';

interface AuthenticatedRouteProps {
  users: UsersState;
  component: any;
  path: any;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  users,
  component: Component,
  ...rest
}) => {
  // Add your own authentication on the below line.
  const isLoggedIn = users.isAuthenticated;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

function mapStateToProps({ users }: { users: UsersState }) {
  return {
    users,
  };
}

function mapActionCreatorsToProps(dispatch: any) {
  return bindActionCreators(
    {
      ...usersOperators,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(AuthenticatedRoute);
