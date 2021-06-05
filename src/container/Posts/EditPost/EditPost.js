import React, { Component } from "react";
import { connect } from 'react-redux';

import axios from '../../../axios-instance';
import Button from '../../../components/UI/Button/Button';
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";


class EditPost extends Component {
  state = {
    postId: "",
    title: "",
    excerpt: "",
    body: "", //copied to store
    tags: "",
    date: null,
    isPrivate: null,
    initialIsPrivate: null,
    postRendered: false,
    accessDenied: false,
    serverBusy: false,
    localError: null,
  };

  componentDidMount() {
    let URI = null;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    const postId = this.props.match.params.postId;
    if (isPrivate) {
      URI = `/privatePosts.json?auth=${this.props.idToken}&orderBy="$key"&equalTo="${postId}"`;
    } else {
      URI = `/publicPosts.json?orderBy="$key"&equalTo="${postId}"`;
    }

    axios
      .get(URI)
      .then((response) => {
        if (response.data[postId].user.userId === this.props.userId)
         {
          this.setState({ 
              postRendered: true,
              postId: postId,
              title: response.data[postId].title,
              excerpt: response.data[postId].excerpt,
              body: response.data[postId].body,
              tags: response.data[postId].tags.join(","),
              date: response.data[postId].date,
              isPrivate: response.data[postId].isPrivate,
              initialIsPrivate: response.data[postId].isPrivate,
             }, () => {
                 console.log(this.state)
             });
        } else {
          this.setState({ accessDenied: true });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ localError: err });
      });
  }

  updatePostHandler = (e) => {
    e.preventDefault();
      this.setState({serverBusy: true});
      if(this.state.isPrivate !== this.state.initialIsPrivate){
        const updatedPost = {
          title: this.state.title,
          excerpt: this.state.excerpt,
          body: this.state.body,
          date: this.state.date,
          isPrivate: this.state.isPrivate,
          edited: true,
          editDate: new Date(),
          tags: this.state.tags.split(','),
          userId: this.props.userId,
      }
      let newPostId = null;
      if(this.state.isPrivate){
        axios.post(`/privatePosts.json?auth=${this.props.idToken}`, updatedPost)
        .then(response => {
            newPostId = response.data.name;
            console.log(newPostId);
            return axios.delete(`/publicPosts/${this.state.postId}.json?auth=${this.props.idToken}`);
        }).then(response => {
            // console.log(response);
            this.setState({serverBusy: false});
            this.setState({postId: newPostId});
            this.setState({initialIsPrivate: this.state.isPrivate});
        }).catch(err => {
            // this.setState({localError: err});
            this.setState({serverBusy: false});
            console.log(err);
        });
      } else {
        axios.post(`/publicPosts.json?auth=${this.props.idToken}`, updatedPost)
        .then(response => {
            newPostId = response.data.name;
            console.log(newPostId);
            return axios.delete(`/privatePosts/${this.state.postId}.json?auth=${this.props.idToken}`);
        }).then(response => {
            // console.log(response);
            this.setState({serverBusy: false});
            this.setState({postId: newPostId});
            this.setState({initialIsPrivate: this.state.isPrivate});
        }).catch(err => {
            this.setState({serverBusy: false});
            console.log(err);
        });
      }
    } else {
      const updatedPost = {
          title: this.state.title,
          excerpt: this.state.excerpt,
          body: this.state.body,
          edited: true,
          editDate: new Date(),
          tags: this.state.tags.split(','),
          userId: this.props.userId,
      }

    let URI = null;
    if(this.state.isPrivate){
      URI = `/privatePosts/${this.state.postId}.json?auth=${this.props.idToken}`;
    } else {
      URI = `/publicPosts/${this.state.postId}.json?auth=${this.props.idToken}`;
    }

    axios.patch(URI, updatedPost)
    .then(response => {
      console.log(response);
      this.setState({serverBusy: false});
    }).catch(err => {
      console.log(err);
      this.setState({serverBusy: false});
    });
  }
}

  inputHandler = (event) => {
    if(event.target.name === 'body'){
      this.setState({ body: event.target.value });
    } else if(event.target.name === 'title'){
        this.setState({title: event.target.value });
      } else if(event.target.name === 'excerpt'){
        this.setState({ excerpt: event.target.value });
    } else if(event.target.name === 'isPrivate'){
        this.setState({ isPrivate: !this.state.isPrivate});
      } else if(event.target.name === 'tags'){
        this.setState({ tags: event.target.value });
    }
  }

  render() {
    let post = <Spinner />;
    if (this.state.accessDenied) {
      post = (
        <div>
          <h2>Access Denied!</h2>
          <p>Private posts can be viewed only by its original creators.</p>
        </div>
      );
    } else if(this.state.serverBusy){
        post = <Spinner />;
    } else if (this.state.postRendered) {
      post = (
        <div>
            <input onChange={this.inputHandler} type="text" name="title" placeholder="Title" value={this.state.title} />
            <textarea onChange={this.inputHandler} name="excerpt" placeholder="Add a Brief Summary" value={this.state.excerpt} />
            <textarea onChange={this.inputHandler} name="body" placeholder="Body" value={this.state.body} />
            <input onChange={this.inputHandler} name="tags" placeholder="Tags" value={this.state.tags} />
            Is Private? <input onChange={this.inputHandler} type="checkbox" name="isPrivate" checked={this.state.isPrivate}/>
            <Button onClick={this.updatePostHandler}>Update</Button>
            <Button>Cancel</Button>
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
    return post;
  }
}

const mapStateToprops = (state) => {
  return {
    idToken: state.idToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToprops)(withErrorHandler(EditPost, axios));
