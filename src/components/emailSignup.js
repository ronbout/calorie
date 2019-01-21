import React, { Component } from "react";
import { isEmail } from "../assets/js/library";

class EmailSignup extends Component {
  constructor(props) {
    super(props);
    // set up ref for assigning focus
    this.usernameInput = React.createRef();
    this.state = {
      formFields: {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: ""
      },
      emailErr: false,
      passErr: false,
      socialFlag: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.props.socialInfo !== prevProps.socialInfo) {
      const socialInfo = this.props.socialInfo;
      this.setState({
        formFields: {
          ...prevState.formFields,
          firstName:
            socialInfo && socialInfo.firstName ? socialInfo.firstName : "",
          lastName:
            socialInfo && socialInfo.lastName ? socialInfo.lastName : "",
          email: socialInfo && socialInfo.email ? socialInfo.email : ""
        },
        socialFlag: socialInfo ? true : false
      });
      socialInfo && this.usernameInput.current.focus();
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const emailValid = isEmail(this.state.formFields.email);
    const passValid =
      this.state.formFields.password === this.state.formFields.password2;
    if (passValid && emailValid) {
      this.props.handleSignUp(this.state.formFields);
    } else {
      !emailValid && this.setState({ emailErr: true });
      !passValid && this.setState({ passErr: true });
    }
  };

  handleInputChange = event => {
    const target = event.target;
    // test form and enable Submit if valid
    // provide error feedback
    let errs = {};
    if (target.name === "email" && isEmail(target.value)) {
      errs = { ...errs, emailErr: false };
    }
    if (
      target.name === "password" ||
      (target.name === "password2" && target.value !== "")
    ) {
      // check for matching passwords
      const checkField = target.name === "password" ? "password2" : "password";
      if (this.state.formFields[checkField] === target.value) {
        errs = { ...errs, passErr: false };
      }
    }
    this.setState({
      formFields: {
        ...this.state.formFields,
        [target.name]: target.value
      },
      ...errs
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="email-signup container-fluid d-flex flex-column justify-content-center">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="userName"
              ref={this.usernameInput}
              value={this.state.formFields.userName}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              value={this.state.formFields.firstName}
              onChange={this.handleInputChange}
              required
              disabled={this.state.socialFlag}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              value={this.state.formFields.lastName}
              onChange={this.handleInputChange}
              required
              disabled={this.state.socialFlag}
            />
          </div>
          {!this.state.socialFlag && (
            <React.Fragment>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={this.state.formFields.email}
                  onChange={this.handleInputChange}
                  required
                  disabled={this.state.socialFlag}
                />
              </div>
              {this.state.emailErr && (
                <div className="formErr">Invalid Email</div>
              )}
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={this.state.formFields.password}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  name="password2"
                  value={this.state.formFields.password2}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              {this.state.passErr && (
                <div className="formErr">Passwords must match</div>
              )}
            </React.Fragment>
          )}
          <button
            className="btn btn-primary"
            disabled={this.state.passErr || this.state.emailErr}
          >
            Register
          </button>
        </div>
      </form>
    );
  }
}

export default EmailSignup;
