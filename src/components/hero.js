import React from "react";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <header className="hero">
      <div className="container text-center">
        <h1>Calorie Meter</h1>
        <p>
          Know what you put into your body.
          <br />
          Achieve the best version of YOU.
        </p>
        <NavLink to="/signup">
          <button className="learn btn btn-danger">Sign Up</button>
        </NavLink>
      </div>
    </header>
  );
};

export default Hero;
