import React, { Component } from "react";
import Modal from "../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
      };
    }

    componentWillMount() {
      console.log("checkpoint1", this.state.error);
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        console.log("checkpoint2", req);
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        (res) => {
          console.log("inteceptors res", res);
          return res;
        },
        (error) => {
          this.setState({ error: error });
          console.log("checkpoint3", error);
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorMessageHandler = () => {
      this.setState({ error: null });
    };

    render() {
      console.log("inside render...", this.state.error);
      return (
        <>
          <Modal
            clicked={this.errorMessageHandler}
            visibility={this.state.error}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </>
      );
    }
  };
};

export default withErrorHandler;
