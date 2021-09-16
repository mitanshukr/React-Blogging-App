import React from "react";
import { FaRegBookmark, FaRegUser, FaRocketchat, FaKey } from "react-icons/fa";

import NavigationItem from "../../../../components/Toolbar/NavigationItems/NavigationItem/NavigationItem";
import classes from "./MenuList.module.css";

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  linkClicked = () => {
    this.props.userMenuToggler();
  };

  handleClickOutside(event) {
    if (
      !this.wrapperRef.current.contains(event.target) &&
      event.currentTarget.id !== this.props.iconId.selfId &&
      event.target.id !== this.props.iconId.childId
    ) {
      this.linkClicked();
    }
  }

  render() {
    return (
      <div className={classes.UserMenu} ref={this.wrapperRef}>
        <NavigationItem
          onClick={this.linkClicked}
          link={`/profile/@${this.props.userName}`}
        >
          <span>
            <span>
              {this.props.firstName} {this.props.lastName}
            </span>
            <small>@{this.props.userName}</small>
          </span>
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/user/saved-items">
          <FaRegBookmark /> Saved Items
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/user/account">
          <FaRegUser /> Account
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/feedback">
          <FaRocketchat /> Feedback
        </NavigationItem>
        <NavigationItem onClick={this.linkClicked} link="/logout">
          <FaKey /> Logout
        </NavigationItem>
      </div>
    );
  }
}

export default MenuList;
