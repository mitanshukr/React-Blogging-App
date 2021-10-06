// import { FaRegUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

import classes from "./AccountsLayout.module.css";

const AccountsPage = (props) => {

  return (
    <div className={classes.AccountsPage}>
      <h1 className={classes.AccountsPage__header}>Account Settings</h1>
      <div className={classes.AccountsPage__col1}>
        <ul>
          {Object.keys(props.menuItems).map((item) => {
            return (
              <li>
                {props.menuItems[item].disabled ? (
                  <span className={classes.disabledNav}>
                    {props.menuItems[item].name}
                  </span>
                ) : (
                  <NavLink
                    to={`/user/account?page=${item}`}
                    className={
                      props.queryParam === item ? classes.activeNav : null
                    }
                  >
                    {props.menuItems[item].name}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={classes.AccountsPage__col2}>{props.children}</div>
    </div>
  );
};

export default AccountsPage;
