import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";

import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { errorHandler, loginActionHandler } from "../../../store/actions";
import "./Login.css";

class Login extends Component {
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
  };

  componentWillUnmount() {
    this.props.errorNullifyHandler();
  }

  inputChangeHandler = (e, stateName) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements[stateName].value = e.target.value;

    this.setState({ inputElements: updatedInputElements });
  };

  loginHandler = (e) => {
    e.preventDefault();
    this.props.loginDispatchHandler(
      this.state.inputElements.email.value,
      this.state.inputElements.password.value
    );
    // console.log(this.props.history.action);
    // this.props.history.goBack();
  };

  render() {
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <div className="Login__inputDiv">
        <Input
          key={element}
          elementType={this.state.inputElements[element].elementType}
          onChange={(e) => this.inputChangeHandler(e, element)}
          elementConfig={this.state.inputElements[element].elementConfig}
          value={this.state.inputElements[element].value}
        />
        {element==="password" ? <small><Link to="/forgot-password">Forgot Password?</Link></small> : ""}
      </div>
    ));

    let loginPage = (
      <AuthLayout>
      <AuthCard>
        <form onSubmit={this.loginHandler}>
          <h2>Welcome Back!</h2>
          <p className="Error">{this.props.errorMsg}</p>
          {formElements}
          <Button type="submit">Login</Button>
        </form>
        </AuthCard>
      </AuthLayout>
    );

    if (this.props.serverBusy) {
      loginPage = <Spinner />;
    } else if (this.props.isAuthenticated) {
      loginPage = <Redirect to="/" />;
    }

    return loginPage;
  }
}

const mapStateToProps = (state) => {
  return {
    serverBusy: state.serverBusy,
    isAuthenticated: state.isAuthenticated,
    errorMsg: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginDispatchHandler: (email, password) => {
      dispatch(loginActionHandler(email, password));
    },
    errorNullifyHandler: () => {
      dispatch(errorHandler(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
