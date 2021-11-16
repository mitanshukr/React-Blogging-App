// import MenuList from "../../../container/Layout/Toolbar/UserMenu/MenuList/MenuList";
// import ProfileIcon from "../../User/Profile/ProfileIcon";
// import { NavLink } from "react-router-dom";

import InitialNavItems from "./InitialNavItems";
import AuthedNavItems from "./AuthedNavItems";

const SidebarNavigationItems = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {props.isAuthenticated ? (
        <AuthedNavItems
          onItemClick={props.onItemClick}
          prevPath={props.prevPath}
          firstName={props.firstName}
          lastName={props.lastName}
          userName={props.userName}
        />
      ) : (
        <InitialNavItems
          onItemClick={props.onItemClick}
          prevPath={props.prevPath}
        />
      )}
      <small style={{ color: "rgb(177, 177, 177)", fontSize: "10px" }}>
        v1.0.0
      </small>
    </div>
  );
};

export default SidebarNavigationItems;
