import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-instance";
import { Editor } from "@tinymce/tinymce-react";
import { cloneDeep } from "lodash";

import CreatePost from "../../components/Posts/CreatePost/CreatePost";
import Button from "../../components/UI/Button/Button";
import Modal from "../../components/UI/Modal/Modal";
import { dispatchBodyHandler } from "../../store/actions";
import htmlToText from "html2plaintext";
import checkValidity from "../../Utility/inputValidation";
import { getStringToTagsArray } from "../Posts/utils/tagsFormatHandler";
import "./WritingZone.css";
import { withRouter } from "react-router";

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
          maxLength: 120,
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
            { value: "yes", displayValue: "Yes", checked: false },
            { value: "no", displayValue: "No", checked: true },
          ],
        },
        value: "no", //value of default checked:true option.
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
        htmlToText(this.state.inputElements.body.value)
          .replace(/\s+/g, " ")
          .trim().length < 200
      ) {
        alert(
          "Error: Length should be greater than or equal to 200 characters."
        );
        return;
      }
      this.setState({ modalVisibility: true });
    } else {
      this.props.history.replace({
        pathname: "/login",
        state: {
          prevPath: this.props.history?.location?.pathname,
        },
      });
    }
  };

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

  inputChangeHandler = (event) => {
    if (this.state.localError) {
      this.setState({ localError: null });
    }
    let value = event.target?.value;
    let name = event.target?.name;
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

  submitPostHandler = (event) => {
    event.preventDefault();
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

    const post = {
      title: this.state.inputElements.title.value,
      excerpt: this.state.inputElements.excerpt.value,
      body: this.state.inputElements.body.value,
      tags: getStringToTagsArray(this.state.inputElements.tags.value),
      isPrivate:
        this.state.inputElements.isPrivate.value === "yes" ? true : false,
      creator: {
        _id: this.props.userId,
        userName: this.props.userName,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
      },
    };
    axios
      .post("/post/create", post, {
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
        let errorMsg = null;
        if (err.message.toLowerCase().includes("network error")) {
          errorMsg = "Network Error! Please try again.";
        } else {
          errorMsg = "Something Went Wrong! Please try again.";
        }
        this.setState({ localError: errorMsg, serverBusy: false });
      });
  };

  cancelBtnHandler = () => {
    this.setState({ modalVisibility: false });
  };

  backdropToggler = () => {
    if (this.state.serverBusy) return;
    this.setState({ modalVisibility: false, localError: null });
  };

  render() {
    return (
      <>
        <Modal
          visibility={this.state.modalVisibility}
          clicked={this.backdropToggler}
        >
          {
            <CreatePost
              formData={this.state.inputElements}
              onChange={this.inputChangeHandler}
              onSubmit={this.submitPostHandler}
              cancelClicked={this.cancelBtnHandler}
              onBlur={this.onBlurEventHandler}
              errorMsg={this.state.localError}
              serverBusy={this.state.serverBusy}
            />
          }
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
                menubar: true,
                branding: false,
                auto_focus: true,
                resize: false,
                // images_upload_url: "provide upload server",
                image_advtab: true,
                plugins: [
                  "save directionality visualchars hr textpattern noneditable quickbars emoticons advlist autolink lists link image charmap print preview searchreplace code fullscreen insertdatetime table paste help wordcount",
                ],
                quickbars_selection_toolbar:
                  "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
              }}
              onEditorChange={this.inputChangeHandler}
            />
          </div>
          <div>
            <Button
              type="Submit"
              style={{ minWidth: "180px", fontSize: "16px", height: "38px" }}
            >
              {this.props.isAuthenticated ? "Save" : "Login to Save"}
            </Button>
          </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WritingZone));
