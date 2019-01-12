import React from "react";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <header className="hero">
      <div className="container text-center">
        <h1>Calorie Meter</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Exercitationem rem nobis quasi.
        </p>
        <NavLink to="/signup">
          <button className="learn btn btn-danger">Sign Up</button>
        </NavLink>
      </div>
    </header>
  );
};

export default Hero;
