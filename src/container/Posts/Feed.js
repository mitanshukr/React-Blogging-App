import React, { Component } from "react";

import GetPosts from "./GetPosts/GetPosts";
import PostsListLayout from "../../components/Layout/PostsListLayout";
import bannerImage from "../../assets/Images/2.png";

class Feed extends Component {
  render() {
    return (
      <PostsListLayout
        title="Public Feed"
        subtitle="Check what others have to Share with us!😍🎉"
        bannerStyle={{
          background: `url(${bannerImage}) no-repeat`,
          backgroundSize: "cover",
        }}
      >
        <GetPosts type="FEED">
          <div>
            <h2>No Posts here!</h2>
            <p>Be the first one to create Post!</p>
          </div>
        </GetPosts>
      </PostsListLayout>
    );
  }
}

export default Feed;
