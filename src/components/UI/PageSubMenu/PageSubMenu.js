import { NavLink } from "react-router-dom";
import classes from "./PageSubMenu.module.css";
import { AiOutlineUnorderedList } from "react-icons/ai";
import Sidebar from "../Sidebar/Sidebar";

const PageSubMenu = (props) => {
  const menuItems = Object.keys(props.menuItems).map((item) => {
    return (
      <li key={item}>
        {props.menuItems[item].disabled ? (
          <span className={classes.disabledNav}>
            {props.menuItems[item].name}
          </span>
        ) : (
          <NavLink
            to={`${props.urlPathname}?page=${item}`}
            className={props.queryParam === item ? classes.activeNav : null}
            onClick={props.sidebarToggler.bind(this, false)}
          >
            {props.menuItems[item].name}
          </NavLink>
        )}
      </li>
    );
  });
  return (
    <>
      <div className={classes.PageSubMenuSidebar}>
        <div className={classes.menuIcon}>
          <div onClick={props.sidebarToggler}>
            <AiOutlineUnorderedList />
            <span>Menu</span>
          </div>
        </div>
        <Sidebar visibility={props.showSidebar} onClose={props.sidebarToggler}>
          <ul>{menuItems}</ul>
        </Sidebar>
      </div>
      <ul className={classes.PageSubMenu}>{menuItems}</ul>
    </>
  );
};

export default PageSubMenu;
