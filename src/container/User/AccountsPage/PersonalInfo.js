import React from "react";
import { cloneDeep } from "lodash";
import Input from "../../../components/UI/Input/Input";
import AccountPicture from "../../../components/User/Profile/AccountPicture";
import checkValidity from "../../../Utility/inputValidation";
import Button from "../../../components/UI/Button/Button";
import classes from "./PersonalInfo.module.css";
import { connect } from "react-redux";
import axios from "axios";

class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputElements: {
        firstName: {
          elementType: "input",
          elementConfig: {
            name: "firstName",
            type: "text",
            placeholder: "Your First Name",
          },
          label: "First Name",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
            required: true,
          },
        },
        lastName: {
          elementType: "input",
          elementConfig: {
            name: "lastName",
            type: "text",
            placeholder: "Your Last Name",
          },
          label: "Last Name",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
          },
        },
        contact: {
          elementType: "input",
          elementConfig: {
            name: "contact",
            type: "text",
            placeholder: "Your Contact Number",
          },
          label: "Contact Number",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
          },
        },
        birthdate: {
          elementType: "input",
          elementConfig: {
            name: "birthdate",
            type: "date",
            placeholder: "Enter your Birth Date",
          },
          label: "Birth Date",
          value: "",
          validation: {
            errorMsg: null,
            isTouched: false,
          },
        },
        profession: {
          elementType: "input",
          elementConfig: {
            name: "profession",
            type: "text",
            placeholder: "E.g.: Senior Editor at Reader's Digest",
          },
          label: "Profession",
          value: "",
          validation: {},
        },
        address: {
          elementType: "input",
          elementConfig: {
            name: "address",
            type: "text",
            placeholder: "House No., Street Name, Locality",
          },
          label: "Address",
          value: "",
          validation: {},
        },
        city: {
          elementType: "input",
          elementConfig: {
            name: "city",
            type: "text",
            placeholder: "City Name",
          },
          label: "City",
          value: "",
          validation: {},
        },
        state: {
          elementType: "input",
          elementConfig: {
            name: "state",
            type: "text",
            placeholder: "State",
          },
          label: "State",
          value: "",
          validation: {},
        },
        pinCode: {
          elementType: "input",
          elementConfig: {
            name: "pinCode",
            type: "text",
            placeholder: "Pin Code",
          },
          label: "Pin Code",
          value: "",
          validation: {},
        },
        country: {
          elementType: "input",
          elementConfig: {
            name: "country",
            type: "text",
            placeholder: "Country",
          },
          label: "Country",
          value: "",
          validation: {},
        },
      },
      serverBusy: false,
      localError: null,
    };
  }

  //  PATCH `http://localhost:8000/user/update/${this.props.userId}`
  //  Req: Bearer Token

  componentDidMount() {
    axios
      .get(
        `http://localhost:8000/user/${this.props.userId}?detailedInfo=true`,
        {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        const updatedInputElements = cloneDeep(this.state.inputElements);
        for (let elem in updatedInputElements) {
          updatedInputElements[elem].value = response.data[elem];
        }
        this.setState({ inputElements: updatedInputElements });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onBlurEventHandler = (event) => {
    let name = event.target?.name || event.name;
    let value = event.target?.value || event.value || "";
    let errorMsg = checkValidity(
      value,
      this.state.inputElements[name].validation
    );
    if (name === "password2") {
      if (value !== this.state.inputElements.password.value) {
        errorMsg = "Password does not Match.";
      }
    }
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

  inputChangeHandler = (e) => {
    let name = e.target?.name;
    let value = e.target?.value;
    let errorMsg = null;
    if (this.state.localError) {
      this.setState({ localError: null });
    }
    if (this.state.inputElements[name].validation.isTouched) {
      errorMsg = checkValidity(
        value,
        this.state.inputElements[name].validation
      );
    }
    if (name === "password2") {
      if (value !== this.state.inputElements.password.value) {
        errorMsg = "Password does not Match.";
      }
    }

    const updatedInputElements = cloneDeep(this.state.inputElements);
    // if (name === "password") {
    //   if (value !== this.state.inputElements.password2.value) {
    //     updatedInputElements.password2.validation.errorMsg =
    //       "Password does not Match.";
    //   } else {
    //     updatedInputElements.password2.validation.errorMsg = null;
    //   }
    // }
    updatedInputElements[name].value = value;
    updatedInputElements[name].validation.errorMsg = errorMsg;
    this.setState({ inputElements: updatedInputElements });
  };

  render() {
    return (
      <div className={classes.PersonalInfo}>
        <div className={classes.PersonalInfo__dp}>
          <AccountPicture />
        </div>
        <div className={classes.PersonalInfo__inputRow}>
          {["firstName", "lastName"].map((element) => (
            <Input
              key={element}
              elementType={this.state.inputElements[element].elementType}
              onChange={this.inputChangeHandler}
              elementConfig={this.state.inputElements[element].elementConfig}
              value={this.state.inputElements[element].value}
              label={this.state.inputElements[element].label}
              onBlur={this.onBlurEventHandler}
              errorMsg={this.state.inputElements[element].validation.errorMsg}
              required={this.state.inputElements[element].validation.required}
            />
          ))}
        </div>
        {["profession", "contact", "birthdate", "address"].map((element) => (
          <Input
            key={element}
            elementType={this.state.inputElements[element].elementType}
            onChange={this.inputChangeHandler}
            elementConfig={this.state.inputElements[element].elementConfig}
            value={this.state.inputElements[element].value}
            label={this.state.inputElements[element].label}
            onBlur={this.onBlurEventHandler}
            errorMsg={this.state.inputElements[element].validation.errorMsg}
            required={this.state.inputElements[element].validation.required}
          />
        ))}
        <div className={classes.PersonalInfo__inputRow}>
          {["city", "state"].map((element) => (
            <Input
              key={element}
              elementType={this.state.inputElements[element].elementType}
              onChange={this.inputChangeHandler}
              elementConfig={this.state.inputElements[element].elementConfig}
              value={this.state.inputElements[element].value}
              label={this.state.inputElements[element].label}
              onBlur={this.onBlurEventHandler}
              errorMsg={this.state.inputElements[element].validation.errorMsg}
              required={this.state.inputElements[element].validation.required}
            />
          ))}
        </div>
        <div className={classes.PersonalInfo__inputRow}>
          {["pinCode", "country"].map((element) => (
            <Input
              key={element}
              elementType={this.state.inputElements[element].elementType}
              onChange={this.inputChangeHandler}
              elementConfig={this.state.inputElements[element].elementConfig}
              value={this.state.inputElements[element].value}
              label={this.state.inputElements[element].label}
              onBlur={this.onBlurEventHandler}
              errorMsg={this.state.inputElements[element].validation.errorMsg}
              required={this.state.inputElements[element].validation.required}
            />
          ))}
        </div>
        <div className={classes.PersonalInfo__btn}>
          <Button>Save</Button>
        </div>
      </div>
    );
  }
}

const mapStateToprops = (state) => {
  return {
    authToken: state.authToken,
    userId: state.userId,
  };
};

export default connect(mapStateToprops)(PersonalInfo);
