import React, { Component } from "react";

class Member extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", this.props);
  }
  render() {
    console.log(this.props);
    return (
      <div className="container-fluid">
        <h1>Member Page</h1>
        {this.props.user && <h2>{this.props.user.email}</h2>}
      </div>
    );
  }
}

export default Member;
