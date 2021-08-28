import { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router";
import axios from "../../../axios-instance";
import parse from "html-react-parser";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetSinglePost.module.css";
import getDateFormat from "../../../Utility/getDateFormat";
import ProfileIcon from "../../../components/User/ProfileIcon/ProfileIcon";
import getPostShareHandler from "../../../Utility/copyToClipboardHandler";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";

import { BiShare, BiLockAlt, BiDotsVerticalRounded } from "react-icons/bi";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import { showNotification } from "../../../store/actions";

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
    this.postId = this.props.match.params.postId;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    if (isPrivate) {
      URI = `http://localhost:8000/post/private/${this.postId}`;
    } else {
      URI = `http://localhost:8000/post/${this.postId}`;
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
    clearTimeout(this.notifTimer);
    clearTimeout(this.likeTimer);
    clearTimeout(this.viewTimer);
  }

  likeToggleHandler = () => {
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
          <h1>{this.state.post.title}</h1>
          <div>
            <span>
              <ProfileIcon
                firstLetter={this.state.post.creator.firstName?.split("")[0]}
                lastLetter={this.state.post.creator.lastName?.split("")[0]}
              />
              <small>
                {this.state.post.creator.firstName}&nbsp;
                {this.state.post.creator.lastName}
              </small>
              <small>&nbsp;&#183;&nbsp;{postDate}</small>
            </span>
            <span>
              {this.state.post.isPrivate ? (
                <small>
                  <BiLockAlt
                    title="Private Post"
                    size={20}
                    style={{ cursor: "auto", color: "inherit" }}
                  />
                </small>
              ) : (
                <small
                  onClick={(e) => this.sharePostHandler(e, this.state.post._id)}
                >
                  <BiShare title="Share this Post" size={20} />
                </small>
              )}
              <small>
                &nbsp;
                <BiDotsVerticalRounded size={20} />
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
            <div title="Views Count" className={classes.GetSinglePost__views}>
              <p>
                {this.state.viewCount}{" "}
                {this.state.viewCount === 1 ? "View" : "Views"}
              </p>
            </div>
          </div>
          <div>
            <small>{this.state.post.tags}</small>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotif: (message, visibility) =>
      dispatch(showNotification(message, visibility)),
  };
};

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withErrorHandler(GetSinglePost, axios));
