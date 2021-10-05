import { cloneDeep } from "lodash";
import React from "react";
import AccountsPage from "../../../components/Layout/AccountsPage";

import Input from "../../../components/UI/Input/Input";
import ProfilePicture from "../../../components/User/Profile/ProfilePicture";
import checkValidity from "../../../Utility/inputValidation";
import classes from "./Account.module.css";
import PersonalInfo from "./PersonalInfo";

class Account extends React.Component {
  

  render() {
    
    return (
      <AccountsPage>
        <PersonalInfo />
      </AccountsPage>
    );
  }
}

export default Account;
