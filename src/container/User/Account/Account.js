import React from "react";

import Input from "../../../components/UI/Input/Input";
import ProfilePicture from "../../../components/User/Profile/ProfilePicture";
import classes from "./Account.module.css";

class Account extends React.Component {
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

  render() {
    return (
      <div className={classes.Account}>
        <h2>Account Settings</h2>
        <div className={classes.Account__profile}>
          <ProfilePicture />
          <p>Add Profile</p>
        </div>
        <div className={classes.Account__main}>
          <div className={classes[`Account__main-name`]}>
            <Input
              elementType="input"
              elementConfig={this.state.inputElements.email.elementConfig}
            />
            <Input
              elementType="input"
              elementConfig={this.state.inputElements.email.elementConfig}
            />
          </div>
          <Input
            elementType="input"
            elementConfig={this.state.inputElements.email.elementConfig}
          />
          <Input
            elementType="input"
            elementConfig={this.state.inputElements.email.elementConfig}
          />
        </div>
      </div>
    );
  }
}

export default Account;
