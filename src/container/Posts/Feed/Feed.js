import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../GetPost/GetPost";
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

  sharePostHandler = (e, postId) => {
    e.stopPropagation();
    this.props.showNotif("Link Copied to Clipboard!", true);
    copyToClipboard(e, postId);
    this.notifTimer = setTimeout(() => {
      this.props.showNotif("Link Copied to Clipboard!", false);
    }, 2000);
  };

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
        <div className={classes.Feed}>
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
                  likeCount={post.likes.length}
                  viewCount={post.viewCount}
                  postId={post._id}
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
                  delete={(e) => this.singlePostDeletion(e, post._id)}
                  share={(e) => this.sharePostHandler(e, post._id)}
                />
              );
            })
          ) : (
            <div>
              <h2>No Posts here!</h2>
              <p>Be the first one to create Post!</p>
            </div>
          )}
        </div>
      );
    }

    if (this.state.serverBusy) {
      posts = <Spinner />;
    }

    return (
      <>
        <div className={classes.Feed__banner}>
          <h1>Public Feed</h1>
          <p>Check what others have to Share with us!😍🎉</p>
        </div>
        {posts}
      </>
    );
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
