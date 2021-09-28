import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "./GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetPosts.module.css";

import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../utils/editPostHandler";
import getSinglePostHandler from "../utils/getSinglePostHandler";
import deletePostHandler from "../utils/deletePostHandler";
import { showNotification } from "../../../store/actions";
import getPostURI from "../utils/getPostsURIHandler";
import { withRouter } from "react-router-dom";
import ServerDown from "../../../components/UI/SvgImages/ServerDown503";
import { cloneDeep } from "lodash";
import savePostHandler from "../utils/savePostHandler";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";

class GetPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      leftOffpostId: null,
      remainingPosts: null,
      serverBusy: false,
      localError: null,
    };
  }

  componentDidMount() {
    this.setState({ serverBusy: true });
    axios
      .get(
        getPostURI(this.props.type, this.props.userId, this.props.userName),
        {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }
      )
      .then((response) => {
        const posts = response.data.posts;
        this.setState({
          posts: posts,
          leftOffpostId: response.data.leftOffId,
          remainingPosts: response.data.remaining,
          serverBusy: false,
        });
      })
      .catch((err) => {
        if (err.response?.status) {
          this.setState({ localError: +err.response?.status });
        } else if (err.message.toLowerCase().includes("network error")) {
          this.setState({ localError: -1 });
        } else {
          this.setState({ localError: -2 });
        }
        this.setState({ serverBusy: false });
      });
  }

  loadMoreHandler = () => {
    if (this.loadingMore) return;
    this.loadingMore = true;
    axios
      .get(
        getPostURI(
          this.props.type,
          this.props.userId,
          this.props.userName,
          this.state.leftOffpostId
        ),
        {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }
      )
      .then((response) => {
        const newPosts = response.data.posts;
        this.setState((prevState) => {
          return {
            posts: prevState.posts.concat(newPosts),
            leftOffpostId: response.data.leftOffId,
            remainingPosts: response.data.remaining,
          };
        });
        this.loadingMore = false;
      })
      .catch((err) => {
        this.loadingMore = false;
        console.log(err);
      });
  };

  sharePostHandler = (e, postId) => {
    e.stopPropagation();
    copyToClipboard(e, postId);
    this.props.showNotif("Link Copied to Clipboard!", true);
    this.notifTimer = setTimeout(() => {
      this.props.showNotif("Link Copied to Clipboard!", false);
    }, 2000);
  };

  savePostToggler = (status, postId) => {
    const updatedPosts = cloneDeep(this.state.posts);
    const postIndex = updatedPosts.findIndex((post) => post._id === postId);
    if (status === "ADD") {
      updatedPosts[postIndex].savedby.push(this.props.userId);
    } else if (status === "REMOVE") {
      const savedUserIdIndex = updatedPosts[postIndex].savedby.findIndex(
        (userId) => userId === this.props.userId
      );
      updatedPosts[postIndex].savedby.splice(savedUserIdIndex, 1);
      if (this.props.type === "SAVED_ITEMS") {
        updatedPosts.splice(postIndex, 1);
      }
    }
    this.setState({ posts: updatedPosts });

    savePostHandler(this.props.authToken, postId)
      .then((response) => {
        this.props.showNotif(response.data.message, true);
        setTimeout(() => {
          this.props.showNotif(response.data.message, false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  singlePostDeletion = (e, postId) => {
    e.stopPropagation();
    const postsArr = cloneDeep(this.state.posts);
    const deletedPostIndex = postsArr.findIndex((post) => post._id === postId);
    postsArr.splice(deletedPostIndex, 1);

    this.setState({ posts: postsArr });
    if (this.state.posts.length === 0 && this.state.remainingPosts > 0) {
      this.loadMoreHandler();
    }

    deletePostHandler(this.props.authToken, postId)
      .then((status) => {
        this.props.showNotif("Post deleted Successfully!", true);
        setTimeout(() => {
          this.props.showNotif("Post deleted Successfully!", false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let posts = null;
    if (this.state.serverBusy) {
      posts = <Spinner />;
    }
    if (this.state.localError) {
      posts = <ErrorSvg status={this.state.localError} />;
    }
    if (this.state.posts) {
      posts = (
        <div className={classes.GetPosts}>
          {this.state.posts.length !== 0 ? (
            <>
              {this.state.posts.map((post) => {
                return (
                  <GetPost
                    key={post._id}
                    postId={post._id}
                    title={post.title}
                    excerpt={post.excerpt}
                    body={post.body}
                    date={post.createdAt}
                    isPrivate={post.isPrivate}
                    firstName={post.creator?.firstName}
                    lastName={post.creator?.lastName}
                    userName={`@${post.creator?.userName}`}
                    likeCount={post.likes.length}
                    viewCount={post.viewCount}
                    isSaved={post.savedby.find(
                      (userId) => userId === this.props.userId
                    )}
                    isCurrentUser={post.creator?._id === this.props.userId}
                    isProfilePost={this.props.type === "PROFILE_POSTS"}
                    savePostToggler={this.savePostToggler}
                    onClick={(e) =>
                      getSinglePostHandler(
                        e,
                        this.props,
                        post._id,
                        post.isPrivate
                      )
                    }
                    edit={(e) =>
                      editPostHandler(e, this.props, post._id, post.isPrivate)
                    }
                    share={(e) => this.sharePostHandler(e, post._id)}
                    delete={(e) => this.singlePostDeletion(e, post._id)}
                  />
                );
              })}
              {this.state.remainingPosts > 0 ? (
                <div
                  className={classes.GetPosts__LoadMore}
                  onClick={this.loadMoreHandler}
                >
                  <p>Load More</p>
                </div>
              ) : null}
            </>
          ) : (
            this.props.children
          )}
        </div>
      );
    }

    return posts;
  }
}

const mapStateToProps = (state) => {
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GetPosts));
