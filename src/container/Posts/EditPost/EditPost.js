import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { Editor } from "@tinymce/tinymce-react";
import Input from "../../../components/UI/Input/Input";
import ErrorSvg from "../../../components/UI/ErrorSvg/ErrorSvg";
import classes from "./EditPost.module.css";
import { showNotification } from "../../../store/actions";
import {
  getStringToTagsArray,
  getTagArrayToString,
} from "../utils/tagsFormatHandler";
import { withRouter } from "react-router";
import getErrorStatusCode from "../utils/errorHandler";

class EditPost extends Component {
  state = {
    title: "",
    excerpt: "",
    body: "",
    tags: "",
    isPrivate: false,
    serverBusy: false,
    isRendering: true,
    isChanged: false,
    localError: null,
  };

  componentDidMount() {
    let URI = null;
    const isPrivate = this.props.match.path.split("/")[2] === "private";
    this.postId = this.props.match.params.postId;
    if (isPrivate) {
      URI = `http://localhost:8000/post/private/${this.postId}`;
    } else {
      URI = `http://localhost:8000/post/public/${this.postId}`;
    }
    axios
      .get(URI, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        if (response.data?.creator?._id !== this.props.userId) {
          this.setState({ localError: 403 });
        } else {
          this.setState({
            title: response.data.title,
            excerpt: response.data.excerpt,
            body: response.data.body,
            tags: getTagArrayToString(response.data.tags),
            date: response.data.createdAt,
            isPrivate: response.data.isPrivate,
            serverBusy: false,
            isRendering: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          localError: getErrorStatusCode(err),
          serverBusy: false,
          isRendering: false,
        });
      });
  }

  cancelUpdateHandler = (e) => {
    e.preventDefault();
    this.props.history.goBack();
    // if (this.props.location.state.prevPath.includes("/post/")) {
    //   this.props.history.replace(
    //     `/post${this.state.initialPrivacyStatus ? "/private" : ""}/${
    //       this.postId
    //     }`
    //   );
    // } else {
    //   this.props.history.goBack();
    // }
  };

  updatePostHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });
    const updatedPost = {
      title: this.state.title,
      excerpt: this.state.excerpt,
      body: this.state.body,
      isPrivate: this.state.isPrivate,
      tags: getStringToTagsArray(this.state.tags),
    };
    axios
      .patch(`http://localhost:8000/post/edit/${this.postId}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        this.setState({
          serverBusy: false,
          isChanged: false,
        });
        this.props.showNotification("Post updated Successfully!", "SUCCESS");
        this.props.history.replace(
          `/post${this.state.isPrivate ? "/private" : ""}/${this.postId}`
        );
      })
      .catch((err) => {
        this.setState({ serverBusy: false });
        this.props.showNotification(
          "Failed to Update! Please try again.",
          "ERROR"
        );
      });
  };

  inputHandler = (event) => {
    if (!this.state.isChanged) this.setState({ isChanged: true });
    if (event.target.name === "title") {
      this.setState({ title: event.target.value });
    } else if (event.target.name === "excerpt") {
      this.setState({ excerpt: event.target.value });
    } else if (event.target.name === "isPrivate") {
      this.setState({ isPrivate: event.target.checked });
    } else if (event.target.name === "tags") {
      this.setState({ tags: event.target.value });
    }
  };

  editorChangeHandler = (data) => {
    if (!this.state.isChanged) this.setState({ isChanged: true });
    this.setState({ body: data });
  };

  render() {
    return (
      <>
        {this.state.isRendering ? (
          <Spinner />
        ) : this.state.localError ? (
          <ErrorSvg status={this.state.localError} />
        ) : (
          <div className={classes.EditPost}>
            <div className={classes.EditPost__col1}>
              <p className={classes["EditPost__col1--p"]}>Edit Post</p>
              <Input
                elementType="input"
                elementConfig={{
                  name: "title",
                  type: "text",
                  placeholder: "Title",
                  autoComplete: "off",
                }}
                value={this.state.title}
                onChange={this.inputHandler}
              />

              <div className={classes.EditPost__editor}>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API}
                  value={this.state.body}
                  init={{
                    placeholder: "Content Body",
                    height: "80vh",
                    resize: false,
                    width: "100%",
                    menubar: false,
                    branding: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={this.editorChangeHandler}
                />
              </div>
            </div>
            <div className={classes.EditPost__col2}>
              <div className={classes.EditPost__actions}>
                <Button
                  onClick={this.cancelUpdateHandler}
                  disabled={this.state.serverBusy}
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.updatePostHandler}
                  disabled={
                    this.state.serverBusy ||
                    this.state.isRendering ||
                    !this.state.isChanged
                  }
                >
                  {this.state.serverBusy ? "Updating..." : "Update"}
                </Button>
              </div>
              <div className={classes.EditPost__excerpt}>
                <Input
                  onChange={this.inputHandler}
                  elementType="textarea"
                  elementConfig={{
                    name: "excerpt",
                    type: "textarea",
                    placeholder: "Add a Brief Summary",
                    autoComplete: "off",
                  }}
                  label="Excerpt"
                  value={this.state.excerpt}
                />
              </div>
              <div className={classes.EditPost__tags}>
                <Input
                  onChange={this.inputHandler}
                  value={this.state.tags}
                  elementType="input"
                  label={["Tags", <small> (Separated by Comma)</small>]}
                  elementConfig={{
                    name: "tags",
                    type: "text",
                    placeholder: "Add Tags separated by comma",
                    autoComplete: "off",
                  }}
                />
              </div>
              <div className={classes.EditPost__isPrivate}>
                <input
                  onChange={this.inputHandler}
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={this.state.isPrivate}
                />
                <label htmlFor="isPrivate">Private Post?</label>
              </div>
            </div>
          </div>
        )}
        ;
      </>
    );
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message, visibility) =>
      dispatch(showNotification(message, visibility)),
  };
};

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(EditPost));
