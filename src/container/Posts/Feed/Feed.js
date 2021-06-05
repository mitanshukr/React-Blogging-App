import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import GetPost from "../../../components/Posts/GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./Feed.module.css";

import getPostShareHandler from '../../../Utility/getPostShareHandler';
import editPostHandler from '../Utility/editPostHandler';
import getSinglePostHandler from '../Utility/getSinglePostHandler';
import getPostsAPIHandler from "../Utility/getPostsAPIHandler";
import deletePostHandler from "../Utility/deletePostHandler";

class Feed extends Component {
  constructor(props){
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

  componentDidMount() {
    this.setState({serverBusy: true});
    getPostsAPIHandler("ALL", this.props.idToken, this.props.userId)
      .then((postsArray) => {
        const posts = postsArray.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.setState({ posts: posts, serverBusy: false });
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
                  isPrivate={post.isPrivate}
                  firstName={post.user?.firstName}
                  lastName={post.user?.lastName}
                  userName={post.user?.userName}
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
    idToken: state.idToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps)(withErrorHandler(Feed, axios));
