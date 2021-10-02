import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import NavigationItems from "../../../components/Layout/NavigationItems/NavigationItems";

import "./Toolbar.css";
import UserMenu from "./UserMenu/UserMenu";

class Toolbar extends React.Component {
  render() {
    return (
      <header className="Header">
        <div className="logo">
          <NavLink to="/" exact>
            Immune Ink
          </NavLink>
        </div>
        <nav>
          <NavigationItems
            isAuthenticated={this.props.isAuthenticated}
            prevPath={this.props.history?.location?.pathname}
          >
            {this.props.isAuthenticated ? (
              <UserMenu prevPath={this.props.history?.location?.pathname} />
            ) : null}
          </NavigationItems>
          {/* togglerBtn */}
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

export default connect(mapStateToProps)(withRouter(Toolbar));
