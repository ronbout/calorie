import React, { Component } from "react";
import FoodSearch from "./foodSearch";
import FoodBasic from "./foodBasic";
import FoodRecipe from "./foodRecipe";

const API_BASE = "http://localhost/api/";
const API_FAVS = "foods/notefav";
const API_RECIPE = "foods/recipe";
const API_NUTS = "foods/nutrients";
const API_KEY = "6y9fgv43dl40f9wl";

class FoodSetup extends Component {
  constructor(props) {
    super(props);

    const startMode = 2;
    this.state = {
      tabIndex: startMode,
      searchMode: startMode, // used for FoodSearch so it knows what to do on dblClick
      // 1-New Basic, 2-New Recipe, 3-Edit Basic, 4-Edit Recipe, 5-View Recipe
      foodInfo: "",
      ingred: ""
    };
  }

  handleTabClick = tabIndex => {
    if (tabIndex === this.state.tabIndex) return;
    const foodInfo = "";
    const searchMode = tabIndex;
    this.setState({
      tabIndex,
      foodInfo,
      searchMode
    });
  };

  getFavNoteInfo = foodInfo => {
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
          let notes = result.data ? result.data.note : "";
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
  };

  handleFoodSelect = foodInfo => {
    // clear out any left over ingred
    // now decide what to do based on food type
    if (foodInfo.foodType === "Basic Food") {
      // need to fetch food fav.  start that off first
      this.getFavNoteInfo(foodInfo);
      this.setState({
        tabIndex: 1,
        searchMode: 3,
        foodInfo: foodInfo,
        resize: "",
        ingred: ""
      });
    } else {
      // need to fetch recipe info
      const apiRecipeUrl = `${API_BASE}${API_RECIPE}/${
        foodInfo.foodId
      }?api_key=${API_KEY}`;
      fetch(apiRecipeUrl)
        .then(response => {
          response.json().then(result => {
            // for now assume that food must exist as
            // it came directly from the search api
            // and no foods are deleted
            // eventually add code...just in case
            let recipeInfo = { ...result.data, foodType: "Food Recipe" };
            // check owner against user and change set searchMode accordingly
            const searchMode =
              recipeInfo.ownerId === this.props.user.memberId ? 4 : 5;
            this.setState({
              tabIndex: 2,
              searchMode,
              foodInfo: {
                ...recipeInfo
              },
              ingred: ""
            });
            // send off the fav/notes api
            this.getFavNoteInfo(recipeInfo);
          });
        })
        .catch(error => {
          console.log("Error fetching food recipe: ", error);
        });
    }
  };

  handleAddIngred = foodInfo => {
    // have to get nutrients from api and then load into state
    const apiNutsUrl = `${API_BASE}${API_NUTS}/${
      foodInfo.foodId
    }?api_key=${API_KEY}`;
    fetch(apiNutsUrl)
      .then(response => {
        response.json().then(result => {
          result = result.data;
          // for now assume that food must exist
          let ingredInfo = {
            ingredId: result.id,
            ingredName: result.name,
            ingredDesc: result.description,
            ingredServings: 1,
            ingredNuts: result.nutrients
          };
          this.setState({
            ingred: ingredInfo
          });
        });
      })
      .catch(error => {
        console.log("Error fetching food ingredient: ", error);
      });
  };

  handleNewRecipeName = newName => {
    // weird little routine used to send info from FoodRecipe to sibling
    // FoodSearch so that dblClicks will result in Add Ingredient as user
    // has begun to create a new Recipe/Meal
    this.setState({
      searchMode: newName ? 4 : 2
    });
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
              <FoodRecipe
                user={this.props.user}
                foodInfo={this.state.foodInfo}
                ingred={this.state.ingred}
                handleNewRecipeName={this.handleNewRecipeName}
              />
            )}
          </div>
        </section>
        <FoodSearch
          user={this.props.user}
          searchMode={this.state.searchMode}
          handleFoodSelect={this.handleFoodSelect}
          handleAddIngred={this.handleAddIngred}
        />
      </main>
    );
  }
}

export default FoodSetup;
