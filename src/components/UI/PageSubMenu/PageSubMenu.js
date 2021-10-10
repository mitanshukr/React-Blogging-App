import { NavLink } from "react-router-dom";
import classes from "./PageSubMenu.module.css";

const PageSubMenu = (props) => {
  return (
    <ul className={classes.PageSubMenu}>
      {Object.keys(props.menuItems).map((item) => {
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
              >
                {props.menuItems[item].name}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default PageSubMenu;
