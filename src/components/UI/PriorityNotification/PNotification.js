import { IoClose } from "react-icons/io5";
import classes from "./PNotification.module.css";

const PNotification = (props) => {
  return (
    <div className={classes.PNotification}>
      <div className={classes.PNotification__msg}>{props.children || "&nbsp;"}</div>
      <small className={classes.PNotification__dismiss} title="Dismiss" onClick={props.dismissNotification}>
        Dismiss
      </small>
    </div>
  );
};

export default PNotification;
