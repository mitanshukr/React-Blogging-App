import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../../../components/Posts/GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetPosts.module.css";

import getPostShareHandler from '../../../Utility/getPostShareHandler';
import editPostHandler from '../Utility/editPostHandler';
import getSinglePostHandler from '../Utility/getSinglePostHandler';
import getPostsAPIHandler from "../Utility/getPostsAPIHandler";
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
    this.setState({serverBusy: true});
    getPostsAPIHandler("USER_ALL", this.props.idToken, this.props.userId)
      .then((postsArray) => {
        const postsArr = [...postsArray[0], ...postsArray[1]];
        const posts = postsArr.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.setState({ posts: posts, serverBusy: false});
      })
      .catch((err) => {
        console.log(err);
        this.setState({serverBusy: false});
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
                  key={post.postId}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  firstName={post.user?.firstName}
                  lastName={post.user?.lastName}
                  userName={post.user?.userName}
                  isPrivate={post.isPrivate}
                  isCurrentUser={post.user?.userId === this.props.userId}
                  clicked={(e) => getSinglePostHandler(e, this.props, post.postId, post.isPrivate)}
                  edit={(e) => editPostHandler(e, this.props, post.postId, post.isPrivate)}
                  delete={(e) => this.singlePostDeletion(e, post.postId, post.isPrivate)}
                  share={(e) => getPostShareHandler(e, post.postId)}
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
    idToken: state.idToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps)(withErrorHandler(GetPosts, axios));
