import { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router";
import axios from "../../../axios-instance";
import parse from "html-react-parser";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from "./GetSinglePost.module.css";
import getDateFormat from "../../../Utility/getDateFormat";
import ProfileIcon from "../../../components/User/ProfileIcon/ProfileIcon";
import { BiShare, BiLockAlt, BiDotsVerticalRounded } from "react-icons/bi";
import getPostShareHandler from "../../../Utility/copyToClipboardHandler";

class GetSinglePost extends Component {
  state = {
    post: null,
    accessDenied: false,
    localError: null,
  };

  componentDidMount() {
    let URI = null;
    this.postId = this.props.match.params.postId;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    if (isPrivate) {
      URI = `http://localhost:8000/post/private/${this.postId}`;
    } else {
      URI = `http://localhost:8000/post/${this.postId}`;
    }

    axios
      .get(URI, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        if(!response?.data){
          this.setState({ accessDenied: true });
        }
        console.log(response?.data);
        this.setState({ post: response?.data});
        // if (
        //   !isPrivate ||
        //   (isPrivate &&
        //     response.data[this.postId].user.userId === this.props.userId)
        // ) {
        //   if (Object.keys(response.data).length === 0) {
        //     throw new Error(
        //       "Looks Like the post is deleted or the URL is not valid."
        //     );
        //   }
        //   this.setState({ post: response.data[this.postId] });
        // } else {
        //   this.setState({ accessDenied: true });
        // }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ localError: err.message });
      });
  }

  render() {
    let post = <Spinner />;
    if (this.state.accessDenied) {
      post = (
        <div>
          <h2>403 : Access Denied!</h2>
          <p>Private posts can be viewed only by its original creators.</p>
        </div>
      );
    } else if (this.state.post) {
      const postDate = getDateFormat(this.state.post.createdAt);
      post = (
        <div className={classes.GetSinglePost}>
          <h1>{this.state.post.title}</h1>
          <div>
            <span>
              <ProfileIcon
                firstLetter={this.state.post.creator.firstName?.split("")[0]}
                lastLetter={this.state.post.creator.lastName?.split("")[0]}
              />
              <small>
                {this.state.post.creator.firstName}&nbsp;
                {this.state.post.creator.lastName}
              </small>
              <small>&nbsp;&#183;&nbsp;{postDate}</small>
            </span>
            <span>
              {this.state.post.isPrivate ? (
                <small>
                  <BiLockAlt
                    title="Private Post"
                    size={20}
                    style={{ cursor: "auto", color: "inherit" }}
                  />
                </small>
              ) : (
                <small onClick={(e) => getPostShareHandler(e, this.postId)}>
                  <BiShare title="Share this Post" size={20} />
                </small>
              )}
              <small>
                &nbsp;
                <BiDotsVerticalRounded size={20} />
              </small>
            </span>
          </div>
          <div>{parse(this.state.post.body)}</div>
          <small>{this.state.post.tags}</small>
        </div>
      );
    } else if (this.state.localError) {
      post = (
        <div>
          <p>{this.state.localError}</p>
          <Spinner />
        </div>
      );
    }
    // else if(!this.props.isAuthenticated){
    //     post = <Redirect to="/login" />
    // }

    return post;
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToprops)(withErrorHandler(GetSinglePost, axios));
