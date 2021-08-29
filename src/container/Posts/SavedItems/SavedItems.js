import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { showNotification } from "../../../store/actions";
import GetPost from "../GetPost/GetPost";
import editPostHandler from "../Utility/editPostHandler";
import getSinglePostHandler from "../Utility/getSinglePostHandler";
import copyToClipboard from "../../../Utility/copyToClipboardHandler";

import classes from "./SavedItems.module.css";

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
      })
      .catch((err) => {
        console.log(err);
        this.setState({ serverBusy: false });
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

  render() {
    let posts = null;
    if (this.state.posts) {
      posts = (
        <div className={classes.SavedItems}>
          {this.props.savedPosts.length !== 0 ? (
            this.props.savedPosts.map((postId) => {
              const post = this.state.posts.find((post) => post._id === postId);
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
                  //   delete={(e) =>
                  //     this.singlePostDeletion(e, post._id, post.isPrivate)
                  //   }
                  share={(e) => this.sharePostHandler(e, post._id)}
                />
              );
            })
          ) : (
            <div>
              <h2>Nothing here!</h2>
              <p>Your Saved Posts will appear here.</p>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedItems);
