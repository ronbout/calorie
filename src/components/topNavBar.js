import React from "react";
import { NavLink } from "react-router-dom";

const TopNavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          <h3 className="brand">Calorie Meter</h3>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#topmenu"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="topmenu">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <NavLink to="/" exact className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/news" className="nav-link">
                News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
            {user.memberId ? (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink to="/food/search" className="nav-link">
                    Food Search
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/food/setup" className="nav-link">
                    Food Setup
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {user.userName}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink to="/login" className="login-link nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/signup" className="nav-link">
                    Sign Up
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
