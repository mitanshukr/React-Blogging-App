// import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ProfilePicture from "../User/Profile/ProfilePicture";
import Input from "../UI/Input/Input";
import classes from "./ProfileLayout.module.css";

const ProfileLayout = (props) => {
  return (
    <div className={classes.ProfileLayout}>
      <div className={classes.ProfileLayout__col1}>
        <ProfilePicture />
        <div className={classes.ProfileLayout__name}>
          <h3>
            {props.firstName}&nbsp;{props.lastName}
          </h3>
          <small>{props.userName}</small>
        </div>
        <div className={classes.ProfileLayout__about}>
          {"@" + props.currentUser === props.userName || props.about ? (
            <Input
              key={props.aboutEditModeOn}
              elementType="textarea"
              elementConfig={{
                name: "about",
                placeholder: "Introduce yourself...",
                style: props.aboutEditModeOn
                  ? { border: "1.5px solid grey" }
                  : null,
                disabled: !props.aboutEditModeOn,
                autoFocus: props.aboutEditModeOn,
                ref: (elem) => props.aboutHeightCalc(elem),
              }}
              onChange={props.aboutOnChangeHandler}
              value={props.about}
            />
          ) : null}
          {"@" + props.currentUser !== props.userName ? (
            <button
              className={classes.ProfileLayout__edit}
              onClick={() => {
                alert("Feature not available yet. Stay Tuned!");
              }}
            >
              Follow
            </button>
          ) : (
            <button
              className={classes.ProfileLayout__edit}
              onClick={props.editBtnClickHandler}
            >
              {props.aboutEditModeOn ? "OK" : "Edit Bio"}
            </button>
          )}

          {props.aboutEditModeOn ? (
            <button
              className={`${classes.ProfileLayout__edit} ${classes.ProfileLayout__editCancel}`}
              onClick={props.editBtnClickHandler}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <ul>
          {Object.keys(props.menuItems).map((item) => {
            return (
              <li key={item}>
                {props.menuItems[item].disabled ? (
                  <span className={classes.disabledNav}>
                    {props.menuItems[item].name}
                  </span>
                ) : (
                  <NavLink
                    to={`/ink/${props.userName}?feed=${item}`}
                    className={
                      props.queryParam === item ? classes.activeNav : null
                    }
                  >
                    {props.menuItems[item].name}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={classes.ProfileLayout__col2}>{props.children}</div>
    </div>
  );
};

export default ProfileLayout;
