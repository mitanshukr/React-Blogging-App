import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";
import Layout from "./components/Layout/Layout";
import MyPosts from "./container/Posts/MyPosts/MyPosts";
import GetSinglePost from "./container/Posts/GetSinglePost/GetSinglePost";
import Feed from "./container/Posts/Feed/Feed";
import WritingZone from "./container/WritingZone/WritingZone";
import Login from "./container/Auth/Login/Login";
import Logout from "./container/Auth/Logout";
import Signup from "./container/Auth/Signup/Signup";
import { sessionRefresher } from "./store/actions";
import { Component } from "react";
import EditPost from "./container/Posts/EditPost/EditPost";
import Account from "./container/User/Account/Account";
import Spinner from "./components/UI/Spinner/Spinner";
import Profile from "./container/User/Profile/Profile";
import Notification from "./components/UI/Notification/Notification";
import SavedItems from "./container/Posts/SavedItems/SavedItems";
import ForgotPassword from "./container/Auth/PasswordChange/ForgotPassword";
import ResetPassword from "./container/Auth/PasswordChange/ResetPassword";
import EmailVerification from "./container/Auth/EmailVerification/EmailVerification";
import AuthRoute from "./hoc/AuthRoute";

class App extends Component {
  constructor(props) {
    super(props);
    this.props.AutoSessionChecker();
  }

  // componentDidMount() {
  //   this.props.AutoSessionChecker();
  // }

  render() {
    let app = (
      <div className="App">
        <Notification
          show={this.props.notifVisibility}
          message={this.props.notifMessage}
        />
        <Route
          path="/verify-email/:userId/:verificationToken"
          component={EmailVerification}
        />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/reset-password/:userId/:resetToken"
          component={ResetPassword}
        />
        <Layout isAuthenticated={this.props.isAuthenticated}>
          <Switch>
           
               
          
            <Route path="/" exact component={WritingZone} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/feed" exact component={Feed} />
            <Route path="/post/:postId" exact component={GetSinglePost} />
            <Route path="/profile/:username" component={Profile} />
            <AuthRoute path="/user/account">
              <Account />
            </AuthRoute>
            <AuthRoute path="/user/saved-items">
              <SavedItems />
            </AuthRoute>
            <AuthRoute path="/posts" exact>
              <MyPosts />
            </AuthRoute>
            <AuthRoute path="/post/private/:postId" exact>
              <GetSinglePost />
            </AuthRoute>

            <AuthRoute path="/post/edit/:postId" exact>
              <EditPost />
            </AuthRoute>

            <AuthRoute path="/post/private/edit/:postId" exact>
              <EditPost />
            </AuthRoute>
            <AuthRoute path="/logout">
              <Logout />
            </AuthRoute>

            <Redirect to="/404" />
          </Switch>
        </Layout>
      </div>
    );

    if (this.props.serverBusy) {
      app = <Spinner />;
    }
    return app;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    serverBusy: state.serverBusy,
    notifVisibility: state.notifVisibility,
    notifMessage: state.notifMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    AutoSessionChecker: () => dispatch(sessionRefresher()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
