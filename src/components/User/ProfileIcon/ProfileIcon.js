import classes from "./ProfileIcon.module.css";

const profileIcon = props => {
  return (
    <div className={classes.ProfileIcon} >
      <p>
        {props.firstLetter}
        {props.lastLetter}
      </p>
    </div>
  );
}

export default profileIcon;