import React, { Component } from "react";
import axios from "axios";

import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import classes from "./Signup.module.css";
import AuthLayout from "../../../components/Layout/AuthLayout";
import AuthCard from "../../../components/UI/AuthCard/AuthCard";
import { connect } from "react-redux";

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
            placeholder: "Your First Name",
          },
          value: "",
          validation: {},
        },
        lastName: {
          elementType: "input",
          elementConfig: {
            name: "lastName",
            type: "text",
            placeholder: "Your Last Name",
          },
          value: "",
          validation: {},
        },
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
            placeholder: "Enter a Password",
          },
          value: "",
          validation: {},
        },
        password2: {
          elementType: "input",
          elementConfig: {
            name: "password",
            type: "password",
            placeholder: "Re-enter the Password",
          },
          value: "",
          validation: {},
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

  inputChangeHandler = (e, stateName) => {
    const updatedInputElements = { ...this.state.inputElements };
    updatedInputElements[stateName].value = e.target.value;

    this.setState({ inputElements: updatedInputElements });
  };

  signupHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });
    const userData = {
      email: this.state.inputElements.email.value,
      password: this.state.inputElements.password.value,
      firstName: this.state.inputElements.firstName.value,
      lastName: this.state.inputElements.lastName.value,
    };
    axios
      .post("http://localhost:8000/auth/signup", userData)
      .then((response) => {
        console.log(response.data);
        this.setState({
          successMsg: "Signup Successful! Please login to Continue.",
          serverBusy: false,
        });
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ serverBusy: false });
        //localError...
      });
  };

  render() {
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <Input
        key={element}
        elementType={this.state.inputElements[element].elementType}
        onChange={(e) => this.inputChangeHandler(e, element)}
        elementConfig={this.state.inputElements[element].elementConfig}
        value={this.state.inputElements[element].value}
      />
    ));

    return (
      <AuthLayout>
        <AuthCard>
          <form onSubmit={this.signupHandler}>
            <h2>Signup Form</h2>
            <p className={`${classes.message} ${classes.error}`}>
              {this.state.localError}
            </p>
            <p className={`${classes.message} ${classes.success}`}>
              {this.state.successMsg}
            </p>
            {formElements}
            <Button
              type="submit"
              disabled={this.state.serverBusy ? true : false}
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
