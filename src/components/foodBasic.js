import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE = "http://localhost/api/";
const API_FOOD = "foods/basic";
const API_KEY = "6y9fgv43dl40f9wl";

const clearFormFields = {
  formFields: {
    foodId: "",
    foodName: "",
    foodDesc: "",
    servSize: "",
    servUnits: 1,
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
    this.state = this.props.foodInfo
      ? {
          formFields: { ...this.props.foodInfo, resize: "" },
          errMsg: "",
          confirmMsg: ""
        }
      : { ...clearFormFields, errMsg: "", confirmMsg: "" };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.foodInfo !== prevProps.foodInfo) {
      let formFields = this.props.foodInfo
        ? this.props.foodInfo
        : clearFormFields;

      this.setState({
        formFields: { ...formFields, resize: "" }
      });
    }
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

  handleResize = () => {
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

  handleClear = () => {
    this.setState({ ...clearFormFields, errMsg: "", confirmMsg: "" });
  };

  render() {
    let recalcFlag =
      this.state.formFields.servSize > 0 && this.state.formFields.calories > 0;
    return (
      <div className="food-container">
        <form className="basic-food-form" onSubmit={this.handleSubmit}>
          <input
            type="hidden"
            name="foodId"
            value={this.state.formFields.foodId}
          />
          <div className="basic-food-container container-fluid d-flex flex-column justify-content-center">
            <div className="food-desc-form-section">
              <h2 style={{ margin: "10px 0 20px 0", textAlign: "center" }}>
                Food Entry
              </h2>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="foodName">
                  Food Name: *
                </label>
                <div className="col-sm-7">
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
                <div className="col-sm-3">
                  <p>( * - required field )</p>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="foodDesc">
                  Description:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="foodDesc"
                    id="foodDesc"
                    value={this.state.formFields.foodDesc}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="servSize">
                  Serving Size:
                </label>
                <div className="col-sm-6">
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
                <div className="col-sm-3">
                  <select
                    className="form-control"
                    name="servUnits"
                    id="servUnits"
                    value={this.state.formFields.servUnits}
                    onChange={this.handleInputChange}
                  >
                    <option value="1">Grams</option>
                    <option value="2">Oz</option>
                    <option value="3">Cups</option>
                    <option value="1">Tbls</option>
                    <option value="2">Tsp</option>
                    <option value="3">Fl Oz</option>
                  </select>
                </div>
              </div>
              <div className="resize-container form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="resize">
                  New Size:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    name="resize"
                    id="resize"
                    value={this.state.formFields.resize}
                    onChange={this.handleInputChange}
                    disabled={!recalcFlag}
                  />
                </div>
                <div className="col-sm-3 resize-button">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleResize}
                    disabled={!this.state.formFields.resize > 0 || !recalcFlag}
                  >
                    Re-Calc Nutrients
                  </button>
                  <FontAwesomeIcon
                    style={{ marginLeft: "20px" }}
                    icon="question"
                  />
                </div>
              </div>
              <div className="form-group row fav-checkbox">
                <div className="col-sm-2 text-right pr-0">Food Favorite?</div>
                <div className="col-sm-10 form-check">
                  <input
                    type="checkbox"
                    id="foodFav"
                    name="foodFav"
                    className="form-check-input"
                    value={this.state.formFields.foodFav}
                    onChange={this.handleInputChange}
                  />
                  <label
                    className="col-sm-2 col-form-label form-check-label"
                    htmlFor="foodFav"
                  >
                    Yes
                  </label>
                </div>
              </div>
            </div>
            {
              // Separate Nutrition section
            }
            <div className="food-nutrient-form-section">
              <h2>Nutrition Info</h2>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="calories">
                  Calories: *
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    className="form-control"
                    placeholder="Calories"
                    id="calories"
                    name="calories"
                    value={this.state.formFields.calories}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="fat">
                  Fat Gms:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    placeholder="Fat Gms"
                    name="fat"
                    id="fat"
                    value={this.state.formFields.fat}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="carbs">
                  Carb Gms:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    placeholder="Carb Gms"
                    name="carbs"
                    id="carbs"
                    value={this.state.formFields.carbs}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="protein">
                  Protein Gms:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    placeholder="Protein Gms"
                    name="protein"
                    id="protein"
                    value={this.state.formFields.protein}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="fiber">
                  Fiber Gms:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    placeholder="Fiber Gms"
                    name="fiber"
                    id="fiber"
                    value={this.state.formFields.fiber}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="points">
                  Points:
                </label>
                <div className="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
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
            <div className="fs-btn-container" style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                disabled={
                  !this.state.formFields.foodName === "" ||
                  !this.state.formFields.calories > 0
                }
              >
                {this.state.formFields.foodId === ""
                  ? "Add Food"
                  : "Update Food"}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={this.handleClear}
              >
                Clear
              </button>
            </div>
          </div>
          {this.state.confirmMsg && (
            <div className="food-basic-confirm">{this.state.confirmMsg}</div>
          )}
          {this.state.errMsg && (
            <div className="food-basic-error">{this.state.errMsg}</div>
          )}
        </form>
      </div>
    );
  }
}

export default FoodBasic;
