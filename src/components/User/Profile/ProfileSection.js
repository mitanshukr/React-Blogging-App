// import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

import classes from "./ProfileSection.module.css";

const ProfileSection = (props) => {
  return (
    <>
      <ProfilePicture />
      <div className={classes.ProfileSection__name}>
        <h3>
          {props.firstName}&nbsp;{props.lastName}
        </h3>
        <small>{props.username}</small>
      </div>
      <div className={classes.ProfileSection__about}>
        About me lorem epsum is the widest known dummy text that you should also
        use in your developement to show dummy data.
      </div>
      <div className={classes.ProfileSection__edit}>Edit</div>
      <div className={classes.ProfileSection__action}>
        <ul>
          <NavLink
            to={`/profile/${props.username}?feed=posts`}
            className={props.feedQuery !== "likes" ? classes.activeNav : ""}
          >
            <li>Public Posts</li>
          </NavLink>

          <NavLink
            to={`/profile/${props.username}?feed=likes`}
            className={props.feedQuery === "likes" ? classes.activeNav : ""}
          >
            <li>Liked Posts</li>
          </NavLink>
        </ul>
      </div>
    </>
  );
};

export default ProfileSection;
