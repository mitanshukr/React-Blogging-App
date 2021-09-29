import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "./GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./GetPosts.module.css";

import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../utils/editPostHandler";
import getSinglePostHandler from "../utils/getSinglePostHandler";
import deletePostHandler from "../utils/deletePostHandler";
import { showNotification } from "../../../store/actions";
import getPostURI from "../utils/getPostsURIHandler";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import savePostHandler from "../utils/savePostHandler";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";
import getErrorStatusCode from "../utils/errorHandler";

// let isMounted = true;

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

  // componentWillUnmount() {
  //   isMounted = false;
  // }

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
        this.setState({ localError: getErrorStatusCode(err) });
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
        this.props.showNotification(
          "Unable to Load. Please try again!",
          "ERROR"
        );
      });
  };

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

  savePostToggler = (status, postId) => {
    const updatedPosts = cloneDeep(this.state.posts);
    const prevState = cloneDeep(this.state);
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
        this.setState({ ...prevState });
      });
  };

  singlePostDeletion = (e, postId) => {
    e.stopPropagation();
    const postsArr = cloneDeep(this.state.posts);
    const prevState = cloneDeep(this.state);
    const deletedPostIndex = postsArr.findIndex((post) => post._id === postId);
    postsArr.splice(deletedPostIndex, 1);

    this.setState({ posts: postsArr });
    if (postsArr.length === 0 && this.state.remainingPosts > 0) {
      this.loadMoreHandler();
    }

    deletePostHandler(this.props.authToken, postId)
      .then((res) => {
        this.props.showNotification("Post deleted Successfully!", "SUCCESS");
      })
      .catch((err) => {
        this.props.showNotification("Failed to Delete. Try again!", "ERROR");
        this.setState({ ...prevState });
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
          {this.state.posts?.length !== 0 ? (
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
    showNotification: (message, visibility) =>
      dispatch(showNotification(message, visibility)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GetPosts));
