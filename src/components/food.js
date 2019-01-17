import React, { Component } from "react";

class Food extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", this.props);
    this.state = {};
  }
  render() {
    return (
      <div className="food-container">
        <h1>Food page</h1>
      </div>
    );
  }
}

export default Food;
