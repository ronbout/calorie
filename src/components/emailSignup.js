import React, { Component } from "react";

class EmailSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className="email-signup container-fluid d-flex flex-column justify-content-center">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
            />
          </div>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Email" />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Confirm password"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EmailSignup;
