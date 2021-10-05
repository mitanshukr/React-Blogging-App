// import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import classes from "./AccountsPage.module.css";

const AccountsPage = (props) => {
  const query = new URLSearchParams("user/?feed=posts").get("feed");

  return (
    <div className={classes.AccountsPage}>
      <h1 className={classes.AccountsPage__header}>Account Settings</h1>
      <div className={classes.AccountsPage__col1}>
        <ul>
          <li>Personal Info</li>
          <li>Account</li>
          <li>Notifications</li>
          <li>Data & Privacy</li>
          <li>Help</li>
        </ul>
      </div>
      <div className={classes.AccountsPage__col2}>{props.children}</div>
    </div>
  );
};

export default AccountsPage;
