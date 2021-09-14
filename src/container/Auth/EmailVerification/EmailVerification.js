import React from "react";
import axios from "axios";

import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./EmailVerification.module.css";

class EmailVerification extends React.Component {
  state = {
    email: null,
    status: null,
  };

  componentDidMount() {
    axios
      .get(
        `http://localhost:8000/auth/verify-email/${this.props.match.params.userId}/${this.props.match.params.verificationToken}`
      )
      .then((response) => {
        if (response?.data?.message === "success") {
          this.setState({ status: "SUCCESS", email: response?.data?.email });
        } else if (response?.data?.message === "already_verified") {
          this.setState({
            status: "ALREADY_VERIFIED",
            email: response?.data?.email,
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ status: "ERROR" });
      });
  }

  render() {
    let verificationMessage = null;
    if (this.state.status === "SUCCESS") {
      verificationMessage = (
        <>
          <h2 className={classes.success}>Success! Email Verified.</h2>
          <p>
            Thank you for verifing your email{" "}
            <span className={classes.email}>{this.state.email}</span>.<br></br>
            You can safely close this window.
          </p>
        </>
      );
    } else if (this.state.status === "ALREADY_VERIFIED") {
      verificationMessage = (
        <>
          <h2 className={classes.success}>Email Already Verified!</h2>
          <p>
            Your email <span className={classes.email}>{this.state.email}</span>{" "}
            is already verified.<br></br>You can safely close this window.
          </p>
        </>
      );
    } else if (this.state.status === "ERROR") {
      verificationMessage = (
        <>
          <h2 className={classes.error}>Oops! Something went Wrong...</h2>
          <small>Email verification Failed!</small>
          <p>
            Looks like the URL is invalid or expired. Please make sure the url is
            correct and try again!
          </p>
        </>
      );
    } else {
      verificationMessage = (
        <>
          <h2 className={classes.error}>Oops! Somethin went Wrong...</h2>
          <small>Email verification Failed!</small>
          <p>
            Please try again after sometimes, or contact us, if issue persists!
          </p>
        </>
      );
    }

    return (
      <div className={classes.EmailVerif}>
        {!this.state.status ? <Spinner /> : verificationMessage}
      </div>
    );
  }
}

export default EmailVerification;
