import axios from "axios";
import React from "react";
import ProfileLayout from "../../../components/Layout/ProfileLayout";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";
import Spinner from "../../../components/UI/Spinner/Spinner";

import ProfileSection from "../../../components/User/Profile/ProfileSection";
import GetPosts from "../../Posts/GetPosts/GetPosts";
import getErrorStatusCode from "../../Posts/utils/errorHandler";
import classes from "./Profile.module.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    // this.getQueryParam = () => {
    //   return new URLSearchParams(this.props.history.location.search).get(
    //     "feed"
    //   );
    // };
    // this.userName =
    //   this.props.match.params.userName[0] === "@"
    //     ? this.props.match.params.userName
    //     : "@" + this.props.match.params.userName;
    this.state = {
      userId: null,
      firstName: null,
      lastName: null,
      email: null,
      about: null,
      aboutEditModeOn: false,
      userName: this.props.match.params.username,
      // feedQuery: this.getQueryParam(),
      localError: null,
      serverBusy: true,
    };
  }

  getUserInfo = (userName) => {
    axios
      .get(`http://localhost:8000/user/public/${userName}`)
      .then((response) => {
        this.setState({
          userName: userName,
          userId: response.data?.userId,
          firstName: response.data?.firstName,
          lastName: response.data?.lastName,
          email: response.data?.email,
          about: response.data?.about,
          serverBusy: false,
        });
      })
      .catch((err) => {
        this.setState({
          localError: getErrorStatusCode(err),
          serverBusy: false,
        });
      });
  };

  componentDidMount() {
    this.getUserInfo(this.state.userName);
  }

  // componentDidUpdate() {
  //   const userName = this.props.match.params.username;
  //   // this.props.match.params.userName[0] === "@"
  //   //   ? this.props.match.params.userName
  //   //   : "@" + this.props.match.params.userName;
  //   const feedQuery = this.queryParam;

  //   if (this.state.userName !== userName) {
  //     this.getUserInfo(userName);
  //   }
  //   if (this.state.feedQuery !== feedQuery) {
  //     this.setState({ feedQuery: feedQuery });
  //   }
  // }

  aboutEditHandler = () => {};

  render() {
    this.queryParam = new URLSearchParams(
      this.props.history.location.search
    ).get("feed");

    if (this.state.serverBusy) {
      return <Spinner />;
    } else if (this.state.localError) {
      return <ErrorSvg status={this.state.localError} src="SINGLE_POST" />;
    } else {
      return (
        <ProfileLayout
          queryParam={this.queryParam || "posts"}
          userName={this.state.userName}
          menuItems={{
            posts: {
              name: "Public Posts",
            },
            likes: {
              name: "Liked Posts",
            },
          }}
        >
          {this.queryParam === "likes" ? (
            <>
              <div
                className={`${classes[`Profile__col2--head`]} ${
                  classes.bg_like
                }`}
              >
                <h2>Posts liked by {this.state.firstName} &#128077;</h2>
              </div>

              <GetPosts type="LIKED_POSTS" userName={this.state.userName}>
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

              <GetPosts type="PROFILE_POSTS" userName={this.state.userName}>
                <div className={classes.LikedPosts__emptyMsg}>
                  <h2>No Post yet!</h2>
                  <p style={{ fontStyle: "italic", color: "grey" }}>
                    Parallel Lines do intersect, and they intersect beautifully.
                    <br />
                    <small>@mitanshukr</small>
                  </p>
                </div>
              </GetPosts>
            </>
          )}
        </ProfileLayout>

        // <div key={this.state.userName} className={classes.Profile}>
        //   <div className={classes.Profile__col1}>
        //     <ProfileSection
        //       firstName={this.state.firstName}
        //       lastName={this.state.lastName}
        //       userName={this.state.userName}
        //       feedQuery={this.state.feedQuery}
        //       about={this.state.about}
        //       aboutEditModeOn={this.state.aboutEditModeOn}
        //       aboutEditHandler={this.aboutEditHandler}
        //     />
        //   </div>
        //   <div key={this.state.feedQuery} className={classes.Profile__col2}>
        //     {this.state.feedQuery === "likes" ? (
        //       <>
        //         <div
        //           className={`${classes[`Profile__col2--head`]} ${
        //             classes.bg_like
        //           }`}
        //         >
        //           <h2>Posts liked by {this.state.firstName} &#128077;</h2>
        //         </div>

        //         <GetPosts type="LIKED_POSTS" userName={this.state.userName}>
        //           <div className={classes.LikedPosts__emptyMsg}>
        //             <h2>Nothing here!</h2>
        //             <p style={{ fontStyle: "italic", color: "grey" }}>
        //               Whatever you can't let go, goes Stale!
        //               <br />
        //               <small>@mitanshukr</small>
        //             </p>
        //           </div>
        //         </GetPosts>
        //       </>
        //     ) : (
        //       <>
        //         <div
        //           className={`${classes[`Profile__col2--head`]} ${
        //             classes.bg_post
        //           }`}
        //         >
        //           <h2>{this.state.firstName}'s Blog&#10084;&#65039;</h2>
        //         </div>

        //         <GetPosts type="PROFILE_POSTS" userName={this.state.userName}>
        //           <div className={classes.LikedPosts__emptyMsg}>
        //             <h2>No Post yet!</h2>
        //             <p style={{ fontStyle: "italic", color: "grey" }}>
        //               Parallel Lines do intersect, and they intersect
        //               beautifully.
        //               <br />
        //               <small>@mitanshukr</small>
        //             </p>
        //           </div>
        //         </GetPosts>
        //       </>
        //     )}
        //   </div>
        // </div>
      );
    }
  }
}

export default Profile;
