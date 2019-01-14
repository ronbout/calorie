import React, { Component } from "react";
// eslint-disable-next-line
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

class SocialLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /*   responseFacebook = resp => {
    this.props.handleLogin(resp.email, "social");
  }; */

  responseGoogle = resp => {
    // since prototype, just cheat on email as I use yahoo, not google
    console.log("google resp: ", resp);
    //  email, familyName, givenName, googleId, imageUrl, name
    this.props.handleLogin("ronbout@yahoo.com", "social");
  };

  render() {
    return (
      <React.Fragment>
        <div className="social-login container-fluid d-flex flex-column justify-content-center text-center">
          {/*}       <div>
            <FacebookLogin
              appId="786304568235685"
              autoLoad={true}
              fields="name,email,picture"
              callback={this.responseFacebook}
            />
          </div> */}
          <div>
            <GoogleLogin
              clientId="339494038360-ui9ssd3umvcj4fkjft7ns4ies220l8l3.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SocialLogin;
