import axios from "axios";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { Redirect, Route } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import GetPost from "../../Posts/GetPost/GetPost";
import editPostHandler from "../../Posts/Utility/editPostHandler";
import getSinglePostHandler from "../../Posts/Utility/getSinglePostHandler";

import classes from "./Profile.module.css";

class Profile extends React.Component {
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
                  profilePage={true}
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
                  // delete={(e) =>
                  //   this.singlePostDeletion(e, post._id, post.isPrivate)
                  // }
                  // share={(e) => this.sharePostHandler(e, post._id)}
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
      <div className={classes.Profile}>
        <Route path="/profile/:username">
          <Redirect to="/profile/@username?feed=posts" />
        </Route>
        <div className={classes.Profile__col1}>
          <div className={classes.Profile__icon}>
            <FaRegUser title="MK" />
          </div>
          <div className={classes.Profile__name}>
            <h3>Mitanshu Kumar</h3>
          </div>
          <div className={classes.Profile__about}>
            About me lorem epsum is the widest known dummy text that you should
            also use in your developement to show dummy data.
          </div>
          <div className={classes.Profile__edit}>Edit</div>
          <div className={classes.Profile__action}>
            <ul>
              <li>Public Posts</li>
              <li>Private Posts</li>
              <li>Liked Posts</li>
            </ul>
          </div>
        </div>
        <div className={classes.Profile__col2}>{posts}</div>
      </div>
    );
  }
}

export default Profile;
