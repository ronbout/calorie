import React, { Component } from "react";
import SocialSignup from "./socialSignup";
import EmailSignup from "./emailSignup";

const API_BASE = "http://localhost/api/";
const API_MEMBER = "members";
const API_KEY = "6y9fgv43dl40f9wl";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { errMsg: "", confirmMsg: "", socialInfo: null };
  }

  handleSignUp = userInfo => {
    console.log("userInfo: ", userInfo);
    // clear out any error msg
    this.setState({ errMsg: "", confirmMsg: "" });
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
                result.errorCode === 23000
                  ? `Email ${userInfo.email} is already a registered user.`
                  : "An unknown error has occurred"
            });
          } else {
            // success.  let user know
            this.setState({
              confirmMsg: this.state.socialInfo
                ? "You are registered and may log in with Google now."
                : "You are registered and may log in by email now."
            });
          }
        });
      })
      .catch(error => {
        console.log("Fetch error: ", error);
      });
  };

  handleSocial = socialInfo => {
    console.log(socialInfo);
    this.setState({
      socialInfo: socialInfo
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
            <h1>Register</h1>
            {this.state.socialInfo ? (
              <p style={{ textAlign: "center", marginTop: "24px" }}>
                Enter Username to finish registration
              </p>
            ) : (
              <React.Fragment>
                <SocialSignup handleSocial={this.handleSocial} />
                <p style={{ textAlign: "center", marginTop: "24px" }}>
                  Or
                  <br />
                  Register by Email
                </p>
              </React.Fragment>
            )}
            <EmailSignup
              handleSignUp={this.handleSignUp}
              socialInfo={this.state.socialInfo}
            />
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
