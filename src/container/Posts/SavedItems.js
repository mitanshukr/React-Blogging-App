import React from "react";
import PostsListLayout from "../../components/Layout/PostsListLayout";

import GetPosts from "./GetPosts/GetPosts";
import bannerImage from "../../assets/Images/10.jpg";

class SavedItems extends React.Component {
  render() {
    return (
      <PostsListLayout
        title="Saved Items"
        subtitle="Life is a collection of great memories, and you know it!😱✨"
        bannerStyle={{
          background: `url(${bannerImage}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        <GetPosts type="SAVED_ITEMS">
          <div>
            <h2>Nothing here!</h2>
            <p>Your Saved Posts will appear here.</p>
          </div>
        </GetPosts>
      </PostsListLayout>
    );
  }
}

export default SavedItems;
