import React, { Component } from "react";
import PostsListLayout from "../../components/Layout/PostsListLayout";
import GetPosts from "./GetPosts/GetPosts";
import bannerImage from "../../assets/Images/6.jpg";

class MyPosts extends Component {
  render() {
    return (
      <PostsListLayout
        title="Your Posts"
        subtitle="Here's some masterpiece carved by you.🤟🔥"
        bannerStyle={{
          background: `url(${bannerImage}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      >
        <GetPosts type="USER_POSTS">
          <div>
            <h2>No Posts!</h2>
            <p>Your write-ups will appear here!</p>
          </div>
        </GetPosts>
      </PostsListLayout>
    );
  }
}

export default MyPosts;
