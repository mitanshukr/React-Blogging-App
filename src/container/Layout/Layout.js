import React from "react";
import { connect } from "react-redux";
import Toolbar from "./Toolbar/Toolbar";
import Notification from "../../components/UI/Notification/Notification";
import Footer from "../../components/Layout/Footer";

class Layout extends React.Component {
  render() {
    return (
      <>
        <Notification
          message={this.props.notifMessage}
          show={this.props.notifVisibility}
          type={this.props.notifType}
        />
        <Toolbar />
        {/* //sidedrawer */}
        <main style={{ height: "100%" }}>{this.props.children}</main>
        <Footer/>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifVisibility: state.notifVisibility,
    notifMessage: state.notifMessage,
    notifType: state.notifType,
  };
};

export default connect(mapStateToProps)(Layout);
