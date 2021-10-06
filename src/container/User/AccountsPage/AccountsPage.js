import React from "react";
import { withRouter } from "react-router";

import AccountsLayout from "../../../components/Layout/AccountsLayout";
import PersonalInfo from "./PersonalInfo";
import Account from "./Account";

class AccountsPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    this.queryParam = new URLSearchParams(
      this.props.history.location.search
    ).get("page");
    return (
      <AccountsLayout
        queryParam={this.queryParam || "personalInfo"}
        menuItems={{
          personalInfo: {
            name: "Personal Info",
          },
          account: {
            name: "Account",
          },
          notifications: {
            name: "Notifications",
            disabled: true,
          },
          dataPrivacy: {
            name: "Data & Privacy",
            disabled: true,
          },
          help: {
            name: "Help",
            disabled: true,
          },
        }}
      >
        {this.queryParam === "account" ? <Account /> : <PersonalInfo />}
      </AccountsLayout>
    );
  }
}

export default withRouter(AccountsPage);
