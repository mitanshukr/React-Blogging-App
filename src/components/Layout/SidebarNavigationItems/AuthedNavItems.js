import NavigationItem from "../NavigationItems/NavigationItem/NavigationItem";
import { FaRegBookmark, FaRegUser, FaRocketchat, FaKey } from "react-icons/fa";
import { IoIosJournal } from "react-icons/io";
import { IoReader } from "react-icons/io5";

import classes from "./AuthedNavItems.module.css";

const AuthedNavItems = (props) => {
  return (
    <ul className={classes.AuthedNavItems}>
      <NavigationItem
        link={`/ink/@${props.userName}`}
        onClick={props.onItemClick}
      >
        <span>
          {props.firstName} {props.lastName}
        </span>
        <small>@{props.userName}</small>
      </NavigationItem>

      <NavigationItem link="/feed" onClick={props.onItemClick}>
        <IoReader /> Feed
      </NavigationItem>
      <NavigationItem link="/posts" onClick={props.onItemClick}>
        <IoIosJournal /> Your Posts
      </NavigationItem>
      <NavigationItem link="/user/saved-items" onClick={props.onItemClick}>
        <FaRegBookmark /> Saved Items
      </NavigationItem>
      <NavigationItem link="/user/account" onClick={props.onItemClick}>
        <FaRegUser /> Account
      </NavigationItem>
      <NavigationItem link="/feedback" onClick={props.onItemClick}>
        <FaRocketchat /> Feedback
      </NavigationItem>
      <NavigationItem
        link="/logout"
        prevPath={props.prevPath}
        onClick={props.onItemClick}
      >
        <FaKey /> Logout
      </NavigationItem>
    </ul>
  );
};

export default AuthedNavItems;
