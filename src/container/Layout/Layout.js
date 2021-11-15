import React from "react";
import { connect } from "react-redux";
import Toolbar from "./Toolbar/Toolbar";
import Notification from "../../components/UI/Notification/Notification";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import SidebarNavigationItems from "../../components/Layout/NavigationItems/SidebarNavigationItems";
// import Footer from "../../components/Layout/Footer";
import "./Layout.css";

class Layout extends React.Component {
  state = {
    navSidebarVisibility: false,
  };

  mobileNavToggler = () => {
    this.setState((prevState) => {
      return { navSidebarVisibility: !prevState.navSidebarVisibility };
    });
  };

  render() {
    return (
      <>
        <Notification
          message={this.props.notifMessage}
          show={this.props.notifVisibility}
          type={this.props.notifType}
        />
        <Toolbar onMobileNavClick={this.mobileNavToggler} />
        <div className="sidebar__menu">
          <Sidebar
            alignment="right"
            visibility={this.state.navSidebarVisibility}
            onClose={this.mobileNavToggler}
          >
            <SidebarNavigationItems
              isAuthenticated={this.props.isAuthenticated}
              userName={this.props.userName}
              firstName={this.props.firstName}
              lastName={this.props.lastName}
            />
          </Sidebar>
        </div>
        <main style={{ height: "100%" }}>{this.props.children}</main>
        {/* <Footer/> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    userName: state.userName,
    firstName: state.firstName,
    lastName: state.lastName,
    notifVisibility: state.notifVisibility,
    notifMessage: state.notifMessage,
    notifType: state.notifType,
  };
};

export default connect(mapStateToProps)(Layout);
