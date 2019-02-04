import React, { Component } from "react";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FoodRecipe extends Component {
  constructor(props) {
    super(props);

    this.clearIngredsRow = {
      ingredId: "",
      ingredName: "",
      ingredDesc: "",
      ingredServings: ""
    };

    this.clearFormFields = {
      formFields: {
        foodId: "",
        foodName: "",
        foodDesc: "",
        foodType: "Food Recipe",
        recipeServs: 1,
        servSize: "",
        servUnits: 1,
        servNuts: {
          calories: 0,
          fat: 0,
          carbs: 0,
          protein: 0,
          fiber: 0,
          points: 0
        },
        foodFav: false,
        notes: "",
        ingreds: [],
        owner: this.props.user.userName,
        ownerId: this.props.user.memberId
      }
    };

    let foodFav =
      this.props.foodInfo && this.props.foodInfo.foodFav ? true : false;
    this.state =
      this.props.foodInfo && this.props.foodInfo.foodType === "Food Recipe"
        ? {
            formFields: { ...this.props.foodInfo, foodFav, resize: "" },
            errMsg: "",
            confirmMsg: ""
          }
        : { ...this.clearFormFields, errMsg: "", confirmMsg: "" };
    this.state.origForm = this.state.formFields;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.foodInfo !== prevProps.foodInfo) {
      let formFields =
        this.props.foodInfo && this.props.foodInfo.foodType === "Food Recipe"
          ? this.props.foodInfo
          : this.clearFormFields;
      // foodFav may be absent coming in from Food Setup while waiting on fetch
      formFields.foodFav = formFields.foodFav ? formFields.foodFav : false;
      this.setState({
        formFields: { ...formFields },
        origForm: { ...formFields }
      });
    } else if (this.props.ingred && this.props.ingred !== prevProps.ingred) {
      // have to calculate the new nutrient value for the recipe and update state
      let ingreds = this.state.formFields.ingreds;
      ingreds.push(this.props.ingred);
      let servNuts = this.calcServNuts(ingreds);
      this.setState({
        formFields: { ...this.state.formFields, ingreds, servNuts }
      });
    }
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

  handleClear = () => {
    this.setState({
      ...this.clearFormFields,
      errMsg: "",
      confirmMsg: "",
      origForm: this.clearFormFields.formFields
    });
  };

  calcServNuts = ingreds => {
    let newNuts = {
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
      fiber: 0,
      points: 0
    };
    ingreds.forEach(ingred => {
      newNuts.calories += ingred.ingredNuts.calories * ingred.ingredServings;
      newNuts.fat += ingred.ingredNuts.fat * ingred.ingredServings;
      newNuts.carbs += ingred.ingredNuts.carbs * ingred.ingredServings;
      newNuts.protein += ingred.ingredNuts.protein * ingred.ingredServings;
      newNuts.fiber += ingred.ingredNuts.fiber * ingred.ingredServings;
      newNuts.points += ingred.ingredNuts.points * ingred.ingredServings;
    });
    return newNuts;
  };

  render() {
    return (
      <div className="food-container">
        <form className="food-recipe-form" onSubmit={this.handleSubmit}>
          <input
            type="hidden"
            name="foodId"
            value={this.state.formFields.foodId}
          />
          <div className="food-recipe-container container-fluid d-flex flex-column justify-content-center">
            <div className="food-desc-form-section">
              <h2>Food Recipe Entry</h2>
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
              <div className="form-group row fav-checkbox">
                <div className="col-sm-2 text-right pr-0">Food Favorite?</div>
                <div className="col-sm-10 form-check">
                  <input
                    type="checkbox"
                    id="foodFav"
                    name="foodFav"
                    className="form-check-input"
                    checked={this.state.formFields.foodFav}
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
              // display nutrients / serving
            }
            <div className="row serv-nuts">
              <div className="form-group col-sm-2">
                <label htmlFor="calories">Calories</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="calories"
                  id="calories"
                  value={this.state.formFields.servNuts.calories}
                  disabled
                />
              </div>
              <div className="form-group col-sm-2">
                <label htmlFor="fat">Fat</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="fat"
                  id="fat"
                  value={this.state.formFields.servNuts.fat}
                  disabled
                />
              </div>
              <div className="form-group col-sm-2">
                <label htmlFor="carbs">Carbs</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="carbs"
                  id="carbs"
                  value={this.state.formFields.servNuts.carbs}
                  disabled
                />
              </div>
              <div className="form-group col-sm-2">
                <label htmlFor="protein">Protein</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="protein"
                  id="protein"
                  value={this.state.formFields.servNuts.protein}
                  disabled
                />
              </div>
              <div className="form-group col-sm-2">
                <label htmlFor="fiber">Fiber</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="fat"
                  id="fiber"
                  value={this.state.formFields.servNuts.fiber}
                  disabled
                />
              </div>
              <div className="form-group col-sm-2">
                <label htmlFor="points">Points</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  name="points"
                  id="points"
                  value={this.state.formFields.servNuts.points}
                  disabled
                />
              </div>
            </div>
            {
              // Separate Recipe foods section
            }
            <div className="food-recipe-form-section">
              <h2>Recipe Ingredients</h2>
              <p>(Use the Food Search box to Add an Ingredient)</p>
              {// loop through the state ingreds array
              // to load the ingredients plus a blank
              // row to add a new ingred
              this.state.formFields.ingreds.map((ingred, ndx) => (
                <div key={ingred.ingredId} className="row">
                  <input
                    type="text"
                    name={"ingred" + ndx}
                    value={ingred.ingredName}
                    disabled
                  />
                </div>
              ))}
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label" htmlFor="Owner">
                Created by:
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  name="owner"
                  id="owner"
                  value={this.state.formFields.owner}
                  disabled={true}
                />
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
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#notesModal"
              >
                Notes
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

export default FoodRecipe;
