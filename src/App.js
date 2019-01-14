import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "./css/styles.css";

import LandingPage from "./components/landingPage";
import TopNavBar from "./components/topNavBar";
import Signup from "./components/signup";
import Login from "./components/login";
import Member from "./components/member";
// eslint-disable-next-line
import Error404 from "./components/error404";

class App extends Component {
  constructor(props) {
    super(props);
    const storedUser = sessionStorage.getItem("user");
    const userInfo = storedUser ? JSON.parse(storedUser) : this.clearUser();
    this.state = {
      user: userInfo
    };
  }

  clearUser = () => {
    return {
      email: "",
      firstName: "",
      lastName: "",
      memberId: "",
      totalCalsToday: 0,
      userName: ""
    };
  };

  handleLogin = resp => {
    // add to session storage
    sessionStorage.setItem("user", JSON.stringify(resp.data));
    this.setState({
      user: resp.data
      // email, firstName, lastName, memberId, totalCalsToday, userName
    });
    this.props.history.push(`/member/${this.state.user.memberId}`);
  };

  handleLogout = () => {
    sessionStorage.removeItem("user");
    this.setState({
      user: this.clearUser()
    });
    this.props.history.push("/");
  };

  render() {
    return (
      <React.Fragment>
        <TopNavBar user={this.state.user} handleLogout={this.handleLogout} />

        <Switch>
          <Route
            path="/member/:memberId"
            render={({ match }) => (
              <Member user={this.state.user} urlid={match.params.memberId} />
            )}
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
