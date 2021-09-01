import React from "react";

import GetPosts from "../GetPosts/GetPosts";
import classes from "./SavedItems.module.css";

class SavedItems extends React.Component {
  render() {
    return (
      <>
        <div className={classes.SavedItems__banner}>
          <h1>Saved Items</h1>
          <p>Life is a collection of great memories, and you know it!😱✨</p>
        </div>
        <GetPosts type="SAVED_ITEMS">
          <div>
            <h2>Nothing here!</h2>
            <p>Your Saved Posts will appear here.</p>
          </div>
        </GetPosts>
      </>
    );
  }
}

export default SavedItems;
