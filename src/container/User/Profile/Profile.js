import classes from "./Profile.module.css";
import { Component } from "react";
import { connect } from "react-redux";
import axios from "../../../axios-instance";

import GetPost from "../../Posts/GetPost/GetPost";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import ProfileIcon from "../../../components/User/ProfileIcon/ProfileIcon";

class Profile extends Component {
  state = {
    posts: null,
    serverBusy: false,
  };

  singlePostHandler = (postId, isPrivate) => {
      if(isPrivate){
        this.props.history.push("/posts/private/" + postId);
    } else {
        this.props.history.push("/posts/" + postId);  
      }
  };

  singlePostShareHandler = (e, postId) => {
    e.stopPropagation();
    const link = window.location.origin + "/posts/" + postId;
    if (!navigator.clipboard) {
      alert(`Clipboard API not available.\n${link}`);
      return;
    }
    navigator.clipboard.writeText(link)
    .then(() => {
      alert(`Link copied to Clipboard.\n${link}`);
    }).catch(err => {
      alert("Failed to Copy, Please Try again! Error: ", err);
    })
  }

  singlePostDeletion = (e, postId, isPrivate) => {
    e.stopPropagation();
    this.setState({serverBusy: true});
    let URI;
    if (isPrivate) {
      URI = `/privatePosts/${postId}.json?auth=${this.props.idToken}`;
    } else {
      URI = `/publicPosts/${postId}.json?auth=${this.props.idToken}`;
    }
    axios.delete(URI)
    .then(response => {
      console.log(response);
      const posts = [...this.state.posts];
      const deletedPostIndex = posts.findIndex(post => post.key === postId);
      posts.splice(deletedPostIndex, 1);
      this.setState({posts: posts});
      this.setState({serverBusy: false});
    }).catch(err => {
      console.log(err);
      this.setState({serverBusy: false});
    });
}

  singlePostEditor = (e, postId, isPrivate) => {
      e.stopPropagation();
      if(isPrivate){
        this.props.history.push("/posts/private/edit/" + postId);
    } else {
        this.props.history.push("/posts/edit/" + postId);
      }
  }

  componentDidMount() {
    // if (this.props.isAuthenticated && !this.state.posts) {
    const postsArr = [];
    const authParam = "?auth=" + this.props.idToken;
    const queryParams = '&orderBy="userId"&equalTo="' + this.props.userId + '"';
    axios.get("/privatePosts.json" + authParam + queryParams)
      .then((response) => {
        for (let postId in response.data) {
          const postObj = {
            ...response.data[postId],
            postId: postId,
          };
          postsArr.push(postObj);
        }
        return axios.get("/publicPosts.json" + authParam + queryParams);
      })
      .then((response) => {
        for (let postId in response.data) {
          const postObj = {
            ...response.data[postId],
            postId: postId,
          };
          postsArr.push(postObj);
        }
      })
      .then(() => {
        const posts = postsArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((post) => {
            return (
              <GetPost
                key={post.postId}
                title={post.title}
                excerpt={post.excerpt}
                date={new Date(post.date).toLocaleString()}
                isPrivate={post.isPrivate}
                clicked={this.singlePostHandler.bind(this, post.postId, post.isPrivate)}
                edit={(e) => this.singlePostEditor(e, post.postId, post.isPrivate)}
                delete={(e) => this.singlePostDeletion(e, post.postId, post.isPrivate)}
                share={(e) => this.singlePostShareHandler(e, post.postId)}
              />
            );
          });

        this.setState({ posts: posts });
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  }

  render() {
    let posts = null;
    if(this.state.serverBusy){
      posts = <Spinner />
    } else {
      posts = (
          <div className={classes.Profile}>
            <div>
                <ProfileIcon />
                <h2>{this.props.firstName}&nbsp;{this.props.lastName}</h2>
                <small>@{this.props.userName}</small>
                <textarea>About...</textarea>
                <button>Edit</button>
             </div>
       <div>
          {this.state.posts ? (
            this.state.posts.length !== 0 ? (
              this.state.posts
            ) : (
              <div>
                <h1>No Posts!</h1>
                <p>Your write-ups will appear here!</p>
              </div>
            )
          ) : (
            <Spinner />
          )}
          </div>
        </div>
      );
    }
    return posts;
  }
}

const mapStateToProps = (state) => {
  return {
    idToken: state.idToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
    firstName: state.firstName,
    lastName: state.lastName,
    userName: state.userName
  };
};

export default connect(mapStateToProps)(withErrorHandler(Profile, axios));
