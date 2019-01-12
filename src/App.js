import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "./css/styles.css";

import LandingPage from "./components/landingPage";
import TopNavBar from "./components/topNavBar";
import Signup from "./components/signup";
import Login from "./components/login";
import Member from "./components/member";
import Error404 from "./components/error404";

class App extends Component {
  handleLogin = resp => {
    this.setState({
      user: resp.data
    });
    this.props.history.push("/member");
  };

  render() {
    return (
      <React.Fragment>
        <TopNavBar />

        <Switch>
          <Route
            path="/member"
            render={() => <Member user={this.state.user} />}
          />
          <Route path="/signup" component={Signup} />,
          <Route
            path="/login"
            render={() => <Login handleLogin={this.handleLogin} />}
          />
          <Route exact path="/" component={LandingPage} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
