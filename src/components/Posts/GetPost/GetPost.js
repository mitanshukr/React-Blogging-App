import ProfileIcon from "../../User/ProfileIcon/ProfileIcon";
import Aux from "../../../hoc/Auxiliary";
import getDateFormat from "../../../Utility/getDateFormat";
import classes from "./GetPost.module.css";

import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";

const getPost = (props) => {
  const postDate = getDateFormat(props.date);
  return (
    <div className={classes.GetPost}>
      <div className={classes.GetPost__head}>
        <section>
          <ProfileIcon
            firstLetter={props.firstName?.split("")[0]}
            lastLetter={props.lastName?.split("")[0]}
          />
          <small>
            {props.firstName}&nbsp;{props.lastName}
          </small>
        </section>
        <section>
          <FaRegBookmark title="Save" />
          <BiDotsVerticalRounded
            size={20}
            style={{ cursor: "auto" }}
            title="Actions"
          />
        </section>
      </div>
      <div className={classes.GetPost__main}>
        <h2 onClick={props.clicked}>{props.title}</h2>
        <p>{props.excerpt}</p>
        <div onClick={props.clicked}>Read</div>
      </div>
      <div className={classes.GetPost__info}>
        <section>
          <small title="Publish Date">{postDate}&nbsp;&#183;&nbsp;</small>
          {props.isPrivate ? (
            <small title="Private" style={{ color: "grey", cursor: "auto" }}>
              Private
            </small>
          ) : (
            <small
              onClick={props.share}
              className={classes[`GetPost__info--share`]}
              title="Share"
            >
              Share
            </small>
          )}
          {props.isCurrentUser ? (
            <Aux>
              <small
                title="Edit"
                onClick={props.edit}
                className={classes[`GetPost__info--edit`]}
              >
                &nbsp;&#183;&nbsp;Edit&nbsp;&#183;&nbsp;
              </small>
              <small
                title="Delete"
                onClick={props.delete}
                className={classes[`GetPost__info--delete`]}
              >
                Delete
              </small>
            </Aux>
          ) : null}
        </section>
        <section>
          <small title="Like Count">
            {props.likeCount} {props.likeCount <= 1 ? "Like" : "Likes"}
            &nbsp;&#183;&nbsp;
          </small>
          <small title="View Count">
            {props.viewCount} {props.viewCount === 1 ? "View" : "Views"}
          </small>
        </section>
      </div>
    </div>
  );
};

export default getPost;
