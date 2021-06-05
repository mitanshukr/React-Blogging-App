import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./MenuIcon.module.css";
import { userIconStatusHandler } from '../../../../store/actions';

class MenuIcon extends Component {
  userIconHandler = () => {
    this.props.isUserIconSelected(!this.props.isSelected);
  };

  render() {
    return (
      <div className={classes.MenuIcon} id="user-icon" onClick={this.userIconHandler}>
        <p id="user-img">
          {this.props.firstLetter}
          {this.props.lastLetter}
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firstLetter: state.firstName?.split("")[0],
    lastLetter: state.lastName?.split("")[0],
    isSelected: state.isUserIconSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isUserIconSelected: (status) => dispatch(userIconStatusHandler(status))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuIcon);
