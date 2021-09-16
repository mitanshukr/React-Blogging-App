import { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router";
import axios from "../../../axios-instance";
import parse from "html-react-parser";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetSinglePost.module.css";
import getDateFormat from "../../../Utility/getDateFormat";
import ProfileIcon from "../../../components/User/Profile/ProfileIcon";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../utils/editPostHandler";
import { postSaveToggler, showNotification } from "../../../store/actions";

// import { BiShare, BiLockAlt, BiDotsVerticalRounded } from "react-icons/bi";
import { FiShare, FiLock } from "react-icons/fi";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import Tag from "../../../components/UI/TagStyler/Tag";
import { Link, withRouter } from "react-router-dom";

class GetSinglePost extends Component {
  state = {
    post: null,
    isPostLiked: null,
    likeCount: 0,
    viewCount: 0,
    accessDenied: false,
    localError: null,
  };

  componentDidMount() {
    let URI = null;
    console.log(this.props.match);
    this.postId = this.props.match.params.postId;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    if (isPrivate) {
      URI = `http://localhost:8000/post/private/${this.postId}`;
    } else {
      URI = `http://localhost:8000/post/public/${this.postId}`;
    }

    axios
      .get(URI, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        if (!response?.data) {
          this.setState({ accessDenied: true });
        }
        console.log(response?.data);
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
              .get(`http://localhost:8000/post/addview/${response?.data?._id}`)
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
        console.log(err);
        this.setState({ localError: err.message });
      });
  }

  sharePostHandler = (e, postId) => {
    e.stopPropagation();
    this.props.showNotif("Link Copied to Clipboard!", true);
    copyToClipboard(e, postId);
    this.notifTimer = setTimeout(() => {
      this.props.showNotif("Link Copied to Clipboard!", false);
    }, 2000);
  };

  componentWillUnmount() {
    // clearTimeout(this.notifTimer);
    clearTimeout(this.likeTimer);
    clearTimeout(this.viewTimer);
  }

  savePostToggler(status, postId) {
    this.props.savePostDispatcher(status, postId, this.props.authToken);
  }

  likeToggleHandler = () => {
    // if(!this.props.isAuthenticated){
    //   this.props.saveRedirectPath(window.location.pathname);
    //   this.props.history.push("/login");
    // }
    if (this.likeStatusQueued) {
      return;
    }
    this.likeStatusQueued = true;
    this.setState((prevState) => {
      if (prevState.isPostLiked) {
        return { likeCount: prevState.likeCount - 1, isPostLiked: false };
      } else {
        return { likeCount: prevState.likeCount + 1, isPostLiked: true };
      }
    });
    axios
      .get(`http://localhost:8000/post/togglelike/${this.postId}`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        let message = null;
        if (response.data.likeStatus) {
          message = "Post Liked Successfully!";
        } else {
          message = "Like removed Successfully!";
        }
        this.props.showNotif(message, true);
        this.likeTimer = setTimeout(() => {
          this.likeStatusQueued = false;
          this.props.showNotif(message, false);
        }, 1000);
      })
      .catch((err) => {
        this.likeStatusQueued = false;
        console.log(err);
        this.setState({ localError: err.message });
      });
  };

  render() {
    const isPostSaved = !!this.props.savedPosts.find(
      (postId) => postId === this.postId
    );
    let post = <Spinner />;
    if (this.state.accessDenied) {
      post = (
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2>403 : Access Denied!</h2>
          <p>Private posts can be viewed only by its original creators.</p>
        </div>
      );
    } else if (this.state.post) {
      const postDate = getDateFormat(this.state.post.createdAt);
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
                  to={`/profile/@${this.state.post.creator.userName}`}
                >
                  {this.state.post.creator.firstName}&nbsp;
                  {this.state.post.creator.lastName}
                </Link>
              </small>
              <small className={classes.postDate}>
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
            <span>
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
              <small className={classes.bookmarkIcons}>
                {this.props.isAuthenticated ? (
                  isPostSaved ? (
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
                ) : (
                  ""
                )}
                {/* <BiDotsVerticalRounded
              size={20}
              style={{ cursor: "auto" }}
              title="Actions"
            /> */}
              </small>
            </span>
          </div>
          <div>{parse(this.state.post.body)}</div>
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
        </div>
      );
    } else if (this.state.localError) {
      post = (
        <div>
          <p>{this.state.localError}</p>
          <Spinner />
        </div>
      );
    }
    // else if(!this.props.isAuthenticated){
    //     post = <Redirect to="/login" />
    // }

    return post;
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
    savedPosts: state.savedPosts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotif: (message, visibility) =>
      dispatch(showNotification(message, visibility)),
    savePostDispatcher: (status, postId, authToken) =>
      dispatch(postSaveToggler(status, postId, authToken)),
    // saveRedirectPath: (path) => dispatch(redirectPathHandler(path)),
  };
};

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(withErrorHandler(GetSinglePost, axios)));
