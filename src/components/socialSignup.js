import React, { Component } from "react";

class socialSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className="social-signup container-fluid d-flex flex-column justify-content-center text-center">
          <div>
            <button className="btn btn-outline-secondary social-btn">
              <h2>Sign Up with Facebook</h2>
            </button>
          </div>
          <div>
            <button className="btn btn-outline-secondary social-btn">
              <h2>Sign Up with Google</h2>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default socialSignup;
