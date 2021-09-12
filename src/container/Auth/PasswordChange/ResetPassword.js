import React from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";

import axios from "axios";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
// import Spinner from "../../../components/UI/Spinner/Spinner";

class ResetPassword extends React.Component {
  state = {
    inputElements: {
      password: {
        elementType: "input",
        elementConfig: {
          name: "password",
          type: "password",
          placeholder: "Enter your new Password",
        },
        value: "",
        validation: {},
      },
      password2: {
        elementType: "input",
        elementConfig: {
          name: "password",
          type: "password",
          placeholder: "Re-enter your new Password",
        },
        value: "",
        validation: {},
      },
    },
  };

  inputChangeHandler = (e, type) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements[type].value = e.target.value;
    this.setState({ inputElements: updatedInputElements });
  };

  forgotPassSubmitHandler = (e) => {
    if (
      this.state.inputElements.password.value !==
      this.state.inputElements.password2.value
    ) {
      alert("Password not matching...");
      return;
    }
    axios
      .post("http://localhost:8000/auth/reset-password", {
        userId: this.props.match.params.userId,
        resetToken: this.props.match.params.resetToken,
        newPassword: this.state.inputElements.password2.value,
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
            <h2 style={{ marginBottom: "0px" }}>Reset your Password</h2>
            <small style={{ color: "tomato", lineHeight: "1px" }}>
              Please don't share this link to anyone.
            </small>
          </div>
          <Input
            key="password"
            elementType={this.state.inputElements.password.elementType}
            onChange={(e) => this.inputChangeHandler(e, "password")}
            elementConfig={this.state.inputElements.password.elementConfig}
            value={this.state.inputElements.password.value}
          />
          <Input
            key="password2"
            elementType={this.state.inputElements.password2.elementType}
            onChange={(e) => this.inputChangeHandler(e, "password2")}
            elementConfig={this.state.inputElements.password2.elementConfig}
            value={this.state.inputElements.password2.value}
          />
          <Button type="submit" onClick={this.forgotPassSubmitHandler}>
            Update
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }
}

export default ResetPassword;
