import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import { logoutActionHandler } from "../../store/actions";

class Logout extends Component {
  componentDidMount() {
    this.props.logoutDispatchHandler();
    this.props.history.replace({
      pathname: this.props.location.state.prevPath,
      isLogout: true,
    });
  }

  render() {
    return <></>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutDispatchHandler: () => dispatch(logoutActionHandler()),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Logout));
