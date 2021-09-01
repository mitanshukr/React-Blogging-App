import axios from "axios";
import React from "react";

import ProfileSection from "../../../components/User/ProfileSection/ProfileSection";
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
          <ProfileSection
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            username={this.state.username}
            feedQuery={this.state.feedQuery}
          />
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
                  <h2>No Posts yet!</h2>
                  <p style={{ fontStyle: "italic", color: "grey" }}>
                    Parallel Lines do intersect, and they intersect beautifully.
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
