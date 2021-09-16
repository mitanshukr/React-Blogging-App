import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";

import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {
  errorHandler,
  loginActionHandler,
  redirectPathHandler,
} from "../../../store/actions";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        password: {
          elementType: "input",
          elementConfig: {
            name: "password",
            type: "password",
            placeholder: "Your Password",
          },
          value: "",
          validation: {},
        },
      },
      serverBusy: false,
      localError: null,
    };
    this.authCheck();
  }

  authCheck() {
    this.from = this.props.location.from || { pathname: "/" };
    if (this.props.isAuthenticated) {
      this.props.history.replace(this.from);
    }
  }

  inputChangeHandler = (e, stateName) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements[stateName].value = e.target.value;

    this.setState({ inputElements: updatedInputElements });
  };

  loginHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });
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
          throw new Error("Something went wrong :(");
        }
      })
      .catch((err) => {
        //local.err....
        console.log(err.response);
        this.setState({ serverBusy: false });
      });
    // this.props.history.goBack();
  };

  render() {
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <div className="Login__inputDiv" key={element}>
        <Input
          elementType={this.state.inputElements[element].elementType}
          onChange={(e) => this.inputChangeHandler(e, element)}
          elementConfig={this.state.inputElements[element].elementConfig}
          value={this.state.inputElements[element].value}
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
          <form onSubmit={this.loginHandler}>
            {this.props.redirectPath ? (
              <h2>Please Login to Continue!</h2>
            ) : (
              <h2>Welcome Back!</h2>
            )}
            <p className="Error">{this.props.errorMsg}</p>
            {formElements}
            <Button
              type="submit"
              disabled={this.state.serverBusy ? true : false}
            >
              {this.state.serverBusy ? "Logging in... Please wait" : "Login"}
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

const mapDispatchToProps = (dispatch) => {
  return {
    loginDispatchHandler: (userData) => {
      dispatch(loginActionHandler(userData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
