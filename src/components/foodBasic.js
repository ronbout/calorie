import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE = "http://localhost/api/";
const API_FOOD = "foods/basic";
const API_KEY = "6y9fgv43dl40f9wl";

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

class FoodBasic extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", this.props);
    this.state = { ...clearFormFields, errMsg: "", confirmMsg: "" };
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log("Food form fields: ", this.state.formFields);
    // clear out any error msg
    this.setState({ errMsg: "", confirmMsg: "" });
    let postBody = {
      ...this.state.formFields,
      apiKey: API_KEY,
      owner: this.props.user.memberId
    };
    // resize is not needed
    delete postBody.resize;
    let postConfig = {
      method: "post",
      body: JSON.stringify(postBody),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(`${API_BASE}${API_FOOD}`, postConfig)
      .then(response => {
        console.log("response: ", response);
        response.json().then(result => {
          result = result.data;
          console.log("Result: ", result);
          // figure out what to do here
          if (result.error) {
            this.setState({
              errMsg:
                result.errorCode === 45001
                  ? `User ${
                      this.props.user.userName
                    } already has a food named ${
                      this.state.formFields.foodName
                    }.`
                  : "An unknown error has occurred"
            });
          } else {
            // success.  let user know and clear out form
            this.setState({
              ...clearFormFields,
              confirmMsg: `Food "${
                this.state.formFields.foodName
              }" has been created.`
            });
          }
        });
      })
      .catch(error => {
        console.log("Fetch error: ", error);
      });
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    // check for serving size entry and default serv units
    // as well as display reSize Calc form
    let sUnits =
      target.name === "servSize" &&
      target.value &&
      this.state.formFields.servUnits === 0
        ? 1
        : this.state.formFields.servUnits;
    let errs = {};
    this.setState({
      formFields: {
        ...this.state.formFields,
        servUnits: sUnits,
        [target.name]: value
      },
      ...errs
    });
  };

  resize = () => {
    const nutFields = [
      "calories",
      "fat",
      "carbs",
      "protein",
      "fiber",
      "points"
    ];
    let newNuts = {};
    const nutMult =
      this.state.formFields.resize / this.state.formFields.servSize;
    console.log(nutMult);
    nutFields.forEach(nutrient => {
      if (this.state.formFields[nutrient]) {
        // round to nearest 1/10th
        newNuts[nutrient] =
          Math.round(this.state.formFields[nutrient] * 10 * nutMult) / 10;
      }
    });
    this.setState({
      formFields: {
        ...this.state.formFields,
        ...newNuts,
        servSize: this.state.formFields.resize
      }
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
                    className="form-control"
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
                // Separate Nutrition section
              }
              <div className="food-nutrient-form-section col-md-6">
                <h2 style={{ margin: "28px 0 8px 0", textAlign: "center" }}>
                  Nutrition Info
                </h2>
                <div className="form-group">
                  <label htmlFor="calories">Calories:</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Calories"
                    id="calories"
                    name="calories"
                    value={this.state.formFields.calories}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fat">Fat Gms:</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Fat Gms"
                    name="fat"
                    id="fat"
                    value={this.state.formFields.fat}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="carbs">Carb Gms:</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Carb Gms"
                    name="carbs"
                    id="carbs"
                    value={this.state.formFields.carbs}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="protein">Protein Gms:</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Protein Gms"
                    name="protein"
                    id="protein"
                    value={this.state.formFields.protein}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fiber">Fiber Gms:</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Fiber Gms"
                    name="fiber"
                    id="fiber"
                    value={this.state.formFields.fiber}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="points">Points (ex. WeightWatchers):</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Points (ex. WeightWatchers) "
                    name="points"
                    id="points"
                    value={this.state.formFields.points}
                    onChange={this.handleInputChange}
                  />
                </div>
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

export default FoodBasic;
