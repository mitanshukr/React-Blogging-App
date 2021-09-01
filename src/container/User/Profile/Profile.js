import axios from "axios";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import GetPosts from "../../Posts/GetPosts/GetPosts";
import classes from "./Profile.module.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.getQueryParam = () => {
      return new URLSearchParams(this.props.history.location.search).get(
        "feed"
      );
    };
    this.state = {
      userId: null,
      firstName: null,
      lastName: null,
      email: null,
      about: null,
      username: this.props.match.params.username,
      feedQuery: this.getQueryParam(),
    };
  }

  getUserInfo = (username) => {
    axios
      .get(`http://localhost:8000/user/public/${username}`)
      .then((response) => {
        this.setState({
          username: username,
          userId: response.data?.userId,
          firstName: response.data?.firstName,
          lastName: response.data?.lastName,
          email: response.data?.email,
          about: response.data?.about,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getUserInfo(this.state.username);
  }

  componentDidUpdate() {
    const username = this.props.match.params.username;
    const feedQuery = this.getQueryParam();

    if (this.state.username !== username) {
      this.getUserInfo(username);
    }
    if (this.state.feedQuery !== feedQuery) {
      this.setState({ feedQuery: feedQuery });
    }
  }

  render() {
    return (
      <div key={this.state.username} className={classes.Profile}>
        <div className={classes.Profile__col1}>
          <div className={classes.Profile__icon}>
            <FaRegUser title="Profile Picture" />
          </div>
          <div className={classes.Profile__name}>
            <h3>
              {this.state.firstName}&nbsp;{this.state.lastName}
            </h3>
            <small>{this.state.username}</small>
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
                className={
                  this.state.feedQuery !== "likes" ? classes.activeNav : ""
                }
              >
                <li>Public Posts</li>
              </NavLink>

              <NavLink
                to={`/profile/${this.state.username}?feed=likes`}
                className={
                  this.state.feedQuery === "likes" ? classes.activeNav : ""
                }
              >
                <li>Liked Posts</li>
              </NavLink>
            </ul>
          </div>
        </div>
        <div key={this.state.feedQuery} className={classes.Profile__col2}>
          {this.state.feedQuery === "likes" ? (
            <>
              <div
                className={`${classes[`Profile__col2--head`]} ${
                  classes.bg_like
                }`}
              >
                <h2>Posts liked by {this.state.firstName} &#128077;</h2>
              </div>

              <GetPosts type="LIKED_POSTS" userName={this.state.username}>
                <div className={classes.LikedPosts__emptyMsg}>
                  <h2>Nothing here!</h2>
                  <p style={{ fontStyle: "italic", color: "grey" }}>
                    Whatever you can't let go, goes Stale!
                    <br />
                    <small>@mitanshukr</small>
                  </p>
                </div>
              </GetPosts>
            </>
          ) : (
            <>
              <div
                className={`${classes[`Profile__col2--head`]} ${
                  classes.bg_post
                }`}
              >
                <h2>{this.state.firstName}'s Blog&#10084;&#65039;</h2>
              </div>

              <GetPosts type="PROFILE_POSTS" userName={this.state.username}>
                <div className={classes.LikedPosts__emptyMsg}>
                  <h2>Nothing here!</h2>
                  <p style={{ fontStyle: "italic", color: "grey" }}>
                    Whatever you can't let go, goes Stale!
                    <br />
                    <small>@mitanshukr</small>
                  </p>
                </div>
              </GetPosts>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
