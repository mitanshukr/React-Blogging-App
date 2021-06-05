import { Component } from "react";
import Input from '../../components/UI/Input/Input';

class Account extends Component {
    state = {
        inputElements: {
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
              placeholder: "Your Password",
            },
            value: "",
            validation: {},
          },
        },
      };

    render(){
        return(
            <div>
                <Input elementType="input" elementConfig={this.state.inputElements.email.elementConfig}/>
            </div>
        );
    }
}

export default Account;