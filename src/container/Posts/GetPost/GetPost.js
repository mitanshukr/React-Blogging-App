import React from "react";
import ProfileIcon from "../../../components/User/ProfileIcon/ProfileIcon";
import Aux from "../../../hoc/Auxiliary";
import getDateFormat from "../../../Utility/getDateFormat";
import classes from "./GetPost.module.css";

import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { connect } from "react-redux";
import { postSaveToggler } from "../../../store/actions";

class GetPost extends React.Component {
  savePostToggler(status, postId) {
    this.props.savePostDispatcher(status, postId, this.props.authToken);
  }

  render() {
    const postDate = getDateFormat(this.props.date);
    const isPostSaved = !!this.props.savedPosts.find(
      (postId) => postId === this.props.postId
    );
    return (
      <div className={classes.GetPost}>
        <div className={classes.GetPost__head}>
          <section>
            <ProfileIcon
              firstLetter={this.props.firstName?.split("")[0]}
              lastLetter={this.props.lastName?.split("")[0]}
            />
            <small>
              {this.props.firstName}&nbsp;{this.props.lastName}
            </small>
          </section>
          <section>
            {this.props.isAuthenticated ? (
              isPostSaved ? (
                <FaBookmark
                  onClick={this.savePostToggler.bind(
                    this,
                    "REMOVE",
                    this.props.postId
                  )}
                  title="Remove from Saved Items"
                />
              ) : (
                <FaRegBookmark
                  onClick={this.savePostToggler.bind(
                    this,
                    "ADD",
                    this.props.postId
                  )}
                  title="Save"
                />
              )
            ) : (
              ""
            )}
            <BiDotsVerticalRounded
              size={20}
              style={{ cursor: "auto" }}
              title="Actions"
            />
          </section>
        </div>
        <div className={classes.GetPost__main}>
          <h2 onClick={this.props.clicked}>{this.props.title}</h2>
          <p>{this.props.excerpt}</p>
          <div onClick={this.props.clicked}>Read</div>
        </div>
        <div className={classes.GetPost__info}>
          <section>
            <small title="Publish Date">{postDate}&nbsp;&#183;&nbsp;</small>
            {this.props.isPrivate ? (
              <small title="Private" style={{ color: "grey", cursor: "auto" }}>
                Private
              </small>
            ) : (
              <small
                onClick={this.props.share}
                className={classes[`GetPost__info--share`]}
                title="Share"
              >
                Share
              </small>
            )}
            {this.props.isCurrentUser ? (
              <Aux>
                <small
                  title="Edit"
                  onClick={this.props.edit}
                  className={classes[`GetPost__info--edit`]}
                >
                  &nbsp;&#183;&nbsp;Edit&nbsp;&#183;&nbsp;
                </small>
                <small
                  title="Delete"
                  onClick={this.props.delete}
                  className={classes[`GetPost__info--delete`]}
                >
                  Delete
                </small>
              </Aux>
            ) : null}
          </section>
          <section>
            <small title="Like Count">
              {this.props.likeCount}{" "}
              {this.props.likeCount <= 1 ? "Like" : "Likes"}
              &nbsp;&#183;&nbsp;
            </small>
            {this.props.isPrivate ? (
              <small>Secret</small>
            ) : (
              <small title="View Count">
                {this.props.viewCount}{" "}
                {this.props.viewCount === 1 ? "View" : "Views"}
              </small>
            )}
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    savedPosts: state.savedPosts,
    authToken: state.authToken,
    isAuthenticated: state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    savePostDispatcher: (status, postId, authToken) =>
      dispatch(postSaveToggler(status, postId, authToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GetPost);
