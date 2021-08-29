import { connect } from "react-redux";
import classes from "./UserMenu.module.css";
import NavigationItem from "../../../components/Toolbar/NavigationItems/NavigationItem/NavigationItem";
import React, { Component } from "react";
import { userIconStatusHandler } from "../../../store/actions";
import { FaRegBookmark, FaRegUser, FaRocketchat, FaKey } from "react-icons/fa";

class UserMenu extends Component {
  // constructor(props){
  // super(props);
  // this.clickFunction = (e) => {
  //   e.stopPropagation();
  //   if(document.getElementById('user-icon').checked){
  //     const menuDiv = document.getElementById('userMenu');
  //     const rect = menuDiv.getBoundingClientRect();
  //     console.log(rect);
  //     if(e.clientX < rect.x || e.clientX > (rect.x + rect.width) || e.clientY < rect.y || e.clientY > (rect.y + rect.height)){
  //       this.linkClicked();
  //       console.log("xyxxxxxxxxxxxxxxxxxxxxxxxxxx", e.clientX, e.clientY);
  //     }
  //   } else {
  //     return;
  //   }
  // };
  // window.addEventListener('click', (e) => this.clickFunction(e));
  // }

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.userIcon = document.getElementById("user-icon");
    this.userImg = document.getElementById("user-img");
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    //clicked outside the userIcon and userMenu.
    if (
      this.props.isSelected &&
      !this.wrapperRef.current.contains(event.target) &&
      event.target !== this.userIcon &&
      event.target !== this.userImg
    ) {
      this.linkClicked();
    }
  }

  linkClicked = () => {
    this.props.isUserIconSelected(false);
  };

  render() {
    let style = null;
    if (this.props.isSelected) {
      style = { display: "block" };
    } else {
      style = { display: "none" };
    }

    return (
      <div className={classes.UserMenu} style={style} ref={this.wrapperRef}>
        <NavigationItem onClick={this.linkClicked} link="/user/profile">
          <span>
            <span>
              {this.props.firstName}&nbsp;{this.props.lastName}
            </span>
            <small>@{this.props.userName}</small>
          </span>
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/user/saved-items">
          <FaRegBookmark /> Saved Items
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/user/account">
          <FaRegUser/> Account
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/feedback">
          <FaRocketchat/> Feedback
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/logout">
          <FaKey/> Logout
        </NavigationItem>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firstName: state.firstName,
    lastName: state.lastName,
    userName: state.userName,
    isSelected: state.isUserIconSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isUserIconSelected: (status) => dispatch(userIconStatusHandler(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
