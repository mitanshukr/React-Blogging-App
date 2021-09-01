import React, { Component } from "react";

import GetPosts from "../GetPosts/GetPosts";
import classes from "./Feed.module.css";

class Feed extends Component {
  render() {
    return (
      <>
        <div className={classes.Feed__banner}>
          <h1>Public Feed</h1>
          <p>Check what others have to Share with us!😍🎉</p>
        </div>
        <GetPosts type="FEED">
          <div>
            <h2>No Posts here!</h2>
            <p>Be the first one to create Post!</p>
          </div>
        </GetPosts>
      </>
    );
  }
}

export default Feed;
