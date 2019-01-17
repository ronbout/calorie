import React, { Component } from "react";
import SocialSignup from "./socialSignup";
import EmailSignup from "./emailSignup";

const API_BASE = "http://localhost/api/";
const API_MEMBER = "members";
const API_KEY = "6y9fgv43dl40f9wl";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { errMsg: "", confirmMsg: "" };
  }

  handleSignUp = userInfo => {
    console.log("userInfo: ", userInfo);
    // clear out any error msg
    this.setState({ errMsg: "" });
    let postBody = { ...userInfo, apiKey: API_KEY };
    let postConfig = {
      method: "post",
      body: JSON.stringify(postBody),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(`${API_BASE}${API_MEMBER}`, postConfig)
      .then(response => {
        console.log("response: ", response);
        response.json().then(result => {
          result = result.data;
          console.log("Result: ", result);
          // figure out what to do here
          if (result.error) {
            this.setState({
              errMsg:
                result.SQLState == 23000
                  ? `Email ${userInfo.email} is already a registered user.`
                  : "An unknown error has occurred"
            });
          } else {
            // success.  let user know
            this.setState({
              confirmMsg: "You have successfully registered and may log in now."
            });
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
        {this.state.confirmMsg ? (
          <div className="register-confirm">{this.state.confirmMsg}</div>
        ) : (
          <React.Fragment>
            <h1>Sign Up</h1>
            <SocialSignup />
            <EmailSignup handleSignUp={this.handleSignUp} />
            {this.state.errMsg && (
              <div className="register-error">{this.state.errMsg}</div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default SignUp;
