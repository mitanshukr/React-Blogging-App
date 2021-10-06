import { FaRegUser, FaPen } from "react-icons/fa";
import classes from "./AccountPicture.module.css";

const AccountPicture = (props) => {
  return (
    <div className={classes.AccountPicture}>
      <div className={classes.AccountPicture__dp}>
        <FaRegUser title="Profile Picture" />
      </div>
      <div className={classes.AccountPicture__edit}>
        <FaPen title="feature not available" />
      </div>
    </div>
  );
};

export default AccountPicture;
