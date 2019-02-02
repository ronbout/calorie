import React, { Component } from "react";
import FoodSearch from "./foodSearch";
import FoodBasic from "./foodBasic";
import FoodRecipe from "./foodRecipe";

const API_BASE = "http://localhost/api/";
const API_FAVS = "foods/notefav";
const API_KEY = "6y9fgv43dl40f9wl";

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
    // need to fetch food fav.  start that off first
    const apiFavUrl = `${API_BASE}${API_FAVS}/${
      foodInfo.foodId
    }?api_key=${API_KEY}`;
    fetch(apiFavUrl)
      .then(response => {
        response.json().then(result => {
          // check for no data and set food fav flag
          let foodFav = false;
          foodFav =
            result.data !== undefined &&
            result.data.favs !== undefined &&
            result.data.favs
              .map(obj => obj.memberId)
              .indexOf(this.props.user.memberId) >= 0;
          const notes = result.data.note;
          console.log("foodFav: ", foodFav);
          this.setState({
            foodInfo: {
              ...foodInfo,
              foodFav,
              notes
            }
          });
        });
      })
      .catch(error => {
        console.log("Error fetching food favorites: ", error);
      });
    // now decide what to do based on food type
    if (foodInfo.foodType === "Basic Food") {
      this.setState({
        tabIndex: 1,
        foodInfo: foodInfo,
        resize: ""
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
