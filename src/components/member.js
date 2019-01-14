import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Member extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", this.props);
  }
  render() {
    return (
      // check for user logged in
      this.props.user.memberId ? (
        this.props.user.memberId.toString() === this.props.urlid ? (
          <div className="container-fluid">
            <h1>Member Page</h1>
            {this.props.user && <h2>{this.props.user.email}</h2>}
          </div>
        ) : (
          <Redirect to="/" />
        )
      ) : (
        <Redirect to="/login" />
      )
    );
  }
}

export default Member;
