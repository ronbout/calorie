import React, { Component } from "react";
import GoogleLogin from "react-google-login";

class socialSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  responseGoogle = resp => {
    // get name and email, send up to parent to transfer to email form
    console.log("google resp: ", resp.profileObj);
    //  email, familyName, givenName, googleId, imageUrl, name
    const googleInfo = {
      firstName: resp.profileObj.givenName,
      lastName: resp.profileObj.familyName,
      email: resp.profileObj.email
    };
    this.props.handleSocial(googleInfo);
  };

  render() {
    return (
      <React.Fragment>
        <div className="social-signup container-fluid d-flex flex-column justify-content-center text-center">
          {/*<div>
            <button className="btn btn-outline-secondary social-btn">
              <h2>Sign Up with Facebook</h2>
            </button>
          </div>*/}
          <div>
            <GoogleLogin
              clientId="339494038360-ui9ssd3umvcj4fkjft7ns4ies220l8l3.apps.googleusercontent.com"
              buttonText="Register with Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default socialSignup;
