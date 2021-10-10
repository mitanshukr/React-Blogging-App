// import { FaRegUser } from "react-icons/fa";
import ProfilePicture from "../User/Profile/ProfilePicture";
import Input from "../UI/Input/Input";
import classes from "./ProfileLayout.module.css";
import PageSubMenu from "../UI/PageSubMenu/PageSubMenu";

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
              errorMsg={props.aboutErrorMsg}
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

        <PageSubMenu
          urlPathname={`/ink/${props.userName}`}
          menuItems={props.menuItems}
          queryParam={props.queryParam}
        />
      </div>
      <div className={classes.ProfileLayout__col2}>{props.children}</div>
    </div>
  );
};

export default ProfileLayout;
