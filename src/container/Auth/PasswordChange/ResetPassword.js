import React from "react";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";

import axios from "../../../axios-instance";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
import { Link } from "react-router-dom";
import checkValidity from "../../../Utility/inputValidation";
import { cloneDeep } from "lodash";
import getErrorMsg from "../authErrorHandler";
import ErrorCard from "../../../components/UI/ErrorCard/ErrorCard";
// import Spinner from "../../../components/UI/Spinner/Spinner";

import classes from "./ResetPassword.module.css";

class ResetPassword extends React.Component {
  state = {
    inputElements: {
      password: {
        elementType: "input",
        elementConfig: {
          name: "password",
          type: "password",
          placeholder: "Enter a New Password",
        },
        value: "",
        validation: {
          errorMsg: null,
          isTouched: false,
          required: true,
          isStrongPassword: true,
        },
      },
      password2: {
        elementType: "input",
        elementConfig: {
          name: "password2",
          type: "password",
          placeholder: "Re-enter the Password",
        },
        value: "",
        validation: {
          errorMsg: null,
          isTouched: false,
          required: true,
          // isStrongPassword: true,
        },
      },
    },
    userEmail: "",
    isPasswordUpdated: false,
    linkBroken: null,
    serverBusy: false,
    localError: null,
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    if (query.get("email")) {
      this.setState({ userEmail: query.get("email") });
    } else {
      this.setState({ localError: "Looks like the URL is invalid." });
    }
    // axios
    //   .get(`/user/info/${this.props.match.params.userId}`)
    //   .then((response) => {
    //     this.setState({ userEmail: response?.data?.email });
    //   })
    //   .catch((err) => {
    //     this.setState({ localError: "Looks like the URL is invalid." });
    //   });
  }

  onBlurEventHandler = (event) => {
    let name = event.target?.name || event.name;
    let value = event.target?.value || event.value || "";
    let errorMsg = checkValidity(
      value,
      this.state.inputElements[name].validation
    );
    if (name === "password2") {
      if (value !== this.state.inputElements.password.value) {
        errorMsg = "Password does not Match.";
      }
    }
    const updatedElem = cloneDeep(this.state.inputElements[name]);
    updatedElem.value = value;
    updatedElem.validation.isTouched = true;
    updatedElem.validation.errorMsg = errorMsg;
    this.setState((prevState) => {
      return {
        ...prevState,
        inputElements: {
          ...prevState.inputElements,
          [name]: updatedElem,
        },
      };
    });
    return errorMsg;
  };

  inputChangeHandler = (e) => {
    let name = e.target?.name;
    let value = e.target?.value;
    let errorMsg = null;
    if (this.state.inputElements[name].validation.isTouched) {
      errorMsg = checkValidity(
        value,
        this.state.inputElements[name].validation
      );
    }
    if (name === "password2") {
      if (value !== this.state.inputElements.password.value) {
        errorMsg = "Password does not Match.";
      }
    }

    const updatedInputElements = cloneDeep(this.state.inputElements);
    if (name === "password") {
      if (value !== this.state.inputElements.password2.value) {
        updatedInputElements.password2.validation.errorMsg =
          "Password does not Match.";
      } else {
        updatedInputElements.password2.validation.errorMsg = null;
      }
    }
    updatedInputElements[name].value = value;
    updatedInputElements[name].validation.errorMsg = errorMsg;
    this.setState({ inputElements: updatedInputElements });
  };

  updatePassSubmitHandler = (e) => {
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });
    if (this.state.localError) {
      this.setState({ localError: null });
    }
    let error = null;
    for (let field in this.state.inputElements) {
      error += this.onBlurEventHandler({
        name: field,
        value: this.state.inputElements[field].value,
      });
    }
    if (error) {
      this.setState({ serverBusy: false });
      return;
    }

    axios
      .post("/auth/reset-password", {
        userId: this.props.match.params.userId,
        resetToken: this.props.match.params.resetToken,
        newPassword: this.state.inputElements.password2.value,
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          this.setState({ isPasswordUpdated: true, serverBusy: false });
        }
      })
      .catch((err) => {
        let linkBroken = false;
        if (
          err.response?.data?.status === 400 ||
          err.response?.data?.status === 410
        ) {
          linkBroken = true;
        }
        this.setState({
          serverBusy: false,
          localError: getErrorMsg(err),
          linkBroken: linkBroken,
        });
      });
  };

  render() {
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <Input
        key={element}
        elementType={this.state.inputElements[element].elementType}
        onChange={this.inputChangeHandler}
        elementConfig={this.state.inputElements[element].elementConfig}
        value={this.state.inputElements[element].value}
        onBlur={this.onBlurEventHandler}
        errorMsg={this.state.inputElements[element].validation.errorMsg}
      />
    ));

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
              <div className={classes.ResetPassword__header}>
                <h2 style={{ marginBottom: "0px" }}>Reset your Password</h2>
                <small>Please don't share this link to anyone.</small>
                <input
                  disabled
                  type="text"
                  name="email"
                  value={this.state.userEmail}
                />
              </div>
              <ErrorCard style={{ boxSizing: "border-box", width: "100%" }}>
                {this.state.localError}
              </ErrorCard>
              {formElements}
              <Button
                type="submit"
                onClick={this.updatePassSubmitHandler}
                disabled={this.state.serverBusy || this.state.linkBroken}
              >
                {this.state.serverBusy ? "Please wait..." : "Update"}
              </Button>
            </>
          )}
        </AuthCard>
        <div className={classes.ResetPassword__navigation}>
          <Link to="/">Go to Homepage</Link>
          <Link to="/login">Go to Login Page</Link>
        </div>
      </AuthLayout>
    );
  }
}

export default ResetPassword;
