import React from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";

import axios from "axios";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
import { cloneDeep } from "lodash";
import checkValidity from "../../../Utility/inputValidation";
import ErrorCard from "../../../components/UI/ErrorCard/ErrorCard";
import { Link } from "react-router-dom";
import getErrorMsg from "../authErrorHandler";
// import Spinner from "../../../components/UI/Spinner/Spinner";

class ForgotPassword extends React.Component {
  state = {
    inputElements: {
      email: {
        elementType: "input",
        elementConfig: {
          name: "email",
          type: "text",
          placeholder: "Enter your Email Address",
        },
        value: "",
        validation: {
          errorMsg: null,
          isTouched: false,
          required: true,
          isEmail: true,
        },
      },
    },
    resetEmailSent: false,
    serverBusy: false,
    localError: null,
  };

  onBlurEventHandler = (event) => {
    let value = event.target?.value || event.value || "";
    const errorMsg = checkValidity(
      value,
      this.state.inputElements.email.validation
    );
    const updatedElem = cloneDeep(this.state.inputElements.email);
    updatedElem.value = value;
    updatedElem.validation.isTouched = true;
    updatedElem.validation.errorMsg = errorMsg;
    this.setState((prevState) => {
      return {
        ...prevState,
        inputElements: {
          ...prevState.inputElements,
          email: updatedElem,
        },
      };
    });
    return errorMsg;
  };

  inputChangeHandler = (e) => {
    let value = e.target?.value;
    let errorMsg = null;
    if (this.state.localError) {
      this.setState({ localError: null });
    }
    if (this.state.inputElements.email.validation.isTouched) {
      errorMsg = checkValidity(
        value,
        this.state.inputElements.email.validation
      );
    }
    const updatedInputElements = cloneDeep(this.state.inputElements);
    updatedInputElements.email.value = e.target.value;
    updatedInputElements.email.validation.errorMsg = errorMsg;
    this.setState({ inputElements: updatedInputElements });
  };

  forgotPassSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.localError) {
      this.setState({ localError: null });
    }
    let error = null;
    error += this.onBlurEventHandler({
      name: "email",
      value: this.state.inputElements.email.value,
    });
    if (error) return;
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });
    axios
      .post("http://localhost:8000/auth/forgot-password", {
        email: this.state.inputElements.email.value,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "success") {
          this.setState({ resetEmailSent: true, serverBusy: false });
        } else {
          alert("Something went Wrong. Please try again!");
          this.setState({ serverBusy: false });
        }
      })
      .catch((err) => {
        this.setState({
          serverBusy: false,
          localError: getErrorMsg(err),
        });
      });
  };

  render() {
    return (
      <AuthLayout>
        {/* <h3>Immune Ink Logo here</h3> */}
        <AuthCard>
          {this.state.resetEmailSent ? (
            <>
              <h3>Reset Link Sent Successfully!</h3>
              <p>Please find the reset link sent to your inbox.</p>
              <small>Valid for 1hr.</small>
              <Link to="/">Go to Home Page</Link>
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
              <form>
                <ErrorCard>{this.state.localError}</ErrorCard>
                <Input
                  key="email"
                  elementType={this.state.inputElements.email.elementType}
                  onChange={(e) => this.inputChangeHandler(e)}
                  elementConfig={this.state.inputElements.email.elementConfig}
                  value={this.state.inputElements.email.value}
                  errorMsg={this.state.inputElements.email.validation.errorMsg}
                  onBlur={this.onBlurEventHandler}
                />
                <Button
                  type="submit"
                  onClick={this.forgotPassSubmitHandler}
                  disabled={this.state.serverBusy ? true : false}
                >
                  {this.state.serverBusy ? "Please wait..." : "Get Link"}
                </Button>
              </form>
              <div>
                <p>
                  <Link to="/login">Go back to Login Page</Link>
                </p>
              </div>
            </>
          )}
        </AuthCard>
      </AuthLayout>
    );
  }
}

export default ForgotPassword;
