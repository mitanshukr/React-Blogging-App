import { IoMdCloudDone } from "react-icons/io";
import classes from "./Notification.module.css";

const Notification = (props) => {
  const notif_style = `${classes.Notification} ${
    props.show ? classes.Notifi_show : ""
  }`;
  return (
    <div className={notif_style}>
      <IoMdCloudDone className={classes.doneIcon} />
      <p className={classes.message}>{props.message}</p>
    </div>
  );
};

export default Notification;
