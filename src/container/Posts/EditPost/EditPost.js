import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-instance";
import htmlToText from "html2plaintext";
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
import checkValidity from "../../../Utility/inputValidation";
import { cloneDeep } from "lodash";

class EditPost extends Component {
  state = {
    inputElements: {
      title: {
        elementType: "input",
        elementConfig: {
          name: "title",
          type: "text",
          placeholder: "Title",
          autoComplete: "off",
        },
        value: "",
        label: "Title",
        validation: {
          errorMsg: null,
          isTouched: false,
          required: true,
          minLength: 5,
          maxLength: 100,
        },
      },
      excerpt: {
        elementType: "textarea",
        elementConfig: {
          name: "excerpt",
          placeholder: "Add a brief Summary",
        },
        value: "",
        label: "Excerpt",
        validation: {
          errorMsg: null,
          isTouched: false,
          minLength: 50,
          maxLength: 350,
        },
      },
      body: {
        value: "",
        elementConfig: {},
        validation: {},
      },
      tags: {
        elementType: "input",
        elementConfig: {
          name: "tags",
          type: "text",
          placeholder: "Add Tags seperated by comma",
        },
        value: "",
        label: "Tags",
        validation: {
          errorMsg: null,
          isTouched: false,
          maxTagCount: 5,
        },
      },
    },
    isPrivate: false,
    date: null,
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
          const updatedElem = cloneDeep(this.state.inputElements);
          updatedElem.title.value = response.data.title;
          updatedElem.excerpt.value = response.data.excerpt;
          updatedElem.body.value = response.data.body;
          updatedElem.tags.value = getTagArrayToString(response.data.tags);
          this.setState({
            inputElements: updatedElem,
            isPrivate: response.data.isPrivate,
            date: response.data.createdAt,
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

  onBlurEventHandler = (event) => {
    let name = event.target?.name || event.name;
    let value = event.target?.value || event.value || "";

    const errorMsg = checkValidity(
      value,
      this.state.inputElements[name].validation
    );
    const updatedElem = cloneDeep(this.state.inputElements[name]);
    updatedElem.value = value;
    updatedElem.validation.isTouched = true;
    updatedElem.validation.errorMsg = errorMsg;
    this.setState((prevState) => {
      return {
        ...prevState,
        inputElements: {
          ...prevState.inputElements,
          [name]: updatedElem,
        },
      };
    });
    return errorMsg;
  };

  cancelUpdateHandler = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  inputHandler = (event) => {
    if (!this.state.isChanged) this.setState({ isChanged: true });
    let value = event.target?.value;
    let name = event.target?.name;
    if (name === "isPrivate") {
      this.setState({ isPrivate: event.target.checked });
      return;
    }
    if (!name) {
      name = "body";
      value = event;
    }
    let errorMsg = null;
    if (this.state.inputElements[name].validation.isTouched) {
      errorMsg = checkValidity(
        value,
        this.state.inputElements[name].validation
      );
    }
    const updatedInputElements = cloneDeep(this.state.inputElements);
    updatedInputElements[name].value = value;
    updatedInputElements[name].validation.errorMsg = errorMsg;

    this.setState({ inputElements: updatedInputElements });
  };

  updatePostHandler = (e) => {
    e.preventDefault();
    if (this.state.serverBusy) return;
    this.setState({ serverBusy: true });

    let error = null;
    for (let field in this.state.inputElements) {
      error += this.onBlurEventHandler({
        name: field,
        value: this.state.inputElements[field].value,
      });
    }
    if (error) {
      this.setState({ serverBusy: false });
      return;
    }

    if (
      !this.state.inputElements.body.value ||
      htmlToText(this.state.inputElements.body.value)
        .replace(/\s+/g, " ")
        .trim().length < 200
    ) {
      alert("Blog Length Error: Enter atleast 200 characters.");
      this.setState({ serverBusy: false });
      return;
    }

    const updatedPost = {
      title: this.state.inputElements.title.value,
      excerpt: this.state.inputElements.excerpt.value,
      body: this.state.inputElements.body.value,
      isPrivate: this.state.isPrivate,
      tags: getStringToTagsArray(this.state.inputElements.tags.value),
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
                onChange={this.inputHandler}
                onBlur={this.onBlurEventHandler}
                elementType={this.state.inputElements.title.elementType}
                elementConfig={this.state.inputElements.title.elementConfig}
                value={this.state.inputElements.title.value}
                errorMsg={this.state.inputElements.title.validation.errorMsg}
              />
              <div className={classes.EditPost__editor}>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API}
                  value={this.state.inputElements.body.value}
                  onEditorChange={this.inputHandler}
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
                  onBlur={this.onBlurEventHandler}
                  elementType={this.state.inputElements.excerpt.elementType}
                  elementConfig={this.state.inputElements.excerpt.elementConfig}
                  value={this.state.inputElements.excerpt.value}
                  label={this.state.inputElements.excerpt.label}
                  errorMsg={
                    this.state.inputElements.excerpt.validation.errorMsg
                  }
                />
              </div>
              <div className={classes.EditPost__tags}>
                <Input
                  onChange={this.inputHandler}
                  onBlur={this.onBlurEventHandler}
                  elementType={this.state.inputElements.tags.elementType}
                  elementConfig={this.state.inputElements.tags.elementConfig}
                  value={this.state.inputElements.tags.value}
                  label={["Tags", <small> (Separated by Comma)</small>]}
                  errorMsg={this.state.inputElements.tags.validation.errorMsg}
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
