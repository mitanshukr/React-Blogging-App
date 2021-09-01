import React, { Component } from "react";
import GetPosts from "../GetPosts/GetPosts";

import classes from "./UserPosts.module.css";

class UserPosts extends Component {
  render() {
    return (
      <>
        <div className={classes.UserPosts__banner}>
          <h1>Your Posts</h1>
          <p>Here's some masterpiece carved by you.🤟🔥</p>
        </div>
        <GetPosts type="USER_POSTS">
          <div>
            <h2>No Posts!</h2>
            <p>Your write-ups will appear here!</p>
          </div>
        </GetPosts>
      </>
    );
  }
}

export default UserPosts;
