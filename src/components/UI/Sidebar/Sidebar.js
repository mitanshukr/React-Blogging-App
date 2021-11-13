import classes from "./Sidebar.module.css";
import { IoClose } from "react-icons/io5";
import Backdrop from "../Backdrop/Backdrop";

const Sidebar = (props) => {
  return (
    <>
      <Backdrop visibility={props.visibility} onClick={props.onClose} />
      <div
        className={`${classes.Sidebar} ${
          props.visibility ? classes.visibility : ""
        }`}
      >
        <IoClose className={classes.closeIcon} onClick={props.onClose} />
        <div onClick={props.onClose}>{props.children}</div>
      </div>
    </>
  );
};

export default Sidebar;
