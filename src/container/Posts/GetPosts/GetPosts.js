import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../../../components/Posts/GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetPosts.module.css";

import getSinglePostHandler from "../Utility/getSinglePostHandler";
import getPostShareHandler from "../../../Utility/getPostShareHandler";
import editPostHandler from "../Utility/editPostHandler";
import deletePostHandler from "../Utility/deletePostHandler";

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
                  share={(e) => getPostShareHandler(e, post._id)}
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

export default connect(mapStateToProps)(withErrorHandler(GetPosts, axios));
