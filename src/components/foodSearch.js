import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE = "http://localhost/api/";
const API_FOOD = "foods/search";
const API_KEY = "6y9fgv43dl40f9wl";

const clearFormFields = {
  formFields: {
    keyword: "",
    foodSelect: 0,
    searchFoodOption: "favFoods"
  }
};

class FoodSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...clearFormFields,
      errMsg: "",
      userMsg: "",
      foodOptions: []
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  componentDidUpdate(prevProps, prevState) {
    // auto refresh the search list
    // if forceRefresh, it is coming in from parent and needs
    // to wait for database update, hence the setTimeout
    if (this.props.forceRefresh !== prevProps.forceRefresh) {
      setTimeout(this.handleSearch, 800);
    }

    // this is just a change in our radio button so immediate
    if (
      this.state.formFields.searchFoodOption !==
      prevState.formFields.searchFoodOption
    ) {
      this.handleSearch();
    }
  }

  handleSearch = event => {
    event && event.preventDefault();
    // build query string with api key added
    const queryObj = {
      ...this.state.formFields,
      api_key: API_KEY,
      owner: this.props.user.memberId
    };
    delete queryObj.foodSelect;
    !queryObj.keyword && delete queryObj.keyword;
    const queryStr =
      "?" +
      Object.keys(queryObj)
        .map(key => key + "=" + queryObj[key])
        .join("&");

    const apiUrl = `${API_BASE}${API_FOOD}${queryStr}`;
    fetch(apiUrl)
      .then(response => {
        response.json().then(result => {
          result = result.data;
          this.setState({
            foodOptions: result ? result : []
          });
        });
      })
      .catch(error => {
        console.log("Fetch error: ", error);
      });
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let errs = {};
    // if the keyword is cleared out and the search option
    // is set to allFoods, changed it back to FavFoods
    let searchFoodOption =
      target.name === "keyword" && target.value === ""
        ? "favFoods"
        : target.name === "searchFoodOption"
        ? target.value
        : this.state.formFields.searchFoodOption;
    this.setState({
      formFields: {
        ...this.state.formFields,
        [target.name]: value,
        searchFoodOption
      },
      ...errs
    });
  };

  handleSelect = () => {
    const selectFoodInfo = this.state.foodOptions[
      this.state.formFields.foodSelect
    ];
    // if a prop was passed down to handle the food select, call it
    this.props.handleFoodSelect && this.props.handleFoodSelect(selectFoodInfo);
  };

  handleAddIngred = () => {
    const selectFoodInfo = this.state.foodOptions[
      this.state.formFields.foodSelect
    ];
    // if a prop was passed down to handle the food select, call it
    this.props.handleAddIngred && this.props.handleAddIngred(selectFoodInfo);
  };

  convertHtmlToText = value => {
    let d = document.createElement("div");
    d.innerHTML = value;
    d.id = "tmp-div";
    let retVal = d.innerText;
    document.body.appendChild(d);
    let tmp = document.getElementById("tmp-div");
    tmp.parentNode.removeChild(tmp);
    return retVal;
  };

  render() {
    return (
      <section className="food-search p-3">
        <h1>Food Search</h1>

        {this.state.userMsg && (
          <div className="food-search-msg">{this.state.userMsg}</div>
        )}
        {this.state.errMsg && (
          <div className="food-search-error">{this.state.errMsg}</div>
        )}

        <form className="food-search-form" onSubmit={this.handleSearch}>
          {/* keyword entry */}
          <div className="form-group">
            <label htmlFor="keyword">Food Name:</label>
            <div id="food-search-row" className="row mx-0">
              <input
                type="text"
                className="form-control"
                name="keyword"
                id="keyword"
                value={this.state.formFields.keyword}
                onChange={this.handleInputChange}
              />
              <button className="btn btn-search mx-1">
                <FontAwesomeIcon icon="search" />
              </button>
            </div>
          </div>
          {/* food List returned from search api */}
          <div className="form-group">
            <select
              className="form-control"
              size="16"
              name="foodSelect"
              id="foodSelect"
              value={this.state.formFields.foodSelect}
              onChange={this.handleInputChange}
            >
              {this.state.foodOptions &&
                this.state.foodOptions.map((foodInfo, ndx) => {
                  let calDisp =
                    foodInfo.foodType === "Basic Food"
                      ? "Calories: " +
                        foodInfo.calories +
                        this.convertHtmlToText("&#013;&#010;") +
                        "Fat: " +
                        foodInfo.fat +
                        this.convertHtmlToText("&#013;&#010;") +
                        "Carbs: " +
                        foodInfo.carbs +
                        this.convertHtmlToText("&#013;&#010;") +
                        "Protein: " +
                        foodInfo.protein +
                        this.convertHtmlToText("&#013;&#010;") +
                        "Fiber: " +
                        foodInfo.fiber
                      : "Food Recipe";
                  return (
                    <option
                      key={ndx}
                      value={ndx}
                      onDoubleClick={
                        this.props.searchMode === 4
                          ? this.handleAddIngred
                          : this.handleSelect
                      }
                      title={
                        foodInfo.foodDesc +
                        this.convertHtmlToText("&#013;&#010;") +
                        "Owner: " +
                        foodInfo.owner +
                        this.convertHtmlToText("&#013;&#010;") +
                        calDisp
                      }
                    >
                      {foodInfo.foodName}
                    </option>
                  );
                })}
            </select>
          </div>
          <p>Hover over food for more details</p>
          {/* select food category (all or user foods - owner or fav) */}
          <div className="form-check">
            <label className="form-check-label" htmlFor="searchFavFoods">
              <input
                type="radio"
                className="form-check-input"
                name="searchFoodOption"
                id="searchFavFoods"
                value="favFoods"
                onChange={this.handleInputChange}
                checked={this.state.formFields.searchFoodOption === "favFoods"}
              />
              Search Fav Foods only
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" htmlFor="searchOwnerFoods">
              <input
                type="radio"
                className="form-check-input"
                name="searchFoodOption"
                id="searchOwnerFoods"
                value="ownerFoods"
                onChange={this.handleInputChange}
                checked={
                  this.state.formFields.searchFoodOption === "ownerFoods"
                }
              />
              Search User Foods (Owned and Fav)
            </label>
          </div>
          <div
            className={`form-check ${
              this.state.formFields.keyword === "" ? "disabled" : ""
            }`}
          >
            <label className="form-check-label" htmlFor="searchAllFoods">
              <input
                type="radio"
                className="form-check-input"
                name="searchFoodOption"
                id="searchAllFoods"
                value="allFoods"
                onChange={this.handleInputChange}
                checked={this.state.formFields.searchFoodOption === "allFoods"}
                disabled={this.state.formFields.keyword === "" ? true : false}
              />
              Search All Foods (keyword required)
            </label>
          </div>
          {/* Select and Refresh buttons 
							 Select sends food up to parent component
							 Refresh submits form to get new food list
						*/}

          <div
            className="search-foods-buttons mt-3"
            style={{ textAlign: "center" }}
          >
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginRight: "15px" }}
              onClick={this.handleSelect}
              disabled={!this.state.foodOptions.length > 0}
            >
              Edit/View
              <br />
              Food
            </button>
            <button className="btn btn-primary" style={{ marginLeft: "15px" }}>
              Refresh
              <br />
              List
            </button>
            {(this.props.searchMode === 4 || this.props.searchMode === 2) && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "30px" }}
                onClick={this.handleAddIngred}
              >
                Add
                <br />
                Ingredient
              </button>
            )}
          </div>
        </form>
      </section>
    );
  }
}

export default FoodSearch;
