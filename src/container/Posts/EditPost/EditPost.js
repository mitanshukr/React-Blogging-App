import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler";
import { Editor } from "@tinymce/tinymce-react";
import Input from "../../../components/UI/Input/Input";

import classes from "./EditPost.module.css";
import Modal from "../../../components/UI/Modal/Modal";
import { showNotification } from "../../../store/actions";
import {
  getStringToTagsArray,
  getTagArrayToString,
} from "../Utility/tagsFormatHandler";

class EditPost extends Component {
  state = {
    title: "",
    excerpt: "",
    body: "",
    tags: "",
    isPrivate: null,
    accessDenied: false,
    serverBusy: false,
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
        if (
          !response?.data ||
          response.data.creator._id !== this.props.userId
        ) {
          this.setState({
            accessDenied: true,
            localError: "Error 403: Bad Request",
          });
        } else {
          this.setState({
            postRendered: true,
            title: response.data.title,
            excerpt: response.data.excerpt,
            body: response.data.body,
            tags: getTagArrayToString(response.data.tags),
            date: response.data.createdAt,
            isPrivate: response.data.isPrivate,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ localError: err });
      });
  }

  cancelUpdateHandler = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  updatePostHandler = (e) => {
    e.preventDefault();
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
        console.log(response?.data);
        this.setState({ serverBusy: false });
        this.props.showNotif("Post updated Successfully!", true);
        this.notifTimer = setTimeout(() => {
          this.props.showNotif("Post updated Successfully!", false);
        }, 1500);
      })
      .catch((err) => {
        this.setState({ serverBusy: false, localError: err?.message });
        console.log(err);
      });
  };

  inputHandler = (event) => {
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
    this.setState({ body: data });
  };

  render() {
    return (
      <>
        <Modal
          visibility={this.state.serverBusy || !!this.state.localError}
          // clicked={this.backdropToggler}
        >
          {this.state.serverBusy ? (
            <Spinner />
          ) : this.state.localError ? (
            <p>{this.state.localError.toString()}</p>
          ) : (
            ""
          )}
        </Modal>
        {this.state.accessDenied ? (
          <div className={classes.error403}>
            <h2>403: Forbidden</h2>
            <p>Access Denied! Unauthorzied Access.</p>
          </div>
        ) : (
          <div className={classes.EditPost}>
            <div className={classes.EditPost__col1}>
              <p>Edit Post</p>
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
                    height: "75vh",
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
                <Button onClick={this.cancelUpdateHandler}>Cancel</Button>
                <Button onClick={this.updatePostHandler}>Update</Button>
              </div>
              <div className={classes.EditPost__excerpt}>
                <label htmlFor="editExcerpt">Excerpt</label>
                <Input
                  onChange={this.inputHandler}
                  elementType="textarea"
                  elementConfig={{
                    name: "excerpt",
                    type: "textarea",
                    id: "editExcerpt",
                    placeholder: "Add a Brief Summary",
                    autoComplete: "off",
                  }}
                  value={this.state.excerpt}
                />
              </div>
              <div className={classes.EditPost__tags}>
                <label htmlFor="editTags">
                  Tags <small>(Separated with Comma)</small>
                </label>
                <Input
                  onChange={this.inputHandler}
                  value={this.state.tags}
                  elementType="input"
                  elementConfig={{
                    name: "tags",
                    id: "editTags",
                    type: "text",
                    placeholder: "Add Tags separated with commas",
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
    //   let post = <Spinner />;
    //
    //   } else if (this.state.serverBusy) {
    //     post = <Spinner />;
    //   } else if (this.state.postRendered) {
    //     const elementConfig = {
    //       name: "title",
    //       type: "text",
    //       placeholder: "Title",
    //       autoComplete: "off",
    //     };
    //     post = (
    //       <>
    //       {/* <Modal
    //         visibility={this.state.modalVisibility}
    //         clicked={this.backdropToggler}
    //       >
    //         {this.state.serverBusy ? (
    //           <Spinner />
    //         ) : this.state.localError ? (
    //           <p>{this.state.localError.toString()}</p>
    //         )}
    //       </Modal> */}
    //       <div className={classes.EditPost}>
    //         <div>
    //           <p>Edit Post</p>
    //           <Input
    //             elementType="input"
    //             elementConfig={elementConfig}
    //             value={this.state.title}
    //             onChange={this.inputHandler}
    //           ></Input>
    //           <small className={classes.editorLoading}>
    //             Loading... Please Wait
    //           </small>
    //           <Editor
    //             apiKey={process.env.REACT_APP_TINYMCE_API}
    //             value={this.state.body}
    //             init={{
    //               placeholder: "Content Body",
    //               height: "75vh",
    //               width: "100%",
    //               // content_css: "./WritingZone.css",
    //               menubar: false,
    //               branding: false,
    //               plugins: [
    //                 "advlist autolink lists link image charmap print preview anchor",
    //                 "searchreplace visualblocks code fullscreen",
    //                 "insertdatetime media table paste code help wordcount",
    //               ],
    //               toolbar:
    //                 "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
    //             }}
    //             onEditorChange={this.editorChangeHandler}
    //           />
    //         </div>
    //         <div>
    //           <div>
    //             <Button onClick={this.updatePostHandler}>Update</Button>
    //             <Button onClick={this.cancelUpdateHandler}>Cancel</Button>
    //           </div>
    //           <p>Excerpt</p>
    //           <Input
    //             onChange={this.inputHandler}
    //             elementType="textarea"
    //             elementConfig={{
    //               name: "excerpt",
    //               type: "textarea",
    //               placeholder: "Add a Brief Summary",
    //               autoComplete: "off",
    //             }}
    //             value={this.state.excerpt}
    //           />
    //           <input type="hidden" />
    //           <p>Tags</p>
    //           <Input
    //             onChange={this.inputHandler}
    //             value={this.state.tags}
    //             elementType="input"
    //             elementConfig={{
    //               name: "tags",
    //               type: "text",
    //               placeholder: "Add Tags separated with commas",
    //               autoComplete: "off",
    //             }}
    //           />
    //           <div>
    //             <label htmlFor="isPrivate">Private Post?</label>
    //             <input
    //               onChange={this.inputHandler}
    //               type="checkbox"
    //               id="isPrivate"
    //               name="isPrivate"
    //               checked={this.state.isPrivate}
    //             />
    //           </div>
    //         </div>
    //       </div>

    //     </>
    //     );
    //   } else if (this.state.localError) {
    //     post = (
    //       <div>
    //         <p>{this.state.localError}</p>
    //         <Spinner />
    //       </div>
    //     );
    //   }
    //   return post;
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
    showNotif: (message, visibility) =>
      dispatch(showNotification(message, visibility)),
  };
};

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withErrorHandler(EditPost, axios));
