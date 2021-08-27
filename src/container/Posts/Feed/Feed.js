import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../../../components/Posts/GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./Feed.module.css";

import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../Utility/editPostHandler";
import getSinglePostHandler from "../Utility/getSinglePostHandler";
import deletePostHandler from "../Utility/deletePostHandler";
import { showNotification } from "../../../store/actions";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      serverBusy: false,
    };
  }

  singlePostDeletion = (e, postId, isPrivate) => {
    deletePostHandler(
      e,
      this.props.idToken,
      postId,
      this.state.posts,
      isPrivate
    )
      .then((updatedPosts) => {
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
  }

  componentDidMount() {
    this.setState({ serverBusy: true });
    axios
      .get("http://localhost:8000/post/feed/all")
      .then((response) => {
        const posts = response.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.setState({ posts: posts, serverBusy: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ serverBusy: false });
      });
  }

  render() {
    let posts = null;
    if (this.state.posts) {
      posts = (
        <div className={classes.GetPosts}>
          {this.state.posts.length !== 0 ? (
            this.state.posts.map((post) => {
              return (
                <GetPost
                  key={post._id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.createdAt}
                  isPrivate={post.isPrivate}
                  firstName={post.creator?.firstName}
                  lastName={post.creator?.lastName}
                  userName={post.creator?.userName}
                  isCurrentUser={post.creator?._id === this.props.userId}
                  clicked={(e) =>
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
                  delete={(e) =>
                    this.singlePostDeletion(e, post._id, post.isPrivate)
                  }
                  share={(e) => this.sharePostHandler(e, post._id)}
                />
              );
            })
          ) : (
            <div>
              <h1>No Posts here!</h1>
              <p>Be the first one to create Post!</p>
            </div>
          )}
        </div>
      );
    }

    if (this.state.serverBusy) {
      posts = <Spinner />;
    }

    return posts;
  }
}

const mapStateToProps = (state) => {
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
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Feed, axios));
