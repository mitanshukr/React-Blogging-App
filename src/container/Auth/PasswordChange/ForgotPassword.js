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
  };

  inputChangeHandler = (e) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements.email.value = e.target.value;
    this.setState({ inputElements: updatedInputElements });
  };

  forgotPassSubmitHandler = (e) => {
    axios
      .post("http://localhost:8000/auth/forgot-password", {
        email: this.state.inputElements.email.value,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  render() {
    return (
      <AuthLayout>
        <AuthCard>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ marginBottom: "0px" }}>Get Password Reset Link</h2>
            <small style={{ color: "tomato", lineHeight: "1px" }}>
              Enter your Registered Email Address to get the Password Reset Link
              in your Inbox.
            </small>
          </div>
          <Input
            key="email"
            elementType={this.state.inputElements.email.elementType}
            onChange={(e) => this.inputChangeHandler(e)}
            elementConfig={this.state.inputElements.email.elementConfig}
            value={this.state.inputElements.email.value}
          />
          <Button type="submit" onClick={this.forgotPassSubmitHandler}>
            Submit
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }
}

export default ForgotPassword;
