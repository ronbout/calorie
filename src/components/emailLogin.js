import React, { Component } from "react";
import { isEmail } from "../assets/js/library";

class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", emailErr: false };
  }

  handleSubmit = event => {
    event.preventDefault();
    const emailValid = isEmail(this.state.email);
    if (emailValid) {
      this.props.handleLogin(this.state.email, this.state.password);
    } else {
      this.setState({ emailErr: true });
    }
  };

  handleInputChange = event => {
    const target = event.target;
    let errs = {};
    if (target.name === "email" && isEmail(target.value)) {
      errs = { ...errs, emailErr: false };
    }
    this.setState({
      [target.name]: target.value,
      ...errs
    });
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="email-login container-fluid d-flex flex-column justify-content-center text-center">
            <h2>or</h2>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>
            {this.state.emailErr && (
              <div className="formErr">Invalid Email</div>
            )}
            <div className="input-group">
              <input
                type="password"
                className="form-control"
                placeholder="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
            <button className="btn btn-primary">Login with Email</button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default EmailLogin;
