import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import classes from "./Notification.module.css";

const Notification = (props) => {
  const notif_style = `${classes.Notification} ${
    props.show ? classes.Notifi_show : ""
  } ${props.type === "SUCCESS" ? classes.success : classes.error}`;
  return (
    <div className={notif_style}>
      {props.type === "SUCCESS" ? (
        <IoIosCheckmarkCircle className={classes.successIcon} />
      ) : (
        <IoIosCloseCircle className={classes.errorIcon} />
      )}
      <p className={classes.message}>{props.message}</p>
    </div>
  );
};

export default Notification;
