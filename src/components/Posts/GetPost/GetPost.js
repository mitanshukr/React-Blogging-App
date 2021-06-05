import ProfileIcon from "../../User/ProfileIcon/ProfileIcon";
import Aux from "../../../hoc/Auxiliary";
import getDateFormat from "../../../Utility/getDateFormat";
import classes from "./GetPost.module.css";

const getPost = (props) => {
  const postDate = getDateFormat(props.date);
  return (
    <div className={classes.GetPost} >
      <div>
        <ProfileIcon 
        firstLetter={props.firstName?.split('')[0]}
        lastLetter={props.lastName?.split('')[0]}
        />
        <small>{props.firstName}&nbsp;{props.lastName}</small>
      </div>
      <h2 onClick={props.clicked}>{props.title}</h2>
      <p>{props.excerpt}</p>
      <div onClick={props.clicked}>Read</div>
      <div>
      <small>{postDate}&nbsp;&#183;&nbsp;</small>
      {props.isPrivate ? <small title="Private" style={{color: 'grey', cursor: 'auto'}}>Private</small> : 
      <small onClick={props.share} title="Share">Share</small>}
      {
        props.isCurrentUser ?
        <Aux>
          <small title="Edit" onClick={props.edit}>&nbsp;&#183;&nbsp;Edit&nbsp;&#183;&nbsp;</small>
          <small title="Delete" onClick={props.delete}>Delete</small>
        </Aux>
        : null
      }
      </div>

    </div>
  );
};

export default getPost;
