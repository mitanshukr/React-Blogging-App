import React from "react";
import { withRouter } from "react-router";

import AccountLayout from "../../../components/Layout/AccountLayout";
import PersonalInfo from "./PersonalInfo";
import Account from "./Account";

class AccountsPage extends React.Component {
  state = {
    sidebarVisibility: false,
  };

  sidebarToggler = () => {
    this.setState((prevState) => ({
      sidebarVisibility: !prevState.sidebarVisibility,
    }));
  };

  render() {
    this.queryParam = new URLSearchParams(
      this.props.history.location.search
    ).get("page");
    return (
      <AccountLayout
        queryParam={this.queryParam || "personalInfo"}
        showSidebar={this.state.sidebarVisibility}
        sidebarToggler={this.sidebarToggler}
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
      </AccountLayout>
    );
  }
}

export default withRouter(AccountsPage);
