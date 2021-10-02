import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";

import Button from "../../../components/UI/Button/Button";
import ErrorCard from "../../../components/UI/ErrorCard/ErrorCard";
import Input from "../../../components/UI/Input/Input";
import { loginActionHandler } from "../../../store/actions";
import checkValidity from "../../../Utility/inputValidation";
import { cloneDeep } from "lodash";
import "./Login.css";
import getErrorMsg from "../authErrorHandler";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputElements: {
        email: {
          elementType: "input",
          elementConfig: {
            name: "email",
            type: "text",
            placeholder: "Your Email Id",
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
            placeholder: "Your Password",
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
      localError: null,
    };
    this.authCheck();
  }

  authCheck() {
    if (this.props.location?.state?.from?.isLogout) {
      this.props.history.replace("/");
    } else {
      this.from = this.props.location?.state?.from ||
        this.props.location?.state?.prevPath || { pathname: "/" };
    }
    if (this.props.isAuthenticated) {
      this.props.history.replace(this.from);
    }
  }

  onBlurEventHandler = (event) => {
    let name = event.target?.name || event.name;
    let value = event.target?.value || event.value || "";
    const errorMsg = checkValidity(
      value,
      this.state.inputElements[name].validation
    );
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
    const updatedInputElements = cloneDeep(this.state.inputElements);
    updatedInputElements[name].value = value;
    updatedInputElements[name].validation.errorMsg = errorMsg;
    this.setState({ inputElements: updatedInputElements });
  };

  loginSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });

    let error = this.state.localError;
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

    const userCred = {
      email: this.state.inputElements.email.value,
      password: this.state.inputElements.password.value,
    };
    axios
      .post(`http://localhost:8000/auth/login`, userCred)
      .then((response) => {
        if (response?.data) {
          this.props.loginDispatchHandler(response.data);
          this.props.history.replace(this.from);
        } else {
          throw new Error("Something went wrong.");
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
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <div className="Login__inputDiv" key={element}>
        <Input
          elementType={this.state.inputElements[element].elementType}
          onChange={this.inputChangeHandler}
          elementConfig={this.state.inputElements[element].elementConfig}
          value={this.state.inputElements[element].value}
          errorMsg={this.state.inputElements[element].validation.errorMsg}
          onBlur={this.onBlurEventHandler}
        />
        {element === "password" ? (
          <small>
            <Link to="/forgot-password">Forgot Password?</Link>
          </small>
        ) : null}
      </div>
    ));

    return (
      <AuthLayout>
        <AuthCard>
          <form onSubmit={this.loginSubmitHandler}>
            <h2 style={{ marginBottom: 0 }}>Welcome Back!</h2>
            {this.props.location?.state?.from ? (
              <small style={{ color: "tomato" }}>
                Please Login to Continue.
              </small>
            ) : null}
            <ErrorCard>{this.state.localError}</ErrorCard>
            {formElements}
            <Button
              style={{ minWidth: "100px" }}
              type="submit"
              disabled={this.state.serverBusy || this.state.localError}
            >
              {this.state.serverBusy ? "Logging in... Please wait" : "Login"}
            </Button>
          </form>
          <div className="Login__registerLink">
            <p>
              New here? <Link to="/signup">Signup</Link>
            </p>
          </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    loginDispatchHandler: (userData) => {
      dispatch(loginActionHandler(userData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
