import { cloneDeep } from "lodash";
import React from "react";

import Input from "../../../components/UI/Input/Input";
import ProfilePicture from "../../../components/User/Profile/ProfilePicture";
import checkValidity from "../../../Utility/inputValidation";
import classes from "./Account.module.css";

class Account extends React.Component {
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
          label: "First Name",
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
            placeholder: "Your Last Name",
          },
          label: "Last Name",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
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
        email: {
          elementType: "input",
          elementConfig: {
            name: "email",
            type: "text",
            placeholder: "Enter your Email Address",
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
    let formElements = Object.keys(this.state.inputElements).map((element) => (
      <Input
        key={element}
        elementType={this.state.inputElements[element].elementType}
        onChange={this.inputChangeHandler}
        elementConfig={this.state.inputElements[element].elementConfig}
        value={this.state.inputElements[element].value}
        label={this.state.inputElements[element].label}
        onBlur={this.onBlurEventHandler}
        errorMsg={this.state.inputElements[element].validation.errorMsg}
      />
    ));

    return (
      <div className={classes.Account}>
        <h2>Account Settings</h2>
        <div className={classes.Account__profile}>
          <ProfilePicture />
          <p>Add Profile</p>
        </div>
        <div className={classes.Account__main}>
          <div className={classes[`Account__main-name`]}></div>
          {formElements}
        </div>
      </div>
    );
  }
}

export default Account;
