import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";
import Layout from "./components/Layout/Layout";
import GetPosts from "./container/Posts/GetPosts/GetPosts";
import GetSinglePost from "./container/Posts/GetSinglePost/GetSinglePost";
import Feed from "./container/Posts/Feed/Feed";
import WritingZone from "./container/WritingZone/WritingZone";
import Login from "./container/Auth/Login/Login";
import Logout from "./container/Auth/Logout";
import Signup from "./container/Auth/Signup/Signup";
import { sessionRefresher } from "./store/actions";
import { Component } from "react";
import EditPost from "./container/Posts/EditPost/EditPost";
import Account from "./container/User/Account";
import Spinner from "./components/UI/Spinner/Spinner";
import Profile from "./container/User/Profile/Profile";

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
        <Layout isAuthenticated={this.props.isAuthenticated}>
          {this.props.isAuthenticated ? (
            <Switch>
              <Route path="/" exact component={WritingZone} />
              <Route path="/feed" exact component={Feed} />
              <Route path="/logout" component={Logout} />
              {/* <Route path="/login" component={Login} /> */}
              <Route style={{backgroundColor: 'red'}} path="/posts" exact component={GetPosts} />
              <Route path="/posts/edit/:postId" exact component={EditPost} />
              <Route path="/posts/private/edit/:postId" exact component={EditPost} />
              <Route path="/posts/:postId" exact component={GetSinglePost} />
              <Route path="/posts/private/:postId" exact component={GetSinglePost} />
              <Route path="/user/profile" component={Profile} />
              <Route path="/user/account" component={Account} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route path="/" exact component={WritingZone} />
              <Route path="/feed" exact component={Feed} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              {/* <Route path="/posts" exact component={GetPosts} /> */}
              <Route path="/posts/:postId" exact component={GetSinglePost} />
              <Route from="/posts/private/:postId" exact component={GetSinglePost} />
              {/* <Redirect to="/" /> */}
            </Switch>
          )}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    AutoSessionChecker: () => dispatch(sessionRefresher()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
