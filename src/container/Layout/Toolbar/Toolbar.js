import axios from "../../../axios-instance";
import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import NavigationItems from "../../../components/Layout/NavigationItems/NavigationItems";
import PNotification from "../../../components/UI/PriorityNotification/PNotification";
import { showNotification } from "../../../store/actions";

import "./Toolbar.css";
import UserMenu from "./UserMenu/UserMenu";

class Toolbar extends React.Component {
  state = {
    dismissPNotification: false,
    isVerificationEmailSent: null,
  };

  dismissNotificationHandler = () => {
    this.setState({ dismissPNotification: true });
    clearTimeout(this.dismissTimer);
  };

  sendEmailVerificationHandler = () => {
    if (this.isEmailSending) return;
    this.isEmailSending = true;
    axios
      .get(`/user/send-email-verification/${this.props.userId}`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        this.isEmailSending = false;
        if (response.data?.message === "success") {
          this.setState({ isVerificationEmailSent: true });
          this.dismissTimer = setTimeout(() => {
            this.dismissNotificationHandler();
          }, 4000);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        this.isEmailSending = false;
        this.props.showNotification(
          "Failed to send Verification Link. Please try again!",
          "ERROR"
        );
      });
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

        {this.props.isAuthenticated &&
          !this.state.dismissPNotification &&
          (this.props.isEmailVerified ? null : (
            <div className={"pNotification"}>
              <PNotification
                dismissNotification={this.dismissNotificationHandler}
              >
                {this.state.isVerificationEmailSent ? (
                  <p className={"pNotification__emailVerifMsg"}>
                    Verification Link Sent to your Registered Email. Please
                    check your Inbox.
                  </p>
                ) : (
                  <p className={"pNotification__emailVerifMsg"}>
                    Your email is not verified. Please verify your email to get
                    full feature access.&nbsp;
                    <small
                      className={"pNotification__emailVerifLink"}
                      onClick={this.sendEmailVerificationHandler}
                      title="Send Verification Link"
                    >
                      Send Verification Link
                    </small>
                  </p>
                )}
              </PNotification>
            </div>
          ))}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    isEmailVerified: state.isEmailVerified,
    email: state.email,
    authToken: state.authToken,
    userId: state.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message, type) =>
      dispatch(showNotification(message, type)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Toolbar));
