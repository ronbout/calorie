import React, { Component } from "react";

class socialSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /****
   * nothing has been written for sign up yet
   * will need to take info and add to database
   * through api.  if google login, may need to ask
   * more info
   */

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
