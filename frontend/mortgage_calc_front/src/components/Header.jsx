import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <h1>Aditya's Calculator</h1>
      <div className="future-updates-dropdown">
        <span>Future Updates</span>
        <div className="dropdown-content">
          <p>New feature will be added soon</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
