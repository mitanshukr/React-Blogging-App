// import { FaRegUser } from "react-icons/fa";
import PageSubMenu from "../UI/PageSubMenu/PageSubMenu";
import classes from "./AccountLayout.module.css";

const AccountLayout = (props) => {
  return (
    <div className={classes.AccountLayout}>
      <h1 className={classes.AccountLayout__header}>Account Settings</h1>
      <div className={classes.AccountLayout__col1}>
        <PageSubMenu
          urlPathname="/user/account"
          menuItems={props.menuItems}
          queryParam={props.queryParam}
        />
      </div>
      <div className={classes.AccountLayout__col2}>{props.children}</div>
    </div>
  );
};

export default AccountLayout;
