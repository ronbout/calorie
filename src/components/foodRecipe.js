import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* const API_BASE = "http://localhost/api/";
const API_FOOD = "foods/recipe";
const API_KEY = "6y9fgv43dl40f9wl"; */

const clearFormFields = {
  formFields: {
    foodName: "",
    foodDesc: "",
    servSize: "",
    servUnits: 0,
    resize: "",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
    fiber: 0,
    points: 0,
    foodFav: false
  }
};

class FoodRecipe extends Component {
  constructor(props) {
    super(props);
    console.log("recipe props: ", this.props);
    this.state = { ...clearFormFields, errMsg: "", confirmMsg: "" };
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let errs = {};
    this.setState({
      formFields: {
        ...this.state.formFields,
        [target.name]: value
      },
      ...errs
    });
  };

  render() {
    return (
      <div style={{ marginBottom: "40px" }} className="food-container">
        {this.state.confirmMsg && (
          <div className="food-basic-confirm">{this.state.confirmMsg}</div>
        )}
        {this.state.errMsg && (
          <div className="food-basic-error">{this.state.errMsg}</div>
        )}
        <form className="basic-food-form" onSubmit={this.handleSubmit}>
          <div className="basic-food-container container-fluid d-flex flex-column justify-content-center">
            <div className="row">
              <div className="food-desc-form-section col-md-6">
                <h1 style={{ margin: "10px 0 20px 0", textAlign: "center" }}>
                  Food Entry
                </h1>
                <div className="form-group">
                  <label htmlFor="foodName">Food Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="foodName"
                    id="foodName"
                    value={this.state.formFields.foodName}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="foodDesc">Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="foodDesc"
                    id="foodDesc"
                    value={this.state.formFields.foodDesc}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="servSize">Serving Size:</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    name="servSize"
                    id="servSize"
                    value={this.state.formFields.servSize}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="servUnits">Serving Units:</label>
                  <select
                    className="custom-select"
                    name="servUnits"
                    id="servUnits"
                    value={this.state.formFields.servUnits}
                    onChange={this.handleInputChange}
                  >
                    <option value="0">Select serving units</option>
                    <option value="1">Grams</option>
                    <option value="2">Oz</option>
                    <option value="3">Cups</option>
                    <option value="1">Tbls</option>
                    <option value="2">Tsp</option>
                    <option value="3">Fl Oz</option>
                  </select>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="foodFav"
                    name="foodFav"
                    className="form-check-input"
                    value={this.state.formFields.foodFav}
                    onChange={this.handleInputChange}
                  />
                  <label htmlFor="foodFav" className="form-check-label">
                    Food Favorite:
                  </label>
                </div>
                {this.state.formFields.servSize > 0 &&
                  this.state.formFields.calories > 0 && (
                    <div className="resize-container">
                      <div className="btn btn-primary resize-button">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.resize}
                          disabled={!this.state.formFields.resize > 0}
                        >
                          Re-Size & Re-Calc Nutrients
                        </button>
                      </div>
                      <FontAwesomeIcon
                        style={{ marginLeft: "20px" }}
                        icon="question"
                      />
                      <div className="form-group">
                        <label htmlFor="resize">New Size:</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          className="form-control"
                          name="resize"
                          id="resize"
                          value={this.state.formFields.resize}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  )}
              </div>
              {
                // Separate Recipe foods section
              }
              <div className="food-nutrient-form-section col-md-6">
                <h2 style={{ margin: "28px 0 8px 0", textAlign: "center" }}>
                  Recipe Ingredients
                </h2>
              </div>
            </div>
            <div className="submit-container" style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                style={{ width: "50%" }}
                disabled={false}
              >
                Create Food
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FoodRecipe;
