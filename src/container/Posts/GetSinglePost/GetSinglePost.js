import { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router";
import axios from "../../../axios-instance";
import parse from "html-react-parser";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./GetSinglePost.module.css";
import { getBlogDateFormat } from "../../../Utility/getDateFormat";
import ProfileIcon from "../../../components/User/Profile/ProfileIcon";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../utils/editPostHandler";
import { showNotification } from "../../../store/actions";
// import { BiShare, BiLockAlt, BiDotsVerticalRounded } from "react-icons/bi";
import { FiShare, FiLock, FiMoreVertical } from "react-icons/fi";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import Tag from "../../../components/UI/TagStyler/Tag";
import { Link, withRouter } from "react-router-dom";
import savePostHandler from "../utils/savePostHandler";
import { cloneDeep } from "lodash";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";
import getErrorStatusCode from "../utils/errorHandler";

class GetSinglePost extends Component {
  state = {
    post: null,
    isPostLiked: null,
    likeCount: 0,
    viewCount: 0,
    localError: null,
  };

  componentWillUnmount() {
    clearTimeout(this.viewTimer);
  }

  componentDidMount() {
    let URI = null;
    this.postId = this.props.match.params.postId;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    // const isPrivate = this.props.history.location?.state?.isPrivate === true;

    if (isPrivate) {
      URI = `/post/private/${this.postId}`;
    } else {
      URI = `/post/public/${this.postId}`;
    }

    axios
      .get(URI, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        const isPostLiked = !!response?.data.likes.find(
          (id) => id.toString() === this.props.userId
        );
        this.setState({
          post: response?.data,
          isPostLiked: isPostLiked,
          likeCount: response?.data.likes.length,
          viewCount: +response?.data.viewCount,
        });
        if (response?.data && !response?.data?.isPrivate) {
          this.viewTimer = setTimeout(() => {
            axios
              .get(`/post/addview/${response?.data?._id}`)
              .then((response) => {
                this.setState((prevState) => {
                  return { viewCount: prevState.viewCount + 1 };
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }, 8000);
        }
      })
      .catch((err) => {
        this.setState({ localError: getErrorStatusCode(err) });
      });
  }

  sharePostHandler = (e, postId) => {
    e.stopPropagation();
    copyToClipboard(e, postId)
      .then((res) => {
        this.props.showNotification("Link Copied to Clipboard!", "SUCCESS");
      })
      .catch((err) => {
        this.props.showNotification("Failed to Copy the Post URL!", "ERROR");
      });
  };

  savePostToggler(status, postId) {
    // if (!this.props.isAuthenticated) {
    //   this.props.showNotification("Please Login to Save this Post.", "ERROR");
    //   return;
    // }
    const updatedPost = cloneDeep(this.state.post);
    const prevPostState = cloneDeep(this.state.post);
    if (status === "ADD") {
      updatedPost.savedby.push(this.props.userId);
    } else if (status === "REMOVE") {
      const savedUserIdIndex = updatedPost.savedby.findIndex(
        (userId) => userId === this.props.userId
      );
      updatedPost.savedby.splice(savedUserIdIndex, 1);
    }
    this.setState({ post: updatedPost });

    savePostHandler(this.props.authToken, postId)
      .then((response) => {
        this.props.showNotification(response.data.message, "SUCCESS");
      })
      .catch((err) => {
        if (status === "REMOVE") {
          this.props.showNotification(
            "Failed to Remove from Saved Items.",
            "ERROR"
          );
        }
        if (status === "ADD") {
          this.props.showNotification("Failed to Add to Saved Items.", "ERROR");
        }
        this.setState({ post: prevPostState });
      });
  }

  likeToggleHandler = () => {
    if (!this.props.isAuthenticated) {
      this.props.showNotification("Please Login to Like the Post.", "ERROR");
      return;
    }
    if (this.likeStatusQueued) return;
    let prevLikeState = null;
    this.likeStatusQueued = true;
    this.setState((prevState) => {
      prevLikeState = {
        likeCount: prevState.likeCount,
        isPostLiked: prevState.isPostLiked,
      };
      if (prevState.isPostLiked) {
        return { likeCount: prevState.likeCount - 1, isPostLiked: false };
      } else {
        return { likeCount: prevState.likeCount + 1, isPostLiked: true };
      }
    });

    axios
      .get(`/post/togglelike/${this.postId}`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        let message = null;
        if (response.data?.likeStatus) {
          message = "Post Liked Successfully!";
        } else {
          message = "Like removed Successfully!";
        }
        this.props.showNotification(message, "SUCCESS");
        this.likeStatusQueued = false;
      })
      .catch((err) => {
        let message = null;
        if (prevLikeState.isPostLiked) {
          message = "Failed to remove Like! Please try again.";
        } else {
          message = "Failed to Like! Please try again.";
        }
        this.props.showNotification(message, "ERROR");
        this.setState({ ...prevLikeState });
        this.likeStatusQueued = false;
      });
  };

  render() {
    let post = <Spinner />;
    if (this.state.localError) {
      post = <ErrorSvg status={this.state.localError} src="SINGLE_POST" />;
    }
    if (this.state.post) {
      const postDate = getBlogDateFormat(this.state.post.createdAt);
      post = (
        <div className={classes.GetSinglePost}>
          <div className={classes.GetSinglePost__title}>
            <h1>{this.state.post.title}</h1>
          </div>
          <div className={classes.GetSinglePost__excerpt}>
            <p>{this.state.post.excerpt}</p>
          </div>
          <div>
            <span>
              <ProfileIcon
                firstLetter={this.state.post.creator.firstName?.split("")[0]}
                lastLetter={this.state.post.creator.lastName?.split("")[0]}
              />
              <small>
                <Link
                  title="Visit Profile"
                  to={`/ink/@${this.state.post.creator.userName}`}
                >
                  {this.state.post.creator.firstName}&nbsp;
                  {this.state.post.creator.lastName}
                </Link>
              </small>
              <small
                className={classes.postDate}
                title={new Date(this.state.post.createdAt).toString()}
              >
                &nbsp;&#183;&nbsp;{postDate}
              </small>
              {this.state.post.creator._id === this.props.userId ? (
                <small>
                  &nbsp;&#183;&nbsp;
                  <span
                    className={classes.editLink}
                    onClick={(e) =>
                      editPostHandler(
                        e,
                        this.props,
                        this.state.post._id,
                        this.state.post.isPrivate
                      )
                    }
                  >
                    Edit
                  </span>
                </small>
              ) : (
                ""
              )}
            </span>
            <span className={classes.GetSinglePost__icons}>
              {this.state.post.isPrivate ? (
                <small>
                  <FiLock
                    title="Private Post"
                    size={20}
                    style={{ cursor: "auto", color: "inherit" }}
                  />
                </small>
              ) : (
                <small
                  onClick={(e) => this.sharePostHandler(e, this.state.post._id)}
                >
                  <FiShare title="Share this Post" size={20} />
                </small>
              )}
              <small>
                {this.props.isAuthenticated ? (
                  this.state.post.savedby.find(
                    (userId) => userId === this.props.userId
                  ) ? (
                    <BsBookmarkFill
                      size={20}
                      onClick={this.savePostToggler.bind(
                        this,
                        "REMOVE",
                        this.state.post._id
                      )}
                      title="Remove from Saved Items"
                    />
                  ) : (
                    <BsBookmarkPlus
                      size={20}
                      onClick={this.savePostToggler.bind(
                        this,
                        "ADD",
                        this.state.post._id
                      )}
                      title="Save"
                    />
                  )
                ) : null}
              </small>
              <small onClick={() => alert("No Info! Stay Tuned...")}>
                <FiMoreVertical
                  size={20}
                  style={{ cursor: "auto" }}
                  title="Actions (Inactive)"
                />
              </small>
            </span>
          </div>
          <div className={classes.GetSinglePost__body}>
            {parse(this.state.post.body)}
          </div>
          <hr />
          <div className={classes.GetSinglePost__stats}>
            <div className={classes.GetSinglePost__likes}>
              {this.state.isPostLiked ? (
                <BsFillHeartFill
                  title="Remove Like"
                  onClick={this.likeToggleHandler}
                  size={20}
                />
              ) : (
                <BsHeart
                  title="Like"
                  onClick={this.likeToggleHandler}
                  size={20}
                />
              )}
              <p>
                {this.state.likeCount}{" "}
                {this.state.likeCount <= 1 ? "like" : "likes"}
              </p>
            </div>
            <div className={classes.GetSinglePost__views}>
              {this.state.post.isPrivate ? (
                <p>Secret</p>
              ) : (
                <p title="Views Count">
                  {this.state.viewCount}{" "}
                  {this.state.viewCount === 1 ? "View" : "Views"}
                </p>
              )}
            </div>
          </div>
          <div>
            {this.state.post.tags.map((tag) => (
              <Tag key={Math.random()}>{tag}</Tag>
            ))}
          </div>
          <div className={classes.GetSinglePost__comments}>
            Comment Feature will be added in next Major release.{" "}
            <a href="/">Give Feedback</a>
          </div>
        </div>
      );
    }

    return post;
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message, type) =>
      dispatch(showNotification(message, type)),
  };
};

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(GetSinglePost));
