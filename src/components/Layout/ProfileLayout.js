// import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import classes from "./AccountsLayout.module.css";

const ProfileLayout = (props) => {
  return (
    <div className={classes.AccountsLayout}>
      <h1 className={classes.AccountsLayout__header}>Account Settings</h1>
      <div className={classes.AccountsLayout__col1}>
        <ul>
          {Object.keys(props.menuItems).map((item) => {
            return (
              <li key={item}>
                {props.menuItems[item].disabled ? (
                  <span className={classes.disabledNav}>
                    {props.menuItems[item].name}
                  </span>
                ) : (
                  <NavLink
                    to={`/ink/${props.userName}?feed=${item}`}
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
      <div className={classes.AccountsLayout__col2}>{props.children}</div>
    </div>
  );
};

export default ProfileLayout;
