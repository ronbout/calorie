import React, { Component } from "react";
import SocialLogin from "./socialLogin";
import EmailLogin from "./emailLogin";

const API_BASE = "http://localhost/api/";
const API_MEMBER = "members?";
const API_KEY = "api_key=6y9fgv43dl40f9wl";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { errMsg: "" };
  }

  handleLogin = (email, password) => {
    fetch(
      `${API_BASE}${API_MEMBER}${API_KEY}&password=${password}&email=${email}`
    )
      .then(response => {
        response.json().then(result => {
          // need to check for user not found
          console.log("result: ", result.data);
          if (result.data) {
            this.props.handleLogin(result);
          } else {
            // no user, so prepare error message
            this.setState({ errMsg: "Unknown User Email" });
          }
        });
      })
      .catch(error => {
        console.log("Fetch error: ", error);
      });
  };

  render() {
    return (
      <div
        style={{ backgroundColor: "yellow", color: "blue" }}
        className="container-fluid"
      >
        <h1>Login</h1>
        <SocialLogin handleLogin={this.handleLogin} />
        <EmailLogin handleLogin={this.handleLogin} />
        {this.state.errMsg && (
          <div className="login-error error">{this.state.errMsg}</div>
        )}
      </div>
    );
  }
}

export default Login;
