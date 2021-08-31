import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { showNotification } from "../../../store/actions";
import GetPost from "../../Posts/GetPost/GetPost";
import deletePostHandler from "../../Posts/Utility/deletePostHandler";
import editPostHandler from "../../Posts/Utility/editPostHandler";
import getSinglePostHandler from "../../Posts/Utility/getSinglePostHandler";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";

import classes from "./LikedPosts.module.css";

class PublicPosts extends React.Component {
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
      .get(`http://localhost:8000/post/public/all/${this.props.userName}`)
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
        <div className={classes.LikedPosts}>
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
            <div className={classes.LikedPosts__emptyMsg}>
              <h2>Nothing here!</h2>
              <p style={{ fontStyle: "italic" }}>
                Whatever you can't let go, goes Stale!
                <br />
                <small>@mitanshukr</small>
              </p>
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
)(withRouter(PublicPosts));
