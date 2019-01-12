import React, { Component } from "react";
import Hero from "./hero";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Hero />
      </React.Fragment>
    );
  }
}

export default LandingPage;
