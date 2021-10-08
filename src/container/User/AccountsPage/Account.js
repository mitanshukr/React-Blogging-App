import React from "react";
import { cloneDeep } from "lodash";

import Input from "../../../components/UI/Input/Input";
import classes from "./Account.module.css";
import checkValidity from "../../../Utility/inputValidation";
import Button from "../../../components/UI/Button/Button";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Account extends React.Component {
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
          label: "Email",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
            isEmail: true,
          },
        },
        userName: {
          elementType: "input",
          elementConfig: {
            name: "userName",
            type: "text",
            placeholder: "Your Username",
          },
          label: "Username",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
            minLength: 5,
          },
        },
        password: {
          elementType: "input",
          elementConfig: {
            name: "password",
            type: "password",
            placeholder: "Your Password",
          },
          label: "Password",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
            isStrongPassword: true,
          },
        },
      },
      serverBusy: false,
      localError: null,
    };
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
    // if (name === "password") {
    //   if (value !== this.state.inputElements.password2.value) {
    //     updatedInputElements.password2.validation.errorMsg =
    //       "Password does not Match.";
    //   } else {
    //     updatedInputElements.password2.validation.errorMsg = null;
    //   }
    // }
    updatedInputElements[name].value = value;
    updatedInputElements[name].validation.errorMsg = errorMsg;
    this.setState({ inputElements: updatedInputElements });
  };

  render() {
    return (
      <div className={classes.PersonalInfo}>
        <div>
          <Input
            elementType="input"
            elementConfig={{
              name: "email",
              type: "text",
              placeholder: "Your Email Id",
              disabled: true,
            }}
            label="Email"
            value={this.props.email}
            required={true}
          />
          <small>Verify Email</small>
        </div>
        <div className={classes.PersonalInfo__username}>
          <div>
            <Input
              elementType="input"
              elementConfig={{
                name: "userName",
                type: "text",
                placeholder: "Your Username",
                readOnly: true,
              }}
              label="Username"
              value={this.props.userName}
              required={true}
            />
            <Button>Update</Button>
          </div>
          <div>
            <Link to={"/ink/@" + this.props.userName} target="_blank">
              {process.env.REACT_APP_ROOT_URL}/ink/@{this.props.userName}
            </Link>
          </div>
        </div>
        <div>
          <Input
            elementType="input"
            elementConfig={{
              name: "password",
              type: "password",
              placeholder: "Your Password",
              readOnly: true,
            }}
            label="Password"
            value="a0dd96439edee48d1f3"
            required={true}
          />
          <Button>Update</Button>
        </div>
      </div>
    );
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    email: state.email,
    userName: state.userName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // showNotification: (message, type) =>
    //   dispatch(showNotification(message, type)),
    // updateName: (fName, lName) => {
    //   dispatch(updateName(fName, lName));
    // },
  };
};

export default connect(mapStateToprops, mapDispatchToProps)(Account);
