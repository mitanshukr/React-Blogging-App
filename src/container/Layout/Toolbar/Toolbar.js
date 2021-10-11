import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import NavigationItems from "../../../components/Layout/NavigationItems/NavigationItems";
import PNotification from "../../../components/UI/PriorityNotification/PNotification";

import "./Toolbar.css";
import UserMenu from "./UserMenu/UserMenu";

class Toolbar extends React.Component {
  state = {
    dismissPNotification: false,
  };
  render() {
    return (
      <>
        <header className="Header">
          <div className="logo">
            <NavLink to="/" exact>
              Immune Ink
            </NavLink>
          </div>
          <nav>
            <NavigationItems
              isAuthenticated={this.props.isAuthenticated}
              prevPath={this.props.history?.location?.pathname}
            >
              {this.props.isAuthenticated ? (
                <UserMenu prevPath={this.props.history?.location?.pathname} />
              ) : null}
            </NavigationItems>
            {/* togglerBtn */}
          </nav>
        </header>
        {!this.props.isAuthenticated &&
          !this.state.dismissPNotification &&
          (!this.props.isEmailVerified ? (
            <div className={"pNotification"}>
              <PNotification
                dismissNotification={() => {
                  this.setState({ dismissPNotification: true });
                }}
              >
                <p style={{ margin: 0, fontStyle: "italic" }}>
                  Your email is not verified. Please verify your email to create
                  Public Posts.{" "}
                  <small
                    onClick={() => {
                      console.log("hello");
                    }}
                    style={{
                      fontStyle: "normal",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Send Verification Link
                  </small>
                </p>
              </PNotification>
            </div>
          ) : null)}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    isEmailVerified: state.isEmailVerified,
  };
};

export default connect(mapStateToProps)(withRouter(Toolbar));
