import React from "react";
import ProfileIcon from "../../../components/User/ProfileIcon/ProfileIcon";
import Aux from "../../../hoc/Auxiliary";
import getDateFormat from "../../../Utility/getDateFormat";
import classes from "./GetPost.module.css";

// import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { connect } from "react-redux";
import { postSaveToggler } from "../../../store/actions";
import DeletePost from "../../../components/UI/DeletePost/DeletePost";

class GetPost extends React.Component {
  state = {
    deletePost: false,
    deleteCount: null,
  };

  savePostToggler(status, postId) {
    this.props.savePostDispatcher(status, postId, this.props.authToken);
  }

  initDeleteHandler = (e) => {
    this.setState({ deletePost: true });
  };

  cancelDeleteHandler = (e) => {
    this.setState({ deletePost: false, deleteCount: null });
    clearInterval(this.deleteCountdown);
    clearTimeout(this.deleteTimer);
  };

  deletePostHandler = (e) => {
    this.setState({ deleteCount: 5 });
    this.deleteCountdown = setInterval(() => {
      this.setState((prevState) => {
        return { deleteCount: prevState.deleteCount - 1 };
      });
    }, 1000);

    this.deleteTimer = setTimeout(() => {
      this.props.delete(e);
      clearInterval(this.deleteCountdown);
      this.setState({ deletePost: false, deleteCount: null });
    }, 5000);
  };

  render() {
    const postDate = getDateFormat(this.props.date);
    const isPostSaved = !!this.props.savedPosts.find(
      (postId) => postId === this.props.postId
    );
    return (
      <div className={classes.GetPost}>
        {this.state.deletePost ? (
          <DeletePost
            deleteCount={this.state.deleteCount}
            onDelete={this.deletePostHandler}
            onCancel={this.cancelDeleteHandler}
          />
        ) : (
          ""
        )}
        <div className={classes.GetPost__head}>
          <section>
            {this.props.profilePage ? (
              ""
            ) : (
              <>
                <ProfileIcon
                  firstLetter={this.props.firstName?.split("")[0]}
                  lastLetter={this.props.lastName?.split("")[0]}
                />
                <small>
                  {this.props.firstName}&nbsp;{this.props.lastName}
                </small>
              </>
            )}
          </section>
          <section>
            {this.props.isAuthenticated ? (
              isPostSaved ? (
                <BsBookmarkFill
                  onClick={this.savePostToggler.bind(
                    this,
                    "REMOVE",
                    this.props.postId
                  )}
                  title="Remove from Saved Items"
                />
              ) : (
                <BsBookmarkPlus
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
            {/* <BiDotsVerticalRounded
              size={20}
              style={{ cursor: "auto" }}
              title="Actions"
            /> */}
          </section>
        </div>
        <div className={classes.GetPost__main}>
          <h2 onClick={this.props.clicked}>{this.props.title}</h2>
          <p>{this.props.excerpt}</p>
          <button
            onClick={this.props.clicked}
            className={`${classes[`GetPost__main--read`]} ${
              this.props.profilePage ? classes[`GetPost__main--readLight`] : ""
            }`}
          >
            Read
          </button>
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
                  // onClick={this.props.delete}
                  onClick={this.initDeleteHandler}
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
