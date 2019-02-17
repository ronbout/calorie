import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE = "http://localhost/api/";
const API_FOOD = "foods/basic";
const API_KEY = "6y9fgv43dl40f9wl";

class FoodBasic extends Component {
  constructor(props) {
    super(props);

    this.clearFormFields = {
      formFields: {
        foodId: "",
        foodName: "",
        foodDesc: "",
        foodType: "Basic Food",
        servSize: "",
        servUnits: 1,
        resize: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        fiber: 0,
        points: 0,
        foodFav: false,
        notes: "",
        owner: this.props.user.userName,
        ownerId: this.props.user.memberId
      }
    };

    let foodFav =
      this.props.foodInfo && this.props.foodInfo.foodFav ? true : false;
    this.state =
      this.props.foodInfo && props.foodInfo.foodType === "Basic Food"
        ? {
            formFields: { ...this.props.foodInfo, foodFav, resize: "" },
            errMsg: "",
            confirmMsg: "",
            viewOnly: false
          }
        : { ...this.clearFormFields, errMsg: "", confirmMsg: "" };
    this.state.origForm = this.state.formFields;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.foodInfo !== prevProps.foodInfo) {
      let formFields =
        this.props.foodInfo && this.props.foodInfo.foodType === "Basic Food"
          ? this.props.foodInfo
          : this.clearFormFields;
      // foodFav may be absent coming in from Food Setup while waiting on fetch
      formFields.foodFav = formFields.foodFav ? formFields.foodFav : false;
      // check food owner against user to determine if viewOnly mode
      const viewOnly = formFields.ownerId !== this.props.user.memberId;
      this.setState({
        formFields: { ...formFields, resize: "" },
        origForm: { ...formFields, resize: "" },
        viewOnly
      });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    // just to be sure we didn't get here by error
    if (this.state.viewOnly) return;
    // clear out any error msg
    this.setState({ errMsg: "", confirmMsg: "" });

    let body = {
      ...this.state.formFields,
      apiKey: API_KEY,
      owner: this.props.user.memberId
    };
    // resize is not needed
    delete body.resize;
    // need to know if this is a new food or update
    // (post vs put)
    const foodId = this.state.formFields.foodId;
    const httpMethod = foodId ? "put" : "post";
    const basicUrl = foodId
      ? `${API_BASE}${API_FOOD}/${foodId}`
      : `${API_BASE}${API_FOOD}`;
    let httpConfig = {
      method: httpMethod,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(basicUrl, httpConfig)
      .then(response => {
        response.json().then(result => {
          result = result.data;
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
              ...this.clearFormFields,
              confirmMsg: `Food "${this.state.formFields.foodName}" has been ${
                httpMethod === "post" ? "created." : "updated."
              }`
            });
            this.props.handleChangeMode(1);
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

    let errs = {};
    this.setState({
      formFields: {
        ...this.state.formFields,
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
    this.setState({
      ...this.clearFormFields,
      errMsg: "",
      confirmMsg: "",
      viewOnly: false,
      origForm: this.clearFormFields.formFields
    });
  };

  handleMarkFav = () => {
    const foodFav = !this.state.formFields.foodFav;
    this.setState({
      formFields: { ...this.state.formFields, foodFav }
    });
    this.state.formFields.foodId &&
      this.props.handleMarkFav(this.state.formFields.foodId, foodFav);
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
              <h2>Basic Food View/Entry</h2>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="foodName">
                  Food Name: *
                </label>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    name="foodName"
                    id="foodName"
                    value={this.state.formFields.foodName}
                    onChange={this.handleInputChange}
                    required
                    disabled={this.state.viewOnly}
                  />
                </div>
                <div className="col-sm-4">
                  <p>( * - required field )</p>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="foodDesc">
                  Description:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    name="foodDesc"
                    id="foodDesc"
                    value={this.state.formFields.foodDesc}
                    onChange={this.handleInputChange}
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="servSize">
                  Serving Size:
                </label>
                <div className="col-sm-5">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    name="servSize"
                    id="servSize"
                    value={this.state.formFields.servSize}
                    onChange={this.handleInputChange}
                    disabled={this.state.viewOnly}
                  />
                </div>
                <div className="col-sm-2">
                  <select
                    className="form-control"
                    name="servUnits"
                    id="servUnits"
                    value={this.state.formFields.servUnits}
                    onChange={this.handleInputChange}
                    disabled={this.state.viewOnly}
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
                <label className="col-sm-3 col-form-label" htmlFor="resize">
                  New Size:
                </label>
                <div className="col-sm-5">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    name="resize"
                    id="resize"
                    value={this.state.formFields.resize}
                    onChange={this.handleInputChange}
                    disabled={!recalcFlag || this.state.viewOnly}
                  />
                </div>
                <div className="col-sm-3 resize-button">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleResize}
                    disabled={!this.state.formFields.resize > 0 || !recalcFlag}
                  >
                    Re-Calc
                  </button>
                  <FontAwesomeIcon
                    style={{ marginLeft: "20px" }}
                    icon="question"
                  />
                </div>
              </div>
              <div className="form-group row fav-checkbox">
                <div className="col-sm-3 text-right pr-0">Food Favorite?</div>
                <div className="col-sm-9 form-check">
                  <input
                    type="checkbox"
                    id="foodFav"
                    name="foodFav"
                    className="form-check-input"
                    checked={this.state.formFields.foodFav}
                    onChange={this.handleInputChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            {
              // Separate Nutrition section
            }
            <div className="food-nutrient-form-section">
              <h2>Nutrition Info</h2>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="calories">
                  Calories: *
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="fat">
                  Fat Gms:
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="carbs">
                  Carb Gms:
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="protein">
                  Protein Gms:
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="fiber">
                  Fiber Gms:
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-3 col-form-label" htmlFor="points">
                  Points:
                </label>
                <div className="col-sm-5">
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
                    disabled={this.state.viewOnly}
                  />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label" htmlFor="Owner">
                Food Created by:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  name="owner"
                  id="owner"
                  value={this.state.formFields.owner}
                  disabled
                />
              </div>
              <div className="col-sm-4">
                {this.state.viewOnly && <p>View Only Mode</p>}
              </div>
            </div>
            <div className="fs-btn-container" style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                disabled={
                  this.state.formFields.foodName === "" ||
                  !this.state.formFields.calories > 0 ||
                  this.state.viewOnly
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
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#notesModal"
              >
                Notes
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={this.state.formFields.foodName === ""}
                onClick={this.handleMarkFav}
              >
                {this.state.formFields.foodFav ? "UnMark Fav" : "Mark Fav"}
              </button>
            </div>
          </div>
          {this.state.confirmMsg && (
            <div className="food-basic-confirm">{this.state.confirmMsg}</div>
          )}
          {this.state.errMsg && (
            <div className="food-basic-error">{this.state.errMsg}</div>
          )}
          <div
            className="modal fade"
            id="notesModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="notesModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="notesModalLabel">
                    Notes{" "}
                    {this.state.formFields.foodName !== "" &&
                      "for " + this.state.formFields.foodName}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body notes-modal">
                  <label>
                    <textarea
                      cols="45"
                      rows="10"
                      name="notes"
                      id="notes"
                      placeholder="Enter useful information about the food such as preparation tips"
                      value={this.state.formFields.notes}
                      onChange={this.handleInputChange}
                      disabled={this.state.viewOnly}
                    />
                  </label>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FoodBasic;
