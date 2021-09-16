import React from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";

import axios from "axios";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
import { Link } from "react-router-dom";
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
    userEmail: null,
    isPasswordUpdated: false,
    serverBusy: false,
    localError: null,
  };

  componentDidMount() {
    axios
      .get(`http://localhost:8000/user/info/${this.props.match.params.userId}`)
      .then((response) => {
        this.setState({ userEmail: response?.data?.email });
      })
      .catch((err) => {
        console.log("Something went wrong!");
        this.setState({ localError: "Looks like the URL is invalid." });
      });
  }

  inputChangeHandler = (e, type) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements[type].value = e.target.value;
    this.setState({ inputElements: updatedInputElements });
  };

  updatePassSubmitHandler = (e) => {
    if (this.state.serverBusy) {
      return;
    }
    if (
      this.state.inputElements.password.value !==
        this.state.inputElements.password2.value ||
      this.state.inputElements.password2.value.length === 0
    ) {
      alert("Invalid Input!");
      return;
    }
    this.setState({ serverBusy: true });
    axios
      .post("http://localhost:8000/auth/reset-password", {
        userId: this.props.match.params.userId,
        resetToken: this.props.match.params.resetToken,
        newPassword: this.state.inputElements.password2.value,
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          this.setState({ isPasswordUpdated: true });
        }
        this.setState({ serverBusy: false });
      })
      .catch((err) => {
        console.log(err.response);
        //state localError...
        this.setState({ serverBusy: false });
      });
  };

  render() {
    return (
      <AuthLayout>
        <AuthCard>
          {this.state.isPasswordUpdated ? (
            <>
              <h3>Success! Your Password is successfully updated.</h3>
              <p>
                <Link to="/login">Login to the application</Link> to create a
                new Post.
              </p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ marginBottom: "0px" }}>Reset your Password</h2>
                <small style={{ color: "tomato", lineHeight: "1px" }}>
                  {this.state.localError
                    ? this.state.localError
                    : "Please don't share this link to anyone."}
                </small>
                {/* <p>{this.state.localError}</p> */}
              </div>
              <input
                style={{
                  color: "rgb(182, 182, 182)",
                  fontWeight: "bold",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                }}
                disabled
                type="text"
                name="email"
                value={this.state.userEmail}
              />

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
              <Button
                type="submit"
                onClick={this.updatePassSubmitHandler}
                disabled={this.state.serverBusy ? true : false}
              >
                {this.state.serverBusy ? "Please wait..." : "Update"}
              </Button>
            </>
          )}
        </AuthCard>
      </AuthLayout>
    );
  }
}

export default ResetPassword;
