import autosize from "autosize";
import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import ProfileLayout from "../../../components/Layout/ProfileLayout";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";
import Spinner from "../../../components/UI/Spinner/Spinner";

import ProfileSection from "../../../components/User/Profile/ProfileSection";
import { showNotification } from "../../../store/actions";
import GetPosts from "../../Posts/GetPosts/GetPosts";
import getErrorStatusCode from "../../Posts/utils/errorHandler";
import classes from "./Profile.module.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.match.params.username,
      userId: null,
      firstName: null,
      lastName: null,
      email: null,
      about: {
        value: "",
        loadedValue: "",
        validation: {
          errorMsg: null,
          isTouched: false,
          minLength: 50,
          maxLength: 350,
        },
      },
      aboutEditModeOn: false,
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
          about: {
            ...this.state.about,
            validation: {
              ...this.state.about.validation,
            },
            value: response.data?.about,
            loadedValue: response.data?.about,
          },
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

  componentDidUpdate() {
    const userName = this.props.match.params.username;
    if (this.state.userName !== userName) {
      this.getUserInfo(userName);
    }
  }

  aboutHeightManager = (elem) => {
    autosize(elem);
  };

  aboutOnChangeHandler = (e) => {
    if (parseInt(e.target.style.height) > 110) {
      console.log("Invalid Height");    //validation
    }
    this.setState({
      about: {
        ...this.state.about,
        validation: {
          ...this.state.about.validation,
        },
        value: e.target.value,
      },
    });
  };

  editBtnClickHandler = (e) => {
    if (this.state.aboutEditModeOn) {
      if (e.target.innerText === "Cancel") {
        this.setState({
          aboutEditModeOn: false,
          about: {
            ...this.state.about,
            validation: {
              ...this.state.about.validation,
            },
            value: this.state.about.loadedValue,
          },
        });
        return;
      }
      if (this.updatingAbout) return;
      this.updatingAbout = true;
      axios
        .patch(
          `http://localhost:8000/user/update/${this.state.userId}`,
          { about: this.state.about.value },
          {
            headers: {
              Authorization: `Bearer ${this.props.authToken}`,
            },
          }
        )
        .then((response) => {
          this.props.showNotification("Data Updated Successfully!", "SUCCESS");
          this.updatingAbout = false;
          this.setState({
            aboutEditModeOn: false,
            about: {
              ...this.state.about,
              validation: {
                ...this.state.about.validation,
              },
              loadedValue: this.state.about.value,
            },
          });
        })
        .catch((err) => {
          this.updatingAbout = false;
          this.props.showNotification(
            "Failed to Update. Please try again!",
            "ERROR"
          );
        });
    } else {
      this.setState({
        aboutEditModeOn: true,
      });
    }
  };

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
          key={this.state.userName}
          currentUser={this.props.userName}
          userName={this.state.userName}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          about={this.state.about.value}
          aboutEditModeOn={this.state.aboutEditModeOn}
          aboutOnChangeHandler={this.aboutOnChangeHandler}
          editBtnClickHandler={this.editBtnClickHandler}
          aboutHeightCalc={this.aboutHeightManager}
          queryParam={this.queryParam || "posts"}
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
                <h3>Posts liked by {this.state.firstName} &#128077;</h3>
              </div>

              <GetPosts
                key={this.queryParam}
                type="LIKED_POSTS"
                userName={this.state.userName}
              >
                <div className={classes.LikedPosts__emptyMsg}>
                  <h4>Nothing here!</h4>
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
                <h3>{this.state.firstName}'s Blog&#10084;&#65039;</h3>
              </div>

              <GetPosts
                key={this.queryParam}
                type="PROFILE_POSTS"
                userName={this.state.userName}
              >
                <div className={classes.LikedPosts__emptyMsg}>
                  <h4>No Post yet!</h4>
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

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    userName: state.userName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message, type) =>
      dispatch(showNotification(message, type)),
  };
};

export default connect(mapStateToprops, mapDispatchToProps)(Profile);
