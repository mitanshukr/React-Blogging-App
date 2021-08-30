import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { postSaveToggler, showNotification } from "../../../store/actions";
import GetPost from "../GetPost/GetPost";
import editPostHandler from "../Utility/editPostHandler";
import getSinglePostHandler from "../Utility/getSinglePostHandler";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";

import classes from "./SavedItems.module.css";
import deletePostHandler from "../Utility/deletePostHandler";

class SavedItems extends React.Component {
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
      .get("http://localhost:8000/post/saveditems", {
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

        const postIdArr = posts.map((post) => post?._id);
        this.props.savePostDispatcher("UPDATE", null, null, postIdArr);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ serverBusy: false });
      });
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

  render() {
    let posts = null;
    if (this.state.posts) {
      posts = (
        <div className={classes.SavedItems}>
          {this.props.savedPosts.map((postId) => {
            const post = this.state.posts.find((post) => post._id === postId);
            if (post)
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
                  userName={post.creator?.userName}
                  likeCount={post.likes.length}
                  viewCount={post.viewCount}
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
          })}
        </div>
      );
    }

    if (this.props.savedPosts.length === 0) {
      posts = (
        <div className={classes.SavedItems}>
          <h2>Nothing here!</h2>
          <p>Your Saved Posts will appear here.</p>
        </div>
      );
    }
    if (this.state.serverBusy) {
      posts = <Spinner />;
    }
    return (
      <>
        <div className={classes.SavedItems__banner}>
          <h1>Saved Items</h1>
          <p>Life is a collection of great memories, and you know it!😱✨</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedItems);
