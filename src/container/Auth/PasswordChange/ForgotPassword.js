import React from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";

import axios from "axios";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
// import Spinner from "../../../components/UI/Spinner/Spinner";

class ForgotPassword extends React.Component {
  state = {
    inputElements: {
      email: {
        elementType: "input",
        elementConfig: {
          name: "username",
          type: "text",
          placeholder: "Your Email Id",
        },
        value: "",
        validation: {},
      },
    },
    resetEmailSent: false,
    serverBusy: false,
    localError: null,
  };

  inputChangeHandler = (e) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements.email.value = e.target.value;
    this.setState({ inputElements: updatedInputElements });
  };

  forgotPassSubmitHandler = (e) => {
    if (this.state.inputElements.email.value.length === 0) {
      alert("Please provide a valid email");
      return;
    }
    if (this.state.serverBusy) {
      return;
    }
    this.setState({ serverBusy: true });
    axios
      .post("http://localhost:8000/auth/forgot-password", {
        email: this.state.inputElements.email.value,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.emailStatus === "success") {
          this.setState({ resetEmailSent: true });
        }
        this.setState({ serverBusy: false });
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ serverBusy: false });
        //this.setState({localError: ...})
      });
  };

  render() {
    return (
      <AuthLayout>
        <AuthCard>
          {this.state.resetEmailSent ? (
            <>
              <h3>Reset Link Sent Successfully!</h3>
              <p>Please find the reset link sent to your inbox.</p>
              <small>Valid for 1hr.</small>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ marginBottom: "0px" }}>Get Password Reset Link</h2>
                <small style={{ color: "tomato", lineHeight: "1px" }}>
                  Enter your Registered Email Address to get the Password Reset
                  Link in your Inbox.
                </small>
              </div>
              <Input
                key="email"
                elementType={this.state.inputElements.email.elementType}
                onChange={(e) => this.inputChangeHandler(e)}
                elementConfig={this.state.inputElements.email.elementConfig}
                value={this.state.inputElements.email.value}
              />
              <Button
                type="submit"
                onClick={this.forgotPassSubmitHandler}
                disabled={this.state.serverBusy ? true : false}
              >
                {this.state.serverBusy ? "Please wait..." : "Submit"}
              </Button>
            </>
          )}
        </AuthCard>
      </AuthLayout>
    );
  }
}

export default ForgotPassword;
