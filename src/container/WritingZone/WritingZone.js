import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-instance";
import { Editor } from "@tinymce/tinymce-react";
import { cloneDeep } from "lodash";

import CreatePost from "../../components/Posts/CreatePost/CreatePost";
import Button from "../../components/UI/Button/Button";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import { dispatchBodyHandler } from "../../store/actions";
import wordCount from "html-word-count";

import checkValidity from "../../Utility/inputValidation";
import { getStringToTagsArray } from "../Posts/utils/tagsFormatHandler";
import "./WritingZone.css";

class WritingZone extends Component {
  state = {
    inputElements: {
      title: {
        elementType: "input",
        elementConfig: {
          name: "title",
          type: "text",
          placeholder: "Add Title",
          autoComplete: "off",
        },
        value: "",
        label: "Title",
        validation: {
          errorMsg: null,
          isTouched: false,
          required: true,
          minLength: 5,
          minWordCount: 1,
          maxWordCount: 10,
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
          minWordCount: 10,
          maxWordCount: 50,
        },
      },
      body: {
        elementType: "textarea",
        elementConfig: {
          name: "body",
          placeholder:
            "<p>What's in your mind right now?\n\nThe rule is simple...\nDon't think, just write.</p>",
        },
        value: "",
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
      isPrivate: {
        elementType: "radio",
        elementConfig: {
          name: "isPrivate",
          type: "radio",
          required: "true",
          options: [
            { value: true, displayValue: "Yes", checked: false },
            { value: false, displayValue: "No", checked: true },
          ],
        },
        value: false,
        label: "Keep it Secret?",
        validation: {
          required: true,
        },
      },
    },
    modalVisibility: false,
    serverBusy: false,
    localError: null,
  };

  componentDidMount() {
    const updatedInputElements = cloneDeep(this.state.inputElements);
    updatedInputElements.body.value = this.props.body;
    this.setState({ inputElements: updatedInputElements });
    this.props.dispatchBody(null);
  }

  componentWillUnmount() {
    this.props.dispatchBody(this.state.inputElements.body.value);
  }

  createPostHandler = (event) => {
    event.preventDefault();
    if (this.props.isAuthenticated) {
      if (
        !this.state.inputElements.body.value ||
        wordCount(this.state.inputElements.body.value) < 25
      ) {
        alert("Error: Minimum Word Count Should be 25.");
        return;
      }
      this.setState({ modalVisibility: true });
    } else {
      this.props.history.push("/login");
    }
  };

  onBlurEventHandler = (event) => {
    let name = event.target?.name;
    let value = event.target?.value;
    console.log(name, value);
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

  inputChangeHandler = (event) => {
    let value = event.target?.value;
    let name = event.target?.name;
    if (!name) {
      name = "body";
      value = event;
    }
    console.log(value);
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

  submitPostHandler = (event) => {
    event.preventDefault();
    let error = this.onBlurEventHandler({
      target: { name: "title", value: this.state.inputElements.title.value },
    });
    error += this.onBlurEventHandler({
      target: {
        name: "excerpt",
        value: this.state.inputElements.excerpt.value,
      },
    });
    error += this.onBlurEventHandler({
      target: { name: "tags", value: this.state.inputElements.tags.value },
    });
    if (error) {
      return;
    }

    this.setState({ serverBusy: true });
    const post = {
      title: this.state.inputElements.title.value,
      excerpt: this.state.inputElements.excerpt.value,
      body: this.state.inputElements.body.value,
      tags: getStringToTagsArray(this.state.inputElements.tags.value),
      isPrivate: this.state.inputElements.isPrivate.value,
      creator: {
        _id: this.props.userId,
        userName: this.props.userName,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
      },
    };
    axios
      .post("http://localhost:8000/post/create", post, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      })
      .then((response) => {
        this.setState({
          inputElements: {
            ...this.state.inputElements,
            body: { ...this.state.inputElements.body, value: null },
          },
        });
        this.props.history.push("/posts");
      })
      .catch((err) => {
        this.setState({ localError: err, serverBusy: false });
        console.log(err);
      });
  };

  cancelBtnHandler = () => {
    this.setState({ modalVisibility: false });
  };

  backdropToggler = () => {
    this.setState({ modalVisibility: false, localError: null });
  };

  render() {
    return (
      <>
        <Modal
          visibility={this.state.modalVisibility}
          clicked={this.backdropToggler}
        >
          {this.state.serverBusy ? (
            <Spinner />
          ) : this.state.localError ? (
            <p>{this.state.localError.toString()}</p>
          ) : (
            <CreatePost
              formData={this.state.inputElements}
              onChange={this.inputChangeHandler}
              onSubmit={this.submitPostHandler}
              cancelClicked={this.cancelBtnHandler}
              onBlur={this.onBlurEventHandler}
            />
          )}
        </Modal>
        <form onSubmit={this.createPostHandler} className="WritingZone">
          <div className="homeEditor">
            <Editor
              apiKey={process.env.REACT_APP_TINYMCE_API}
              value={this.state.inputElements.body.value}
              init={{
                placeholder:
                  "What's in your mind right now?\nThe rule is simple...\nDon't think, just write.",
                height: "100%",
                width: "100%",
                content_css: "./WritingZone.css",
                menubar: false,
                branding: false,
                resize: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={this.inputChangeHandler}
            />
          </div>
          <Button btntype="Submit">
            {this.props.isAuthenticated ? "Save" : "Login to Save"}
          </Button>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    body: state.body,
    isAuthenticated: state.isAuthenticated,
    authToken: state.authToken,
    userId: state.userId,
    userName: state.userName,
    firstName: state.firstName,
    lastName: state.lastName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchBody: (body) => {
      dispatch(dispatchBodyHandler(body));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WritingZone);
