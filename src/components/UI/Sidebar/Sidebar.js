import classes from "./Sidebar.module.css";
import { IoClose } from "react-icons/io5";
import Backdrop from "../Backdrop/Backdrop";

const Sidebar = (props) => {
  if (props.visibility) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <Backdrop visibility={props.visibility} onClick={props.onClose} />
      <div
        className={`${classes.Sidebar} ${
          props.alignment === "right" ? classes.right : classes.left
        } ${
          props.visibility
            ? props.alignment === "right"
              ? classes.visibility_right
              : classes.visibility_left
            : ""
        }`}
      >
        <IoClose
          title="Close"
          className={classes.closeIcon}
          onClick={props.onClose}
        />
        <div className={classes.content}>{props.children}</div>
      </div>
    </>
  );
};

export default Sidebar;
