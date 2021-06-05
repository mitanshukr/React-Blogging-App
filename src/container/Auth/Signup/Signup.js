import React, { Component } from "react";
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./Signup.module.css";
import { errorHandler, signupActionHandler } from '../../../store/actions';

class Signup extends Component {
    state = {
        inputElements: {
          firstName: {
            elementType: "input",
            elementConfig: {
                name: "firstName",
              type: "text",
              placeholder: "Your First Name",
            },
            value: "",
            validation: {},
          },
          lastName: {
            elementType: "input",
            elementConfig: {
                name: "lastName",
              type: "text",
              placeholder: "Your Last Name",
            },
            value: "",
            validation: {},
          },
          email: {
            elementType: "input",
            elementConfig: {
                name: "username",
              type: "text",
              placeholder: "Your Email Id",
            },
            value: "",
            validation: {},
          },
          password: {
            elementType: "input",
            elementConfig: {
                name: "password",
              type: "password",
              placeholder: "Enter a Password",
            },
            value: "",
            validation: {},
          },
          password2: {
            elementType: "input",
            elementConfig: {
                name: "password",
              type: "password",
              placeholder: "Re-enter the Password",
            },
            value: "",
            validation: {},
          },
        },
      };

    componentWillUnmount() {
        this.props.errorNullifyHandler();
    }

    signupHandler = (e) => {
        e.preventDefault();
        this.props.signupDispatchHandler(this.state.inputElements.email.value,
            this.state.inputElements.password.value, this.state.inputElements.firstName.value, this.state.inputElements.lastName.value);
    }

    inputChangeHandler = (e, stateName) => {
        const updatedInputElements = { ...this.state.inputElements };
        updatedInputElements[stateName].value = e.target.value;
  
        this.setState({inputElements: updatedInputElements});
      };

      render() {
        let formElements = Object.keys(this.state.inputElements).map((element) => (
          <Input
            key={element}
            elementType={this.state.inputElements[element].elementType}
            onChange={(e) => this.inputChangeHandler(e, element)}
            elementConfig={this.state.inputElements[element].elementConfig}
            value={this.state.inputElements[element].value}
          />
        ));
    
        let signupPage = (
          <div className={classes.Signup}>
            <form onSubmit={this.signupHandler}>
              <h2>Signup Form</h2>
              <p className={classes.Error}>{this.props.errorMsg}</p>
              {formElements}
              <Button>Register</Button>
            </form>
          </div>
        );
    
        if (this.props.serverBusy) {
          signupPage = <Spinner />;
        } 
        // else if (this.props.isAuthenticated) {
        //   signupPage = <Redirect to="/" />;
        // }
    
        return signupPage;
      }
}

const mapStateToProps = state => {
    return {
        serverBusy: state.serverBusy,
        isAuthenticated: state.isAuthenticated,
        errorMsg: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signupDispatchHandler: (email, password, firstName, lastName) => {dispatch(signupActionHandler(email, password, firstName, lastName))},
        errorNullifyHandler: () => {dispatch(errorHandler(null))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);