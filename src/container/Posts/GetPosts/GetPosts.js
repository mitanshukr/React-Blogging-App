import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetPosts.module.css";

import getSinglePostHandler from "../Utility/getSinglePostHandler";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";
import editPostHandler from "../Utility/editPostHandler";
import deletePostHandler from "../Utility/deletePostHandler";
import { showNotification } from "../../../store/actions";

class GetPosts extends Component {
  state = {
    posts: null,
    serverBusy: false,
  };

  singlePostDeletion = (e, postId, isPrivate) => {
    deletePostHandler(
      e,
      this.props.idToken,
      postId,
      this.state.posts,
      isPrivate
    )
      .then((updatedPosts) => {
        console.log("here I ,,,,,,,,,,,,,,,,,");
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

  // componentWillUnmount() {
  //   clearTimeout(this.notifTimer);
  // }

  componentDidMount() {
    this.setState({ serverBusy: true });
    axios
      .get(`http://localhost:8000/post/all/${this.props.userId}?private=true`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
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
                  firstName={post.creator?.firstName}
                  lastName={post.creator?.lastName}
                  userName={post.creator?.userName}
                  isPrivate={post.isPrivate}
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
                  delete={(e) =>
                    this.singlePostDeletion(e, post._id, post.isPrivate)
                  }
                  share={(e) => this.sharePostHandler(e, post._id)}
                />
              );
            })
          ) : (
            <div>
              <h1>No Posts!</h1>
              <p>Your write-ups will appear here!</p>
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
        <div className={classes.GetPosts__banner}>
          <h1>Your Posts</h1>
          <p>Here's some masterpiece carved by you.🤟🔥</p>
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
)(withErrorHandler(GetPosts, axios));
