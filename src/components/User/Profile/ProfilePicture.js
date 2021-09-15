import { FaRegUser } from "react-icons/fa";
import classes from './ProfilePicture.module.css';

const ProfilePicture = (props) => {
  return (
    <div className={classes.ProfilePicture}>
      <FaRegUser title="Profile Picture" />
    </div>
  );
};

export default ProfilePicture;
