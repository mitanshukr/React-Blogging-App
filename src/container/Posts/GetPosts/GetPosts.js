import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetPosts.module.css";

import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../Utility/editPostHandler";
import getSinglePostHandler from "../Utility/getSinglePostHandler";
import deletePostHandler from "../Utility/deletePostHandler";
import { postSaveToggler, showNotification } from "../../../store/actions";
import getPostURI from "../Utility/getPostsURIHandler";
import { withRouter } from "react-router-dom";

class GetPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      serverBusy: false,
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
        const posts = response.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.setState({ posts: posts, serverBusy: false });

        if (this.props.type === "SAVED_ITEMS") {
          const postIdArr = posts.map((post) => post?._id);
          this.props.savePostDispatcher("UPDATE", null, null, postIdArr);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ serverBusy: false });
      });
  }

  savePostToggler = (status, postId) => {
    this.props.savePostDispatcher(status, postId, this.props.authToken, null);
    if (this.props.type === "SAVED_ITEMS" && status === "REMOVE") {
      const postIndex = this.state.posts.findIndex(
        (post) => post._id === postId
      );
      const updatedPosts = [...this.state.posts];
      updatedPosts.splice(postIndex, 1);
      this.setState({ posts: updatedPosts });
    }
  };

  sharePostHandler = (e, postId) => {
    e.stopPropagation();
    copyToClipboard(e, postId);
    this.props.showNotif("Link Copied to Clipboard!", true);
    this.notifTimer = setTimeout(() => {
      this.props.showNotif("Link Copied to Clipboard!", false);
    }, 2000);
  };

  singlePostDeletion = (e, postId) => {
    e.stopPropagation();
    const postsArr = [...this.state.posts];
    const deletedPostIndex = postsArr.findIndex((post) => post._id === postId);
    postsArr.splice(deletedPostIndex, 1);
    this.setState({ posts: postsArr });

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

    if (this.state.posts) {
      posts = (
        <div className={classes.GetPosts}>
          {this.state.posts.length !== 0
            ? this.state.posts.map((post) => {
                return (
                  <GetPost
                    key={post._id}
                    postId={post._id}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.createdAt}
                    isPrivate={post.isPrivate}
                    firstName={post.creator?.firstName}
                    lastName={post.creator?.lastName}
                    userName={`@${post.creator?.userName}`}
                    likeCount={post.likes.length}
                    viewCount={post.viewCount}
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
              })
            : this.props.children}
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
    savePostDispatcher: (status, postId, authToken, updatedSavedItemsArr) =>
      dispatch(
        postSaveToggler(status, postId, authToken, updatedSavedItemsArr)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withErrorHandler(GetPosts, axios)));
