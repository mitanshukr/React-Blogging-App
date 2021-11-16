import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";
import Layout from "./container/Layout/Layout";
import MyPosts from "./container/Posts/MyPosts/MyPosts";
import Feed from "./container/Posts/Feed/Feed";
import WritingZone from "./container/WritingZone/WritingZone";
import Logout from "./container/Auth/Logout";
import Signup from "./container/Auth/Signup/Signup";
import { sessionRefresher } from "./store/actions";
import { Component } from "react";
import EditPost from "./container/Posts/EditPost/EditPost";
import AccountsPage from "./container/User/AccountsPage/AccountsPage";
import Spinner from "./components/UI/Spinner/Spinner";
import Profile from "./container/User/Profile/Profile";
import SavedItems from "./container/Posts/SavedItems/SavedItems";
import Login from "./container/Auth/Login/Login";
import Error404 from "./components/UI/ErrorSvg/Errors/Error404";
import ForgotPassword from "./container/Auth/PasswordChange/ForgotPassword";
import ResetPassword from "./container/Auth/PasswordChange/ResetPassword";
import EmailVerification from "./container/Auth/EmailVerification/EmailVerification";
import AuthRoute from "./hoc/AuthRoute";
import GetSinglePost from "./container/Posts/GetSinglePost/GetSinglePost";
import HomePage from "./container/HomePage/HomePage";
// import GetSinglePostRouter from "./container/Posts/GetSinglePost/Index";

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
        <Switch>
          <Route
            path="/verify-email/:userId/:verificationToken"
            component={EmailVerification}
          />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route
            path="/reset-password/:userId/:resetToken"
            component={ResetPassword}
          />
          <Layout>
            <Switch>
              <Route path="/home" exact component={HomePage} />
              <Route path="/" exact component={WritingZone} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/feed" exact component={Feed} />
              <Route path="/post/:postId" exact component={GetSinglePost} />
              {/* <Route path="/ink/:username" exact component={Profile} /> */}
              <Route path="/ink/:username(@\w+)" exact component={Profile} />
              {/* Regex Search in the above path - should start with @ */}
              <AuthRoute path="/user/account">
                <AccountsPage />
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

              <Route render={() => <Error404 />} />
            </Switch>
          </Layout>
        </Switch>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    AutoSessionChecker: () => dispatch(sessionRefresher()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
