import React, { Component } from "react";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE = "http://localhost/api/";
const API_RECIPE = "foods/recipe";
const API_KEY = "6y9fgv43dl40f9wl";

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
            confirmMsg: "",
            viewOnly: false
          }
        : { ...this.clearFormFields, errMsg: "", confirmMsg: "" };
    this.state.origForm = this.state.formFields;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props)
    if (this.props.foodInfo !== prevProps.foodInfo) {
      let formFields =
        this.props.foodInfo && this.props.foodInfo.foodType === "Food Recipe"
          ? this.props.foodInfo
          : this.clearFormFields;
      // foodFav may be absent coming in from Food Setup while waiting on fetch
      formFields.foodFav = formFields.foodFav ? formFields.foodFav : false;
      // check food owner against user to determine if viewOnly mode
      const viewOnly = formFields.ownerId !== this.props.user.memberId;
      this.setState({
        formFields: { ...formFields },
        origForm: { ...formFields },
        viewOnly
      });
    } else if (this.props.ingred && this.props.ingred !== prevProps.ingred) {
      let ingreds = this.state.formFields.ingreds;
      // make sure that this ingredient does not already exist
      if (
        ingreds.map(obj => obj.ingredId).indexOf(this.props.ingred.ingredId) >=
        0
      ) {
        this.setState({
          errMsg: "That ingredient is already included."
        });
      } else {
        // have to calculate the new nutrient value for the recipe and update state
        ingreds.push(this.props.ingred);
        let servNuts = this.calcServNuts(ingreds);
        this.setState({
          formFields: { ...this.state.formFields, ingreds, servNuts }
        });
      }
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
    // foodType and servNuts not needed
    delete body.foodType;
    delete body.servNuts;
    const foodId = this.state.formFields.foodId;
    const httpMethod = foodId ? "put" : "post";
    const recipeUrl = foodId
      ? `${API_BASE}${API_RECIPE}/${foodId}`
      : `${API_BASE}${API_RECIPE}`;
    let httpConfig = {
      method: httpMethod,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(recipeUrl, httpConfig)
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
              formFields: { ...this.clearFormFields.formFields, ingreds: [] },
              confirmMsg: `Food "${this.state.formFields.foodName}" has been ${
                httpMethod === "post" ? "created." : "updated."
              }`
            });
            // change the search mode so that dbl click on search form does
            // not try to add an ingredient, but pulls up that food
            this.props.handleChangeMode(2);
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
    const changeMode =
      target.name === "foodName" &&
      ((this.state.formFields.foodName === "" && target.value !== "") ||
        (this.state.formFields.foodName !== "" && target.value === ""));

    let errs = {};
    this.setState({
      formFields: {
        ...this.state.formFields,
        [target.name]: value
      },
      ...errs
    });
    if (changeMode) this.props.handleNewRecipeName(target.value);
  };

  handleIngredServChange = (ndx, event) => {
    const target = event.target;

    let ingreds = this.state.formFields.ingreds;
    ingreds[ndx].ingredServings = target.value;

    let servNuts = this.calcServNuts(ingreds);
    this.setState({
      formFields: { ...this.state.formFields, ingreds, servNuts }
    });
  };

  handleClear = () => {
    this.setState({
      formFields: { ...this.clearFormFields.formFields, ingreds: [] },
      errMsg: "",
      confirmMsg: "",
      viewOnly: false,
      origForm: this.clearFormFields.formFields
    });
    this.props.handleNewRecipeName("");
  };

  handleDelIngred = (ndx, event) => {
    console.log(ndx);
    let ingreds = this.state.formFields.ingreds;
    ingreds.splice(ndx, 1);

    let servNuts = this.calcServNuts(ingreds);
    this.setState({
      formFields: { ...this.state.formFields, ingreds, servNuts }
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
              <h2>Food Recipe View/Entry</h2>
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
                    disabled={this.state.viewOnly}
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
                    disabled={this.state.viewOnly}
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
                    disabled={this.state.viewOnly}
                  />
                </div>
                <div className="col-sm-3">
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
              <div className="form-group row fav-checkbox">
                <div className="col-sm-2 text-right pr-0">Food Favorite?</div>
                <div className="col-sm-10 form-check">
                  <input
                    type="checkbox"
                    id="foodFav"
                    name="foodFav"
                    className="form-check-input"
                    checked={this.state.formFields.foodFav}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="recipeServ">
                  Servings Per Recipe:
                </label>
                <div className="col-sm-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    name="recipeServs"
                    id="recipeServs"
                    value={this.state.formFields.recipeServs}
                    onChange={this.handleInputChange}
                    disabled={this.state.viewOnly}
                  />
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
              {this.state.formFields.ingreds.length > 0 && (
                <div className="row">
                  <div className="col-sm-4">Ingredient Name</div>
                  <div className="col-sm-4">Description</div>
                  <div className="col-sm-2">Servings</div>
                  {!this.state.viewOnly && (
                    <div className="col-sm-1">Delete</div>
                  )}
                </div>
              )}
              {// loop through the state ingreds array
              // to load the ingredients plus a blank
              // row to add a new ingred
              this.state.formFields.ingreds.map((ingred, ndx) => (
                <div key={ingred.ingredId} className="row ingred-row">
                  <input
                    className="col-sm-4"
                    type="text"
                    name={"ingred" + ndx}
                    value={ingred.ingredName}
                    disabled
                  />
                  <input
                    className="col-sm-4"
                    type="text"
                    name={"ingredDesc" + ndx}
                    value={ingred.ingredDesc}
                    disabled
                  />
                  <input
                    className="col-sm-2"
                    type="number"
                    min="0.1"
                    step="0.01"
                    name={"ingredServ" + ndx}
                    value={ingred.ingredServings}
                    onChange={event => this.handleIngredServChange(ndx, event)}
                    disabled={this.state.viewOnly}
                  />
                  {!this.state.viewOnly && (
                    <button
                      type="button"
                      className="col-sm-1 btn btn-danger"
                      onClick={event => this.handleDelIngred(ndx, event)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label" htmlFor="Owner">
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
              <div className="col-sm-5">
                {this.state.viewOnly && <p>View Only Mode</p>}
              </div>
            </div>
            <div className="fs-btn-container" style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                disabled={
                  this.state.formFields.foodName === "" ||
                  this.state.formFields.ingreds.length === 0 ||
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

export default FoodRecipe;
