import React, { Component } from "react";
import FoodSearch from "./foodSearch";
import FoodBasic from "./foodBasic";
import FoodRecipe from "./foodRecipe";

class FoodSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
      foodInfo: ""
    };
  }

  handleTabClick = tabIndex => {
    this.setState({
      tabIndex
    });
  };

  handleFoodSelect = foodInfo => {
    console.log("parent component food select info: ", foodInfo);
    if (foodInfo.foodType === "Basic Food") {
      // just need to fetch food fav
      // for now, just send data to foodBasic
      this.setState({
        tabIndex: 1,
        foodInfo: foodInfo,
        resize: "",
        foodFav: false
      });
    } else {
      // need to fetch recipe info
      this.setState({
        tabIndex: 2
      });
    }
  };

  render() {
    return (
      <main className="container-fluid fs-main d-flex p-2 bg-highlight">
        <section className="food-setup">
          <h1>Food Setup</h1>
          <ul className="tab-list">
            <li
              data-tab-index="1"
              className={"tab " + (this.state.tabIndex === 1 && "active-tab")}
              onClick={() => this.handleTabClick(1)}
            >
              Basic Food
            </li>
            <li
              data-tab-index="2"
              className={"tab " + (this.state.tabIndex === 2 && "active-tab")}
              onClick={() => this.handleTabClick(2)}
            >
              Food Recipe/Meal
            </li>
          </ul>
          <div className="tab-section">
            {this.state.tabIndex === 1 ? (
              <FoodBasic
                user={this.props.user}
                foodInfo={this.state.foodInfo}
              />
            ) : (
              <FoodRecipe user={this.props.user} />
            )}
          </div>
        </section>
        <FoodSearch
          user={this.props.user}
          handleFoodSelect={this.handleFoodSelect}
        />
      </main>
    );
  }
}

export default FoodSetup;
