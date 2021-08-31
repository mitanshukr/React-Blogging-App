import React from "react";
import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import LikedPosts from "./LikedPosts";
import PublicPosts from "./PublicPosts";
import classes from "./Profile.module.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    // this.username = this.props.match.params.username;
    this.state = {
      username: this.props.match.params.username,
    };
  }

  // componentDidMount() {
  //   this.setState({ username: this.props.match.params.username });
  // }

  componentDidUpdate() {
    console.log("MITANSHU DID MOUNT");
    if (this.state.username !== this.props.match.params.username)
      this.setState({ username: this.props.match.params.username });
  }

  render() {
    this.feedQuery = new URLSearchParams(
      this.props.history.location.search
    ).get("feed");

    return (
      <div  key={this.state.username} className={classes.Profile}>
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
              <NavLink
                to={`/profile/${this.state.username}?feed=posts`}
                className={this.feedQuery !== "likes" ? classes.activeNav : ""}
              >
                <li>Public Posts</li>
              </NavLink>

              <NavLink
                to={`/profile/${this.state.username}?feed=likes`}
                className={this.feedQuery === "likes" ? classes.activeNav : ""}
              >
                <li>Liked Posts</li>
              </NavLink>
            </ul>
          </div>
        </div>
        <div className={classes.Profile__col2}>
          {this.feedQuery === "likes" ? (
            <>
              <div
                className={`${classes[`Profile__col2--head`]} ${
                  classes.bg_like
                }`}
              >
                <h2>Posts liked by Mitanshu</h2>
              </div>
              <LikedPosts userName={this.state.username} />
            </>
          ) : (
            <>
              <div
                className={`${classes[`Profile__col2--head`]} ${
                  classes.bg_post
                }`}
              >
                <h2>Mitanshu's Blog&#10084;&#65039;</h2>
              </div>
              <PublicPosts userName={this.state.username} />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
