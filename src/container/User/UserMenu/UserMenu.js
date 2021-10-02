import React from "react";
import { connect } from "react-redux";

import MenuList from "./MenuList/MenuList";
import classes from "./UserMenu.module.css";

class MenuIcon extends React.Component {
  state = {
    isMenuActive: false,
  };

  userMenuToggler = (e) => {
    this.setState((prevState) => {
      return { isMenuActive: !prevState.isMenuActive };
    });
  };

  render() {
    return (
      <>
        <div
          className={classes.MenuIcon}
          id="user-icon-01"
          onClick={this.userMenuToggler}
          title={this.props.firstName}
        >
          <p id="user-img-01">
            {this.props.firstName?.slice(0, 1)}
            {this.props.lastName?.slice(0, 1)}
          </p>
        </div>
        {this.state.isMenuActive ? (
          <MenuList
            userMenuToggler={this.userMenuToggler}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            userName={this.props.userName}
            prevPath={this.props.prevPath}
            iconId={{
              selfId: "user-icon-01",
              childId: "user-img-01",
            }}
          />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firstName: state.firstName,
    lastName: state.lastName,
    userName: state.userName,
  };
};

export default connect(mapStateToProps)(MenuIcon);
