import React, { Component } from "react";
import axios from "axios";

import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import classes from "./Signup.module.css";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
import { connect } from "react-redux";
import ErrorCard from "../../../components/UI/ErrorCard/ErrorCard";
import { cloneDeep } from "lodash";
import checkValidity from "../../../Utility/inputValidation";
import { Link } from "react-router-dom";
import getErrorMsg from "../authErrorHandler";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputElements: {
        firstName: {
          elementType: "input",
          elementConfig: {
            name: "firstName",
            type: "text",
            placeholder: "Enter your First Name",
          },
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
          },
        },
        lastName: {
          elementType: "input",
          elementConfig: {
            name: "lastName",
            type: "text",
            placeholder: "Enter your Last Name",
          },
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
          },
        },
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
      serverBusy: false,
      successMsg: null,
      localError: null,
    };
    this.authCheck();
  }

  authCheck = () => {
    if (this.props.isAuthenticated) {
      this.props.history.replace("/");
    }
  };

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
    if (this.state.localError) {
      this.setState({ localError: null });
    }
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

  signupSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });

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

    const userData = {
      email: this.state.inputElements.email.value,
      password: this.state.inputElements.password.value,
      firstName: this.state.inputElements.firstName.value,
      lastName: this.state.inputElements.lastName.value,
    };
    axios
      .post("http://localhost:8000/auth/signup", userData)
      .then((response) => {
        const updatedInputElements = cloneDeep(this.state.inputElements);
        for (let elem in updatedInputElements) {
          updatedInputElements[elem].value = "";
        }
        this.setState({
          inputElements: updatedInputElements,
          successMsg: "Signup Successful! Please login to Continue.",
          serverBusy: false,
        });
      })
      .catch((err) => {
        this.setState({
          serverBusy: false,
          localError: getErrorMsg(err),
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
      <AuthLayout style={{ paddingTop: "0.2rem" }}>
        <AuthCard>
          <form onSubmit={this.signupSubmitHandler} autoComplete="false">
            <h2>Signup Form</h2>
            <div className={classes.Signup__LoginLink}>
              <p>
                Already have an Account? <Link to="/login">Login</Link>
              </p>
            </div>
            {this.state.successMsg ? (
              <p className={`${classes.success}`}>{this.state.successMsg}</p>
            ) : (
              <ErrorCard>{this.state.localError}</ErrorCard>
            )}
            {formElements}
            <Button
              type="submit"
              disabled={
                this.state.serverBusy ||
                this.state.localError ||
                this.state.successMsg
              }
            >
              {this.state.serverBusy ? "Processing...Please wait!" : "Register"}
            </Button>
          </form>
        </AuthCard>
      </AuthLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps)(Signup);
