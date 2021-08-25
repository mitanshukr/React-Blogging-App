import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-instance";
import { Editor } from "@tinymce/tinymce-react";

import CreatePost from "../../components/Posts/CreatePost/CreatePost";
import Button from "../../components/UI/Button/Button";
// import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import { dispatchBodyHandler } from "../../store/actions";

import "./WritingZone.css";

class WritingZone extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {
  //         body: ''
  //       };
  // }
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
        validation: {},
      },
      excerpt: {
        elementType: "textarea",
        elementConfig: {
          name: "excerpt",
          placeholder: "Add a brief Summary",
        },
        value: "",
        validation: {},
      },
      body: {
        elementType: "textarea",
        elementConfig: {
          name: "body",
          placeholder:
            "<p>What's in your mind right now?\n\nThe rule is simple...\nDon't think, just write.</p>",
          required: true,
          autoFocus: true,
        },
        value: "",
        validation: {},
      },
      tags: {
        elementType: "input",
        elementConfig: {
          name: "tags",
          type: "text",
          placeholder: "Add Tags seperated with comma",
        },
        value: "",
        validation: {},
      },
      // isPrivate: {
      //   elementType: "checkbox",
      //   elementConfig: {
      //     name: "isPrivate",
      //     type: "checkbox",
      //   },
      //   value: false,
      //   validation: {}
      // },
      isPrivate: {
        elementType: "radio",
        elementConfig: {
          name: "isPrivate",
          type: "radio",
          options: [
            { value: true, displayValue: "Yes", checked: false },
            { value: false, displayValue: "No", checked: true },
          ],
        },
        value: false,
        validation: {},
      },
    },
    modalVisibility: false,
    serverBusy: false,
    localError: null,
  };

  componentDidMount() {
    const updatedInputElements = {
      ...this.state.inputElements,
      body: {
        ...this.state.inputElements.body,
        value: this.props.body,
      },
    };
    this.setState({ inputElements: updatedInputElements });
    this.props.dispatchBody(null);
  }

  componentWillUnmount() {
    // if (this.state.inputElements?.body?.value)
    this.props.dispatchBody(this.state.inputElements.body.value);
  }

  // checkValidity(value, rules) {
  //   let isValid = true;
  //   if (!rules) {
  //     return true;
  //   }

  //   if (rules.required) {
  //     isValid = value.trim() !== "" && isValid;
  //   }

  //   if (rules.minLength) {
  //     isValid = value.length >= rules.minLength && isValid;
  //   }

  //   if (rules.maxLength) {
  //     isValid = value.length <= rules.maxLength && isValid;
  //   }

  //   if (rules.isEmail) {
  //     const pattern =
  //       /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  //     isValid = pattern.test(value) && isValid;
  //   }

  //   if (rules.isNumeric) {
  //     const pattern = /^\d+$/;
  //     isValid = pattern.test(value) && isValid;
  //   }

  //   return isValid;
  // }

  createPostHandler = (event) => {
    event.preventDefault();
    if (this.props.isAuthenticated) {
      this.setState({ modalVisibility: true });
    } else {
      this.props.history.push("/login");
    }
  };

  submitPostHandler = (event) => {
    event.preventDefault();
    this.setState({ serverBusy: true });
    const post = {
      title: this.state.inputElements.title.value,
      excerpt: this.state.inputElements.excerpt.value,
      body: this.state.inputElements.body.value,
      tags: this.state.inputElements.tags.value
        .split(",")
        .map((tag) => tag.trim()),
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
        this.setState({ localError: err });
        this.setState({ serverBusy: false });
        console.log(err);
      });
  };

  inputHandler = (event) => {
    let value = event.target?.value;
    let name = event.target?.name;
    if (!name) {
      name = "body";
      value = event;
    }
    const updatedInputElements = {
      ...this.state.inputElements,
      [name]: {
        ...this.state.inputElements[name],
        value: value,
      },
    };
    this.setState({ inputElements: updatedInputElements });
  };

  backdropToggler = () => {
    this.setState({ modalVisibility: false });
    this.setState({ localError: null });
  };

  cancelBtnHandler = () => {
    this.setState({ modalVisibility: false });
  };

  render() {
    return (
      <div>
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
              onChange={this.inputHandler}
              onSubmit={this.submitPostHandler}
              cancelClicked={this.cancelBtnHandler}
            />
          )}
        </Modal>
        <form onSubmit={this.createPostHandler} className="WritingZone">
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_API}
            value={this.state.inputElements.body.value}
            init={{
              placeholder:
                "What's in your mind right now?\nThe rule is simple...\nDon't think, just write.",
              height: "70vh",
              width: "80vw",
              content_css: "./WritingZone.css",
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
            onEditorChange={this.inputHandler}
          />
          <Button btntype="Submit">
            {this.props.isAuthenticated ? "Save" : "Login to Save"}
          </Button>
        </form>
      </div>
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
