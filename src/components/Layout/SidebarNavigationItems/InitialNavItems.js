import { AiOutlineUserAdd } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { IoReader } from "react-icons/io5";
import NavigationItem from "../NavigationItems/NavigationItem/NavigationItem";
import classes from "./InitialNavItems.module.css";

const InitialNavItems = (props) => {
  return (
    <ul className={classes.InitialNavItems}>
      <NavigationItem link="/feed" onClick={props.onItemClick}>
        <IoReader />
        Feed
      </NavigationItem>
      <NavigationItem
        link="/login"
        onClick={props.onItemClick}
        prevPath={props.prevPath}
      >
        <FiLogIn />
        Login
      </NavigationItem>
      <NavigationItem link="/signup" onClick={props.onItemClick}>
        <AiOutlineUserAdd />
        Signup
      </NavigationItem>
    </ul>
  );
};

export default InitialNavItems;
