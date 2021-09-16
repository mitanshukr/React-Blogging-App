import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

class AuthRoute extends React.Component {
  render() {
    const { children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={({ location }) =>
          this.props.isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps)(AuthRoute);
