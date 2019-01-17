import React, { Component } from "react";

class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  };

  handleInputChange = event => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
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
                type="text"
                className="form-control"
                placeholder="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>
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
