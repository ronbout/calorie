import React, { Component } from "react";
import SocialSignup from "./socialSignup";
import EmailSignup from "./emailSignup";

class SignUp extends Component {
  constructor(props) {
    super(props);
    console.log("this: ", this);
    console.log("props: ", this.props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={{ backgroundColor: "yellow", color: "blue" }}
        className="container-fluid"
      >
        <h1>Sign Up</h1>
        <SocialSignup />
        <EmailSignup />
      </div>
    );
  }
}

export default SignUp;
