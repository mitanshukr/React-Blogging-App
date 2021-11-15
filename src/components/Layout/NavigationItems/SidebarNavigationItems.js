// import MenuList from "../../../container/Layout/Toolbar/UserMenu/MenuList/MenuList";
// import ProfileIcon from "../../User/Profile/ProfileIcon";
import { NavLink } from "react-router-dom";
import NavigationItem from "./NavigationItem/NavigationItem";
import { FaRegBookmark, FaRegUser, FaRocketchat, FaKey } from "react-icons/fa";

const SidebarNavigationItems = (props) => {
  return (
    <div>
      <ul>
        {!props.isAuthenticated ? (
          <>
            <li>
              <NavLink to="/feed">Feed</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Signup</NavLink>
            </li>
          </>
        ) : (
          <>
            <NavigationItem link={`/ink/@${props.userName}`}>
              <span style={{ border: "1px solid black" }}>
                <span>
                  {props.firstName} {props.lastName}
                </span>
                <small>@{props.userName}</small>
              </span>
            </NavigationItem>
            <NavigationItem link="/feed">
              <FaRegBookmark /> Feed
            </NavigationItem>
            <NavigationItem link="/user/saved-items">
              <FaRegBookmark /> Saved Items
            </NavigationItem>
            <NavigationItem link="/user/account">
              <FaRegUser /> Account
            </NavigationItem>
            <NavigationItem link="/feedback">
              <FaRocketchat /> Feedback
            </NavigationItem>
            <NavigationItem link="/logout" prevPath={props.prevPath}>
              <FaKey /> Logout
            </NavigationItem>
          </>
        )}
        <p style={{ color: "red", fontWeight: "bold" }}>
          Note: Sidebar NavMenu is under developement, please Check back later.
          you can use Desktop screens to access Menu options for now. Thank you!
        </p>
      </ul>
    </div>
  );
};

export default SidebarNavigationItems;
